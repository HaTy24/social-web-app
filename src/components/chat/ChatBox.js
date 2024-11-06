import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { DateTime } from "luxon";
import { WS_TOPIC, getStaticURL } from "../../constants";
import { WebSocketCtx } from "../../providers/WebSocketProvider";
import { chatService } from "../../services/ChatService";
import { customFormat } from "../../utils/Number";
import Loading from "../loading";
import { ChatCorner } from "../styles/chat";
import { Header } from "../styles/common";
import {
  CountMessage,
  PeopleFlex,
  TweetDetails,
  User,
  UserBalance,
  UserImage,
} from "../styles/profile";
import NoMessageNotification from "./NoMessageNotification";
import { INCREASE_TOTAL_MESSAGES_UNREAD } from "../../redux/actions";
import i18next from "i18next";
import { convertDate } from "../../utils/convertDate";

const ChatBox = () => {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);

  const [chatRooms, setChatRooms] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isScroll, setIsScroll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShouldLoadMore, setIsShouldLoadMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { webSocket } = useContext(WebSocketCtx);
  const [isAfterFirstLoad, setIsAfterFirstLoad] = useState(false);
  const chatBoxRef = useRef(null);
  const headerRef = useRef(null);
  const [{ offset, limit }, setPaginations] = useState({
    offset: 0,
    limit: 12,
  });

  const userId = user.id;
  const dispatch = useDispatch();

  const getChatRooms = async (pagination) => {
    try {
      pagination.offset === 0 ? setIsLoading(true) : setIsLoadingMore(true);
      const newPagination =
        pagination.offset === 0 ? handleChangePaginate() : pagination;
      const response = await chatService.getListChat(newPagination);
      if (response.success && response.data) {
        const dataChatRoom = response.data.rows.map((room) => ({
          ...room,
          receiver: room.participants.find(
            (participant) => participant.id !== userId
          ),
        }));
        pagination.offset === 0 ? setIsLoading(false) : setIsLoadingMore(false);
        setChatRooms((prevChatRoms) => [...prevChatRoms, ...dataChatRoom]);
        setTotalCount(response.data.total);
        pagination.offset === 0 && setIsShouldLoadMore(true);
      }
      pagination.offset === 0 ? setIsLoading(false) : setIsLoadingMore(false);
    } catch (error) {
      pagination.offset === 0 ? setIsLoading(false) : setIsLoadingMore(false);
      console.log(error);
    }
  };

  const getChat = async (chatId) => {
    try {
      const response = await chatService.getChat(chatId);
      if (response.success && response.data) {
        const data = {
          ...response.data,
          receiver: response.data.participants.find(
            (participant) => participant.id !== userId
          ),
        };

        const dataChatRoom = [...chatRooms];

        const foundIndex = dataChatRoom.findIndex((x) => x.id == chatId);

        if (foundIndex < 0) {
          dataChatRoom.unshift(data);
          setPaginations({
            limit,
            offset: offset + 1,
          });
        } else if (foundIndex === 0) {
          dataChatRoom[foundIndex] = data;
        } else {
          dataChatRoom.splice(foundIndex, 1);
          dataChatRoom.unshift(data);
        }
        setChatRooms(dataChatRoom);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (webSocket) {
      webSocket.on(WS_TOPIC.SEND_MESSAGE, (data) => {
        getChat(data.chatId);
        if (data.fromUserId != user.id) {
          dispatch({ type: INCREASE_TOTAL_MESSAGES_UNREAD, payload: 1 });
        }
      });
      webSocket.on(WS_TOPIC.REPLY_MESSAGE, (data) => {
        getChat(data.chatId);
        if (data.fromUserId != user.id) {
          dispatch({ type: INCREASE_TOTAL_MESSAGES_UNREAD, payload: 1 });
        }
        webSocket.on(WS_TOPIC.DELETE_MESSAGE, (data) => {
          getChat(data.chatId);
        });
      });
    }

    return () => {
      webSocket.off(WS_TOPIC.SEND_MESSAGE);
      webSocket.off(WS_TOPIC.REPLY_MESSAGE);
      webSocket.off(WS_TOPIC.DELETE_MESSAGE);
    };
  }, [webSocket, chatRooms]);

  useEffect(() => {
    setIsAfterFirstLoad(true);
    getChatRooms({ offset, limit });
  }, [isScroll]);

  useEffect(() => {
    if (chatRooms.length > 0 && isAfterFirstLoad) {
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isAfterFirstLoad, chatRooms]);

  const handleChangePaginate = () => {
    if (headerRef.current) {
      const heightHeader = headerRef.current.getBoundingClientRect().height;
      const documentHeight = document.documentElement.scrollHeight;
      const newLimit = Math.ceil((documentHeight - heightHeader) / 70);
      setPaginations({
        limit: newLimit,
        offset,
      });
      return {
        limit: newLimit,
        offset,
      };
    }
  };

  const handleScroll = async () => {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - 1;

    const isScrolledToBottom = windowHeight + scrollY >= documentHeight;
    const shouldLoadMore =
      isScrolledToBottom &&
      !isLoading &&
      isAfterFirstLoad &&
      offset <= totalCount;
    if (shouldLoadMore) {
      setPaginations({
        limit,
        offset: offset + limit,
      });
      setIsScroll(!isScroll);
    }
  };

  const checkDescription = (message) => {
    switch (message) {
      case "this message was deleted due to inappropriate content":
        return i18next.t("message.messageDeletedInappropriateContent");
      case "this message has been deleted":
        return i18next.t("message.messageDeletedContent");
      default:
        return i18next.t("message.messageDeletedContent");
    }
  };
  // if (isLoading) return <Loading />;
  return (
    <ChatCorner
      ref={chatBoxRef}
      style={{ position: "relative" }}
      border={theme.border}
    >
      <Header
        ref={headerRef}
        color={theme.color}
        border={theme.border}
        bg={theme.bg}
      >
        <h2>{i18next.t("message.title")}</h2>
      </Header>
      {isLoading || !isAfterFirstLoad ? (
        <Loading />
      ) : chatRooms.length > 0 ? (
        chatRooms.map((chatRoom, idx) => {
          return (
            <React.Fragment key={idx}>
              {chatRoom?.receiver && (
                <Link key={chatRoom.id} to={`/messages/${chatRoom.id}`}>
                  <PeopleFlex
                    hover
                    tweetHov={theme.tweetHov}
                    style={{
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "4px",
                    }}
                  >
                    <User style={{ width: "auto" }}>
                      <UserImage src={chatRoom?.receiver.imageUrl} />
                      <UserBalance>
                        <span>
                          {customFormat(chatRoom?.receiver?.share?.buyPrice ? chatRoom?.receiver?.share?.buyPrice : 0 || 0, 3)}
                        </span>
                        <img
                          src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
                          alt="discord"
                        />
                      </UserBalance>
                      {Number(chatRoom?.unreadCount) > 0 && (
                        <CountMessage
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            color: "white",
                          }}
                        >
                          {Number(chatRoom?.unreadCount) > 9
                            ? "9+"
                            : chatRoom?.unreadCount}
                        </CountMessage>
                      )}
                    </User>
                    <div
                      style={{
                        // width: "80%",
                        display: "flex",
                        alignItems: "start",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <TweetDetails color={theme.color}>
                        <p
                          style={{
                            textOverflow: "ellipsis",
                            color: theme.color,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: window.matchMedia("(max-width: 350px)")
                              .matches
                              ? "140px"
                              : "none",
                          }}
                        >
                          {chatRoom?.receiver.fullName}
                        </p>
                        {chatRoom?.lastMessage &&
                          chatRoom.lastMessage.createdAt && (
                            <p
                              style={{
                                marginLeft: "6px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {convertDate(chatRoom.lastMessage.createdAt)}
                            </p>
                          )}
                      </TweetDetails>
                      {chatRoom?.lastMessage &&
                        chatRoom.lastMessage.senderId && (
                          <TweetDetails
                            style={{
                              color: theme.color,
                              display: "flex",
                              flexWrap: "nowrap",
                              alignItems: "center",
                              color: "#666",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              maxWidth: window.matchMedia("(max-width: 350px)")
                                .matches
                                ? "200px"
                                : "300px",
                            }}
                          >
                            <p
                              style={{
                                marginRight: "5px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {userId === chatRoom.lastMessage.senderId
                                ? `${i18next.t("message.you")}:`
                                : chatRoom?.receiver.fullName + ":"}
                            </p>
                            {chatRoom.lastMessage.metadata.deleteStatus
                              ?.deletedAt ? (
                              <div
                                style={{
                                  fontStyle: "italic",
                                  color: "#666",
                                }}
                              >
                                {checkDescription(chatRoom.lastMessage.metadata.deleteStatus.description)}
                              </div>
                            ) : chatRoom.lastMessage.content.text ? (
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  maxWidth: window.matchMedia(
                                    "(max-width: 350px)"
                                  ).matches
                                    ? "200px"
                                    : "300px",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: chatRoom.lastMessage.content?.text,
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  fontStyle: "italic",
                                  marginLeft: "3px",
                                  color: "#666",
                                  maxWidth: window.matchMedia(
                                    "(max-width: 350px)"
                                  ).matches
                                    ? "200px"
                                    : "300px",
                                }}
                              >
                                {chatRoom.lastMessage.content.images.length ===
                                  1
                                  ? i18next.t("message.justSentImage", { number: 1 })
                                  : i18next.t("message.justSentImages", { number: chatRoom.lastMessage.content.images.length })}
                              </div>
                            )}
                          </TweetDetails>
                        )}
                    </div>
                  </PeopleFlex>
                </Link>
              )}
            </React.Fragment>
          );
        })
      ) : (
        <NoMessageNotification />
      )}
      {isLoadingMore && (
        <Loading
          style={{ position: "absolute", bottom: 0, width: "100%", padding: 0 }}
        />
      )}
    </ChatCorner>
  );
};

export default ChatBox;

import {
  Avatar,
  Button,
  ChatContainer,
  ConversationHeader,
  MainContainer,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { CHAT_MESSAGE_TYPE, WS_TOPIC, getStaticURL } from "../../constants";
import { WebSocketCtx } from "../../providers/WebSocketProvider";
import { chatService } from "../../services/ChatService";
import { useAliUpload } from "../../services/CloudService";
import { ClickOutside } from "../../utils/triggerClickOutside";
import { Close } from "../icons/Close";
import { EmojiIcon } from "../icons/EmojiIcon";
import { ImageIcon } from "../icons/ImageIcon";
import { SendIcon } from "../icons/SendIcon";
import Loading from "../loading";
import {
  ChatCorner,
  ChatInput,
  ChatInputContainer,
  ChatInputGroup,
  EmojiPickerContainer,
} from "../styles/chat";
import ImageGalleryReply from "./ImageGalleryReply";
import { InComingMessage } from "./InComingMessage";
import { OutGoingMessage } from "./OutGoingMessage";
import { UploadImage } from "./UploadImage";
import { INCREASE_TOTAL_MESSAGES_UNREAD } from "../../redux/actions";
import i18next from "i18next";

const MessageBox = () => {
  const [imgUpload, setImgUpload] = useState([]);
  const inputUploadImageRef = useRef(null);
  const [preview, setPreview] = useState([]);

  const { chatRoomId } = useParams();
  const [chat, setChat] = useState();
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [messageToReply, setMessageToReply] = useState("");
  const [messages, setMessages] = useState([]);
  const [totalMessage, setTotalMessages] = useState(0);
  const msgListRef = useRef(null);
  const emojiRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [boxChatHeight, setBoxChatHeight] = useState("100vh");

  const { onAliUpload } = useAliUpload();
  const { webSocket } = useContext(WebSocketCtx);
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);
  const userId = user.id;
  const history = useHistory();
  const dispatch = useDispatch();
  const [{ offset, limit }, setPaginations] = useState({
    offset: 0,
    limit: 20,
  });

  const fetchChat = async () => {
    try {
      const response = await chatService.getChat(chatRoomId);
      if (response.success && response.data) {
        const data = {
          ...response.data,
          receiver: response.data.participants.find(
            (participant) => participant.id !== userId
          ),
        };
        dispatch({
          type: INCREASE_TOTAL_MESSAGES_UNREAD,
          payload: -Number(response.data.unreadCount),
        });
        setChat(data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const readMessages = async () => {
    await chatService.readMessages(chatRoomId);
  };

  const fetchMessages = async (pagination) => {
    if (chatRoomId) {
      try {
        const response = await chatService.getListMessage(
          chatRoomId,
          pagination
        );
        if (response.success) {
          setMessages(response.data.rows);
          setTotalMessages(response.data.total);
          readMessages();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchMessagesOnScroll = async (pagination) => {
    setLoadingMore(true);

    if (!loadingMore || offset >= totalMessage) {
      setLoadingMore(false);
      return;
    }

    const position = messages[messages.length - 1].message.position;

    try {
      const response = await chatService.getListMessage(
        chatRoomId,
        pagination,
        position
      );
      if (response.success) {
        setMessages((preMessages) => [...preMessages, ...response.data.rows]);
        readMessages();
        setLoadingMore(false);
        setPaginations({
          limit,
          offset: offset + limit,
        });
      }
    } catch (error) {
      console.log(error);
      setLoadingMore(false);
    }
  };

  const onYReachStart = () => {
    fetchMessagesOnScroll({ limit, offset: offset + limit });
  };

  const sendMessage = async () => {
    try {
      setIsSending(true);
      if (isReply) {
        let images = [];
        if (imgUpload.length !== 0) {
          const uploadedImages = await onAliUpload(
            imgUpload,
            "messageImage",
            `message-image`
          );

          if (uploadedImages) {
            images = uploadedImages.map((image) => image.url);
          } else {
            throw new Error("");
          }
        }

        if (imgUpload.length === 0 && !messageInput) {
          return;
        }

        const result = await chatService.replyMessage(chatRoomId, {
          messageId: messageToReply._id,
          content: messageInput.trim(),
          images,
        });

        if (result.success) {
          setIsReply(false);
          setMessageToReply("");
        }
        setMessageInput("");
        setImgUpload([]);
        setPreview([]);
        setIsSending(false);
        return;
      }
      let images = [];
      if (imgUpload.length !== 0) {
        const uploadedImages = await onAliUpload(
          imgUpload,
          "messageImage",
          `message-image`
        );

        if (uploadedImages) {
          images = uploadedImages.map((image) => image.url);
        } else {
          throw new Error("");
        }
      }

      if (imgUpload.length === 0 && !messageInput) {
        return;
      }

      const result = await chatService.sendMessage(chatRoomId, {
        content: messageInput.trim(),
        images,
      });

      setMessageInput("");
      setImgUpload([]);
      setPreview([]);
      setIsSending(false);
      inputRef.current.focus();
    } catch (error) {
      setIsSending(false);
      console.log(error);
    }
  };

  const handleSelectEmoji = (emojiObject) => {
    setMessageInput(
      (prevMessageInput) => prevMessageInput + emojiObject.native
    );
  };

  const onReply = (message) => {
    setIsReply(true);
    setMessageToReply(message.message);
    inputRef.current.focus();
  };

  const onDelete = async (messageId, index) => {
    try {
      const result = await chatService.deleteMessage(chatRoomId, messageId);
      if (result.success) {
        const listMessage = [...messages];
        const indexOf = listMessage.findIndex(
          (message) => message.message._id === messageId
        );

        if (listMessage[indexOf].message.metadata.deleteStatus) {
          listMessage[indexOf].message.metadata.deleteStatus.deletedAt = true;
          setMessages([...listMessage]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (webSocket) {
      webSocket.on(WS_TOPIC.SEND_MESSAGE, (data) => {
        if (data.chatId === chatRoomId) {
          setMessages((preMessages) => [data, ...preMessages]);
          readMessages();
        }
      });

      webSocket.on(WS_TOPIC.REPLY_MESSAGE, (data) => {
        if (data.chatId === chatRoomId) {
          setMessages((preMessages) => [data.message, ...preMessages]);
          readMessages();
        }
      });
    }

    return () => {
      webSocket.off(WS_TOPIC.SEND_MESSAGE);
      webSocket.off(WS_TOPIC.REPLY_MESSAGE);
    };
  }, [webSocket]);

  useEffect(() => {
    if (webSocket) {
      webSocket.on(WS_TOPIC.DELETE_MESSAGE, (data) => {
        const listMessage = [...messages];

        const indexOf = listMessage.findIndex(
          (messageData) => messageData.message._id === data.messageId
        );

        if (listMessage[indexOf].message.metadata.deleteStatus) {
          listMessage[indexOf].message.metadata.deleteStatus.deletedAt =
            new Date();
          setMessages([...listMessage]);
        }

        const repliedMessage = listMessage
          .filter(
            (messageData) =>
              messageData.message.type === CHAT_MESSAGE_TYPE.REPLY_MESSAGE
          )
          .find(
            (messageData) =>
              messageData.message.messageReplied.message._id === data.messageId
          );

        const indexOfRepliedMessage = listMessage.findIndex(
          (messageData) =>
            messageData.message._id === repliedMessage.message._id
        );

        if (
          listMessage[indexOfRepliedMessage].message.messageReplied.message
            .metadata.deleteStatus
        ) {
          listMessage[
            indexOfRepliedMessage
          ].message.messageReplied.message.metadata.deleteStatus.deletedAt = true;
          setMessages([...listMessage]);
        }
      });
    }

    return () => {
      webSocket.off(WS_TOPIC.DELETE_MESSAGE);
    };
  }, [webSocket, messages]);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) {
      setIsMobile(true);
    }
    const handleResize = () => {
      const newScreenHeight = window.innerHeight || 0;
      setBoxChatHeight(`${newScreenHeight}px`);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    fetchChat();
    fetchMessages({ limit, offset });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [chatRoomId]);

  ClickOutside(emojiRef, () => {
    setShowEmojiPicker(false);
  });

  useEffect(() => {
    const textarea = document.querySelector("textarea");

    const adjustTextareaHeight = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    adjustTextareaHeight();

    textarea.addEventListener("input", adjustTextareaHeight);

    inputRef.current.focus();

    return () => {
      textarea.removeEventListener("input", adjustTextareaHeight);
    };
  }, [messageInput]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    } else if (event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      const cursorPosition = event.target.selectionStart;
      const newText = `${messageInput.substring(
        0,
        cursorPosition
      )}\n${messageInput.substring(cursorPosition)}`;
      setMessageInput(newText);
    }
  };

  return (
    <div style={{ height: isMobile ? boxChatHeight : "100vh"}}>
      <ChatCorner border={theme.border} style={{}}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: theme.bg,
          }}
        >
          <MainContainer
            style={{
              border: "none",
              flex: 1,
              height: "100%",
              backgroundColor: theme.bg,
            }}
          >
            <ChatContainer
              style={{ height: "100%", backgroundColor: theme.bg }}
            >
              <ConversationHeader style={{ backgroundColor: theme.bg }}>
                <ConversationHeader.Back
                  onClick={() => {
                    history.goBack();
                  }}
                />
                <Avatar
                  src={chat?.receiver?.imageUrl}
                  name={chat?.receiver?.fullName}
                  onClick={() => {
                    history.push(`/profile/${chat?.receiver?.id}`);
                  }}
                  style={{ cursor: "pointer" }}
                />
                <ConversationHeader.Content
                  style={{
                    color: theme.color,
                    backgroundColor: theme.bg,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Link to={`/profile/${chat?.receiver?.id}`}>
                      <div
                        style={{
                          cursor: "pointer",
                          color: theme.color,
                          backgroundColor: theme.bg,
                          fontWeight: "bold",
                        }}
                      >
                        {chat?.receiver?.fullName}
                      </div>
                    </Link>
                    {/* <div style={{ color: theme.color }}>
              You own {ownShares} share{ownShares > 1 ? "s" : ""}
            </div> */}
                  </div>
                </ConversationHeader.Content>
              </ConversationHeader>
              <MessageList
                ref={msgListRef}
                onYReachStart={onYReachStart}
                style={{
                  paddingBottom: isReply ? "86px" : "0px",
                  backgroundColor: theme.bg,
                  height: "100%",
                  scrollBehavior: "smooth",
                }}
                typingIndicator={
                  <>
                    {isReply && (
                      <div
                        style={{
                          position: "absolute",
                          bottom:
                            messageToReply.content.images.length > 0
                              ? "45px"
                              : 0,
                          right: 0,
                          backgroundColor: theme.bg,
                          width: "100%",
                          height: "80px",
                          borderTop: "1px solid #DDD",
                          marginTop: "5px",
                          padding: "0px 10px",
                          color: theme.color,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <img
                              src={`${getStaticURL()}/assets/images/reply-message.svg`}
                              alt="menu"
                              width={20}
                            />
                            <span>{i18next.t("message.replying")}</span>
                          </div>
                          <div
                            style={{ cursor: "pointer", width: "20px" }}
                            onClick={() => {
                              setIsReply(false);
                              setMessageToReply("");
                            }}
                          >
                            <Close color={theme.color} />
                          </div>
                        </div>
                        {messageToReply.content.images.length > 0 && (
                          <div>
                            <ImageGalleryReply
                              images={messageToReply.content.images}
                            />
                          </div>
                        )}
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0 10px 10px 10px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "290px",
                          }}
                        >
                          {messageToReply.content.text}
                        </span>
                      </div>
                    )}
                  </>
                }
              >
                {/* <MessageSeparator content="Saturday, 31 November 2019" /> */}
                {loadingMore && <Loading />}
                {[...messages].reverse().map((messageData, index) => (
                  <div
                    key={index}
                    style={{
                      paddingBottom:
                        index === messages.length - 1 ? "10px" : "0",
                      position: "relative",
                      top: "20px",
                    }}
                  >
                    {messageData.message.senderId === userId ? (
                      <OutGoingMessage
                        messageData={messageData}
                        onReply={onReply}
                        onDelete={onDelete}
                        index={index}
                      />
                    ) : (
                      <InComingMessage
                        messageData={messageData}
                        onReply={onReply}
                      />
                    )}
                  </div>
                ))}
                {/* <TypingIndicator content="Patrik is typing" /> */}
              </MessageList>
            </ChatContainer>
          </MainContainer>
          <ChatInputContainer
            style={{ bottom: 0, left: 0, width: "100%", height: "auto" }}
          >
            <ChatInputGroup
              color={theme.color}
              border={theme.border}
              style={{ position: "relative" }}
            >
              <EmojiPickerContainer
                ref={emojiRef}
                style={{
                  left: 0,
                  opacity: showEmojiPicker ? 1 : 0,
                  visibility: showEmojiPicker ? "visible" : "hidden",
                }}
                scale={showEmojiPicker ? 1 : 0.5}
                opacity={0.3}
                height={showEmojiPicker ? "auto" : "0px"}
              >
                <Picker
                  theme={theme.mode}
                  style={{ width: "100%" }}
                  data={data}
                  onEmojiSelect={handleSelectEmoji}
                  previewPosition={"none"}
                />
              </EmojiPickerContainer>
              <div style={{ display: imgUpload.length > 0 ? "block" : "none" }}>
                <UploadImage
                  inputRef={inputUploadImageRef}
                  imgUpload={imgUpload}
                  setImgUpload={setImgUpload}
                  preview={preview}
                  setPreview={setPreview}
                  messageInputRef={inputRef}
                />
              </div>
              <ChatInput
                style={{ marginTop: "8px" }}
                color={theme.color}
                type="text"
                placeholder={i18next.t("message.typeMessageHere")}
                ref={inputRef}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                value={messageInput}
                autoFocus
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  // marginTop: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {imgUpload.length === 0 && (
                    <div
                      style={{ cursor: "pointer", height: "24px" }}
                      onClick={() => {
                        inputRef.current.focus();
                        return (
                          inputUploadImageRef.current &&
                          inputUploadImageRef.current.click()
                        );
                      }}
                    >
                      <ImageIcon />
                    </div>
                  )}
                  <div
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{
                      cursor: "pointer",
                      height: "24px",
                      position: "relative",
                    }}
                  >
                    <EmojiIcon />
                  </div>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={
                    (!messageInput.trim() && imgUpload.length === 0) ||
                    isSending
                  }
                  icon={
                    <div
                      style={{
                        cursor: "pointer",
                        width: "24px",
                        height: "24px",
                      }}
                    >
                      <SendIcon color={"#1da1f2"} />
                    </div>
                  }
                />
              </div>
            </ChatInputGroup>
          </ChatInputContainer>
        </div>
      </ChatCorner>
    </div>
  );
};

export default MessageBox;

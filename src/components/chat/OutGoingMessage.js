import { Message } from "@chatscope/chat-ui-kit-react";
import React, { useRef, useState } from "react";

import { DateTime } from "luxon";
import { useSelector } from "react-redux";
import { CHAT_MESSAGE_TYPE, getStaticURL } from "../../constants";
import { ClickOutside } from "../../utils/triggerClickOutside";
import { MessageReadIcon } from "../icons/MessageReadIcon";
import { MessageSendIcon } from "../icons/MessageSendIcon";
import {
  MessageContent,
  MessageInfo,
  ReplyContent,
  ReplyText,
  ReplyTitle,
  ReplyWrapper,
} from "../styles/chat";
import { DeleteMessages, Menu, MessagBox } from "../styles/common";
import ImageGallery from "./ImageGallery";
import ImageGalleryReply from "./ImageGalleryReply";
import i18next from "i18next";

export const OutGoingMessage = ({
  messageData,
  onReply,
  onDelete,
  index,
  receiver,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useSelector((state) => state.theme);
  const [isShowTime, setIsShowTime] = useState(false);
  const ref = useRef();

  ClickOutside(ref, () => {
    setIsModalOpen(false);
  });
  const isRead = messageData.message?.metadata?.readStatus
    ?.map((readStatus) => readStatus.userId)
    .includes(receiver?.id);

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
  return (
    <div>
      <MessagBox
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          gap: "0.75rem",
        }}
        id="messageBox"
        onMouseLeave={() => {
          setIsModalOpen(false);
          // setIsShowTime(false);
        }}
        ref={ref}
      >
        {!messageData.message.metadata.deleteStatus?.deletedAt && (
          <Menu>
            <img
              style={{ cursor: "pointer" }}
              src={`${getStaticURL()}/assets/images/reply-message.svg`}
              alt="menu"
              width={20}
              onClick={() => {
                onReply(messageData);
              }}
            />
            <img
              style={{ opacity: 0.5, cursor: "pointer" }}
              src={`${getStaticURL()}/assets/images/3-dots${theme.mode == "dark" ? "-white" : ""
                }.svg`}
              alt="menu"
              width={15}
              onClick={() => {
                setIsModalOpen(true);
              }}
            />
            {isModalOpen && (
              <DeleteMessages
                onClick={() => {
                  onDelete(messageData.message._id, index);
                  setIsModalOpen(false);
                }}
              >
                <img
                  style={{ opacity: 0.5, cursor: "pointer" }}
                  src={`${getStaticURL()}/assets/images/delete.svg`}
                  alt="menu"
                  width={20}
                />
                <span style={{ fontSize: "13px", whiteSpace: "nowrap" }}>
                  {i18next.t("message.delete")}
                </span>
              </DeleteMessages>
            )}
          </Menu>
        )}
        <Message
          style={{
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "6px",
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "0",
            marginLeft: 0,
            marginBottom: isShowTime ? "20px" : 0,
            maxWidth: "80%",
            backgroundColor: theme.bg,
          }}
          model={{
            direction: "outgoing",
            type: "custom",
          }}
        >
          <Message.CustomContent>
            {!messageData.message.metadata.deleteStatus?.deletedAt &&
              messageData.message.type === CHAT_MESSAGE_TYPE.REPLY_MESSAGE && (
                <ReplyWrapper>
                  <ReplyContent>
                    <ReplyTitle>
                      {messageData.message.messageReplied?.sender?.fullname}
                    </ReplyTitle>
                    <ReplyText style={{ height: "auto" }}>
                      {messageData.message.messageReplied?.message.metadata
                        .deleteStatus?.deletedAt ? (
                        <span
                          style={{
                            fontSize: "12.5px",
                            fontStyle: "italic",
                            color: "#666",
                          }}
                        >
                          {checkDescription(messageData.message.metadata.deleteStatus.description)}
                        </span>
                      ) : (
                        <>
                          {messageData.message.messageReplied?.message.content
                            .images.length > 0 && (
                              <div>
                                <ImageGalleryReply
                                  images={
                                    messageData.message.messageReplied?.message
                                      .content.images
                                  }
                                />
                              </div>
                            )}
                          <span>
                            {
                              messageData.message.messageReplied?.message
                                ?.content?.text
                            }
                          </span>
                        </>
                      )}
                    </ReplyText>
                  </ReplyContent>
                </ReplyWrapper>
              )}
            <MessageContent>
              {!messageData.message.metadata.deleteStatus?.deletedAt &&
                messageData.message.content.images.length > 0 && (
                  <div style={{ marginBottom: "10px" }}>
                    <ImageGallery images={messageData.message.content.images} />
                  </div>
                )}
              {messageData.message.metadata.deleteStatus?.deletedAt ? (
                <span
                  style={{
                    fontSize: "12.5px",
                    fontStyle: "italic",
                    color: "#666",
                  }}
                >
                  {checkDescription(messageData.message.metadata.deleteStatus.description)}
                </span>
              ) : (
                <div>
                  <span>{messageData.message.content.text}</span>
                  <MessageInfo dir="ltr" data-ignore-on-paste="true">
                    <span
                      style={{ fontSize: "11px" }}
                      className="message-time"
                      title={DateTime.fromISO(
                        messageData.message.createdAt
                      ).toFormat("dd/MM/yyyy HH:mm")}
                    >
                      {DateTime.fromISO(messageData.message.createdAt).toFormat(
                        "HH:mm"
                      )}
                    </span>
                    {isRead ? <MessageReadIcon /> : <MessageSendIcon />}
                  </MessageInfo>
                </div>
              )}
              {/* {messageData.message.content.images.length > 0 && (
                <div style={{ marginBottom: "10px" }}>
                  <ImageGallery images={messageData.message.content.images} />
                </div>
              )}
              {messageData.message.content.text} */}
            </MessageContent>
          </Message.CustomContent>
        </Message>
        {/* {isShowTime && (
          <TimeMessages
            onClick={() => {
              setIsShowTime(false);
            }}
            style={{
              right: 0,
            }}
          >
            <span style={{ color: theme.color }}>
              {DateTime.fromISO(message.createdAt).toFormat("HH:mm dd/MM/yyyy")}
            </span>
          </TimeMessages>
        )} */}
      </MessagBox>
    </div>
  );
};

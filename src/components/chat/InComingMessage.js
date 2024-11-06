import { Message } from "@chatscope/chat-ui-kit-react";
import React, { useState } from "react";

import { DateTime } from "luxon";
import { useSelector } from "react-redux";
import { CHAT_MESSAGE_TYPE, getStaticURL } from "../../constants";
import {
  MessageContent,
  MessageInfo,
  ReplyContent,
  ReplyText,
  ReplyTitle,
  ReplyWrapper,
} from "../styles/chat";
import { Menu, MessagBox } from "../styles/common";
import ImageGallery from "./ImageGallery";
import ImageGalleryReply from "./ImageGalleryReply";
import i18next from "i18next";

export const InComingMessage = ({ messageData, onReply }) => {
  const theme = useSelector((state) => state.theme);
  const [isShowTime, setIsShowTime] = useState(false);

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
          width: "max-content",
          maxWidth: "80%",
        }}
        id="messageBoxIncoming"
        onMouseLeave={() => {
          setIsShowTime(false);
        }}
      >
        <Message
          style={{
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "6px",
            borderBottomLeftRadius: "0",
            borderBottomRightRadius: "16px",
            marginLeft: 0,
            marginBottom: isShowTime ? "20px" : 0,
            // maxWidth: "80%",
          }}
          model={{
            direction: "incoming",
            type: "custom",
            sentTime: "just now",
          }}
        // onClick={() => {
        //   setIsShowTime(true);
        // }}
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
                        // <span>
                        //   {
                        //     messageData.message.messageReplied?.message?.content
                        //       ?.text
                        //   }
                        // </span>
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
              left: 0,
            }}
          >
            <span style={{ color: theme.color }}>
              {DateTime.fromISO(messageData.message.createdAt).toFormat(
                "HH:mm dd/MM/yyyy"
              )}
            </span>
          </TimeMessages>
        )} */}
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
          </Menu>
        )}
      </MessagBox>
    </div>
  );
};

import React from "react";
import { useSelector } from "react-redux";

import { NOTIFICATION_TYPE } from "../../constants";
import { BellIcon } from "../icons/BellIcon";
import { NotificationBuyShare } from "./NotificationBuyShare";
import { NotificationCommentPost } from "./NotificationCommentPost";
import { NotificationFundTransfer } from "./NotificationFundTransfer";
import { NotificationLikePost } from "./NotificationLikePost";
import { NotificationReplyPost } from "./NotificationReplyPost";
import { NotificationRetweetPost } from "./NotificationRetweetPost";
import { NotificationSellShare } from "./NotificationSellShare";
import { NotificationTaggedUser } from "./NotificationTaggedUser";
import i18next from "i18next";
import { NotificationTokenTransfer } from "./NotificationTokenTransfer";

export const AllNotifications = ({ data }) => {
  const theme = useSelector((state) => state.theme);

  const renderNotification = (noti) => {
    switch (noti.type) {
      case NOTIFICATION_TYPE.POST_REACT:
        return <NotificationLikePost noti={noti} />;
      case NOTIFICATION_TYPE.POST_REPLY:
        return <NotificationReplyPost noti={noti} />;
      case NOTIFICATION_TYPE.POST_COMMENT:
        return <NotificationCommentPost noti={noti} />;
      case NOTIFICATION_TYPE.POST_SHARE:
        return <NotificationRetweetPost noti={noti} />;
      case NOTIFICATION_TYPE.SHARE_BOUGHT:
        return <NotificationBuyShare noti={noti} />;
      case NOTIFICATION_TYPE.SHARE_SOLD:
        return <NotificationSellShare noti={noti} />;
      case NOTIFICATION_TYPE.FUNDS_TRANSFERRED:
        return <NotificationFundTransfer noti={noti} />;
      case NOTIFICATION_TYPE.TOKEN_TRANSFERRED:
        return <NotificationTokenTransfer noti={noti} />;
      case NOTIFICATION_TYPE.TAGGED_USER:
        return <NotificationTaggedUser noti={noti} />;
      default:
        break;
    }
  };

  return (
    <div>
      {data.map((noti, index) => (
        <div key={index}>{renderNotification(noti)}</div>
      ))}
      {data.length === 0 && (
        <div
          style={{
            minHeight: "50vh",
            marginTop: "20px",
            gap: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BellIcon color={theme.color} size={50} />
          <span style={{ color: theme.color }}>
            {i18next.t("notifications.textNoNotifications")}
          </span>
        </div>
      )}
    </div>
  );
};

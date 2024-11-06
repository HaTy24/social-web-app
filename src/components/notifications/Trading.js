import React from "react";
import { useSelector } from "react-redux";

import { NOTIFICATION_TYPE } from "../../constants";
import { BellIcon } from "../icons/BellIcon";
import { NotificationBuyShare } from "./NotificationBuyShare";
import { NotificationSellShare } from "./NotificationSellShare";

export const Trading = ({ data }) => {
  const theme = useSelector((state) => state.theme);
  const renderNotification = (noti) => {
    switch (noti.type) {
      case NOTIFICATION_TYPE.SHARE_BOUGHT:
        return <NotificationBuyShare noti={noti} />;
      case NOTIFICATION_TYPE.SHARE_SOLD:
        return <NotificationSellShare noti={noti} />;
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
            You currently have no notifications
          </span>
        </div>
      )}
    </div>
  );
};

import React from "react";
import { Link } from "react-router-dom";

import { DateTime } from "luxon";
import { useSelector } from "react-redux";
import { getStaticURL } from "../../constants";
import { customFormat, removeTrailingZeros } from "../../utils/Number";
import { UserImage } from "../styles/profile";
import i18next from "i18next";
import { convertDate } from "../../utils/convertDate";

export const NotificationFundTransfer = ({ noti }) => {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);

  const renderMessage = (noti) => {
    return (
      <div>
        {user.id === noti.content.toUserId ? (
          <div>
            <Link to={`/profile/${noti.content.fromUserId}`}>
              @{noti.content.fromUserTwitterScreenName}
            </Link>
            <span>&nbsp;{i18next.t("notifications.textNoNotifications")}</span>
          </div>
        ) : (
          <div>
            <span>{i18next.t("notifications.youJustSent")}&nbsp;</span>
            <Link to={`/profile/${noti.content.toUserId}`}>
              @{noti.content.toUserTwitterScreenName}
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        color: "#647685",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <div>
        <UserImage
          style={{ width: "30px", height: "30px", marginRight: 0 }}
          src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <UserImage
          src={
            user.id === noti.content.toUserId
              ? noti.content.fromUserProfileImage
              : noti.content.toUserProfileImage
          }
          style={{ width: "50px", height: "50px" }}
        />
        <div>
          <div
            style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
            }}
          >
            <div>{convertDate(noti.createdAt)}</div>
          </div>
          <div>
            {renderMessage(noti)}
            <span
              style={{
                color: theme.color,
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              &nbsp;{customFormat(noti.content.amount, 8)}
              &nbsp;BNB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

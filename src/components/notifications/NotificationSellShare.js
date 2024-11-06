import React from "react";
import { Link } from "react-router-dom";

import { DateTime } from "luxon";
import { useSelector } from "react-redux";
import { NOTIFICATION_TYPE } from "../../constants";
import { customFormat, removeTrailingZeros } from "../../utils/Number";
import { ArrowTop } from "../icons/ArrowTopIcon";
import { UserImage } from "../styles/profile";
import i18next from "i18next";
import { convertDate } from "../../utils/convertDate";

export const NotificationSellShare = ({ noti }) => {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);

  const renderMessage = (noti) => {
    return (
      <div>
        {user.id === noti.content.sellerId ? (
          <div>
            <span>{i18next.t("notifications.youJustSold")}&nbsp;{noti.content.quantity || 1}</span>
            <span>&nbsp;{i18next.t("notifications.shareOf")}&nbsp;</span>
            <Link to={`/profile/${noti.content.ownerId}`}>
              @{noti.content.ownerTwitterScreenName}
            </Link>
            &nbsp;{i18next.t("notifications.at")}
          </div>
        ) : (
          <div>
            <Link to={`/profile/${noti.content.sellerId}`}>
              @{noti.content.sellerTwitterScreenName}
            </Link>
            <span>
              &nbsp;{i18next.t("notifications.justSold")} {noti.content.quantity || 1} {i18next.t("notifications.yourShareAt")}
            </span>
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
      <div style={{ transform: "rotate(180deg)" }}>
        <ArrowTop color="red" />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <UserImage
          src={
            user.id === noti.content.sellerId
              ? noti.content.ownerProfileImage
              : noti.content.sellerProfileImage
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
                color: `${
                  noti.type === NOTIFICATION_TYPE.SHARE_SOLD ? "red" : "green"
                }`,
                fontSize: "16px",
              }}
            >
              &nbsp;
              {customFormat(noti.content.sellPrice, 8)}
              &nbsp;BNB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

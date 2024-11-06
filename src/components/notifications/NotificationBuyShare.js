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

export const NotificationBuyShare = ({ noti }) => {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);

  const renderMessage = (noti) => {
    return (
      <div>
        {user.id === noti.content.buyerId ? (
          <div>
            <span>{i18next.t("notifications.youJustBought")}&nbsp;{noti.content.quantity || 1}</span>
            <span>
              &nbsp;{i18next.t("notifications.shareOf")}{Number(noti.content.quantity) > 1 && "s"} &nbsp;
            </span>
            <Link to={`/profile/${noti.content.ownerId}`}>
              @{noti.content.ownerTwitterScreenName}
            </Link>
            &nbsp;{i18next.t("notifications.at")}
          </div>
        ) : (
          <div>
            <Link to={`/profile/${noti.content.buyerId}`}>
              @{noti.content.buyerTwitterScreenName}
            </Link>
            <span>
              &nbsp;{i18next.t("notifications.justBought")} {noti.content.quantity || 1} {i18next.t("notifications.yourShare")}
              {Number(noti.content.quantity) > 1 && "s"} {i18next.t("notifications.at")}
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
      <div>
        <ArrowTop />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <UserImage
          src={
            user.id === noti.content.buyerId
              ? noti.content.ownerProfileImage
              : noti.content.buyerProfileImage
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
              {removeTrailingZeros(
                customFormat(
                  noti.content.buyPrice * noti.content.quantity || 1,
                  8
                )
              )}
              &nbsp;BNB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

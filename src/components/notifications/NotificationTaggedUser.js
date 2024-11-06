import React from "react";
import { Link } from "react-router-dom";

import { DateTime } from "luxon";
import { useSelector } from "react-redux";
import { TagIcon } from "../icons/TagIcon";
import { UserImage } from "../styles/profile";
import i18next from "i18next";
import { convertDate } from "../../utils/convertDate";
import { NotificationText } from "../styles/notification";

export const NotificationTaggedUser = ({ noti }) => {
  const theme = useSelector((state) => state.theme);

  const renderMessage = (noti) => {
    return (
      <div>
        <Link to={`/profile/${noti.content.postOwnerId}`}>
          @{noti.content.postOwnerScreenName}
        </Link>
        <span>&nbsp;{i18next.t("notifications.justTaggedYouInAPost")}</span>
      </div>
    );
  };

  return (
    <Link to={`/tweet/${noti.content.postSlug}`}>
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
        <TagIcon />
        <div style={{ display: "flex", alignItems: "center" }}>
          <UserImage
            src={noti.content.postOwnerProfileImage}
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
              <div
                style={{
                  color: `${theme.color}`,
                  fontSize: "16px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  maxWidth: "200px",
                }}
              >
                <NotificationText color={theme.color}>
                  &nbsp;{noti.content.postText}
                </NotificationText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

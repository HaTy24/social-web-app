import { DateTime } from "luxon";
import React from "react";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { ICON_PATH } from "../../constants";
import Icon from "../icon";
import { ActivityIcon } from "../styles/common";
import { NotificationText } from "../styles/notification";
import { UserImage } from "../styles/profile";
import i18next from "i18next";
import { convertDate } from "../../utils/convertDate";

export const NotificationLikePost = ({ noti }) => {
  const theme = useSelector((state) => state.theme);

  return (
    <Link to={`/tweet/${noti.content.originalSlug}`}>
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
          <ActivityIcon>
            <Icon
              d={ICON_PATH.likePath}
              width="30px"
              height="30px"
              fill="rgb(224, 36, 94)"
            />
          </ActivityIcon>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <UserImage
            src={
              noti.content.users[noti.content.users.length - 1]
                .profile_image_url
            }
            style={{ width: "50px", height: "50px" }}
          />
          <div>
            <div>{convertDate(noti.createdAt)}</div>
            <div>
              <div>
                <div>
                  {noti.content.users.length <= 2 ? (
                    noti.content.users.map((user, index) => (
                      <div style={{ display: "inline-block" }}>
                        <Link to={`/profile/${user.id}`}>
                          @{user.twitterScreenName}
                        </Link>
                        <span>
                          &nbsp;{index < noti.content.users.length - 1 && i18next.t("notifications.and")}
                          &nbsp;
                        </span>
                      </div>
                    ))
                  ) : (
                    <>
                      <Link
                        to={`/profile/${noti.content.users[noti.content.users.length - 1].id
                          }`}
                      >
                        @
                        {
                          noti.content.users[noti.content.users.length - 1]
                            .twitterScreenName
                        }
                      </Link>
                      &nbsp;{i18next.t("notifications.andOthers", { number: noti.content.users.length - 1 })}
                    </>
                  )}
                  <span>&nbsp;{i18next.t("notifications.likedYourPost")}</span>
                </div>
              </div>
              <NotificationText color={theme.color}>
                {noti.content.text}
              </NotificationText>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

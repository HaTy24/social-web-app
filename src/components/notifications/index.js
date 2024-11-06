import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { NOTIFICATION_TYPE, WS_TOPIC } from "../../constants";
import { WebSocketCtx } from "../../providers/WebSocketProvider";
import { INCREASE_TOTAL_NOTIFICATIONS_UNREAD } from "../../redux/actions";
import { notificationService } from "../../services/NotificationService";
import { Header, ProfileCorner } from "../styles/common";
import { AllNotifications } from "./AllNotifications";
import i18next from "i18next";

const Notifications = () => {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search).get("tabs");
  const [listNotification, setListNotification] = useState([]);
  const [isAfterFirstLoad, setIsAfterFirstLoad] = useState(false);
  const [{ offset, limit }, setPaginations] = useState({
    offset: 0,
    limit: 10,
  });
  const { webSocket } = useContext(WebSocketCtx);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsAfterFirstLoad(true);
    setPaginations({ limit: 10, offset: 0 });
    getNotifications({ limit: 10, offset: 0 });
  }, [query]);

  useEffect(() => {
    if (webSocket) {
      webSocket.on(WS_TOPIC.NOTIFICATION, () => {
        if (window.scrollY < 100) {
          setPaginations({ limit: 10, offset: 0 });
          getNotifications({ limit, offset });
        }
      });
    }

    return () => {
      webSocket.off(WS_TOPIC.NOTIFICATION);
    };
  }, [webSocket]);

  useEffect(() => {
    if (listNotification.length > 0 && isAfterFirstLoad) {
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isAfterFirstLoad, listNotification]);

  const getNotifications = async (pagination) => {
    const notificationsResult =
      await notificationService.getNotificationHistory(
        pagination,
        query === "trading"
          ? [NOTIFICATION_TYPE.SHARE_BOUGHT, NOTIFICATION_TYPE.SHARE_SOLD]
          : []
      );
    if (notificationsResult.success) {
      setListNotification(notificationsResult.data.rows);
      await readNotifications(notificationsResult.data.rows);
    }
  };

  const handleScroll = async () => {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - 1;
    const isScrolledToBottom = windowHeight + scrollY >= documentHeight;
    const shouldLoadMore =
      isScrolledToBottom &&
      !isLoading &&
      isAfterFirstLoad &&
      offset < listNotification.length;

    if (window.scrollY === 0) {
      setPaginations({ limit: 10, offset: 0 });
      getNotifications({ limit: 10, offset: 0 });
    }

    if (shouldLoadMore) {
      setIsLoading(true);
      setPaginations({
        limit,
        offset: offset + limit,
      });
      await getNotificationsWhenScroll({ limit, offset: offset + limit });
    }
  };

  const getNotificationsWhenScroll = async (pagination) => {
    try {
      setIsLoading(true);
      const notificationsResult =
        await notificationService.getNotificationHistory(
          pagination,
          query === "trading"
            ? [NOTIFICATION_TYPE.SHARE_BOUGHT, NOTIFICATION_TYPE.SHARE_SOLD]
            : []
        );

      if (notificationsResult.success) {
        setIsLoading(false);
        setListNotification([
          ...listNotification,
          ...notificationsResult.data.rows,
        ]);
        await readNotifications(notificationsResult.data.rows);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(`${i18next.t("notifications.errorNotification")}`, error);
    }
  };

  const readNotifications = async (notifications) => {
    const listIdNotificationUnread = notifications
      .filter((noti) => {
        const filter = noti?.metadata?.readStatus?.filter(
          (readStatus) => readStatus.userId == user.id
        );

        return !filter || filter.length == 0;
      })
      .map((noti) => noti._id);

    if (listIdNotificationUnread.length <= 0) return;

    await notificationService.readNotification(listIdNotificationUnread);

    dispatch({
      type: INCREASE_TOTAL_NOTIFICATIONS_UNREAD,
      payload: -listIdNotificationUnread.length,
    });
  };

  return (
    <ProfileCorner border={theme.border}>
      <Header bg={theme.bg} color={theme.color} border={theme.border}>
        <h2>{i18next.t("notifications.title")}</h2>
      </Header>
      <AllNotifications data={listNotification} />
    </ProfileCorner>
  );
};

export default Notifications;

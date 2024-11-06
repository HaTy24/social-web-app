import restConnector from "../axiosRestConnector";

class NotificationService {
  async getNotificationHistory(pagination, notificationTypes) {
    const { data } = await restConnector.get("/notifications", {
      params: {
        ...pagination,
        notificationTypes,
      },
    });
    return data;
  }

  async countNotificationsUnread() {
    const { data } = await restConnector.get("/notifications/unread");
    return data;
  }

  async readNotification(ids) {
    const { data } = await restConnector.post("/notifications/read", {
      notificationIds: ids,
    });
    return data;
  }
}

export const notificationService = new NotificationService();

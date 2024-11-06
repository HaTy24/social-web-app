import {
  INCREASE_TOTAL_NOTIFICATIONS_UNREAD,
  SET_LIST_NOTIFICATION,
  SET_TOTAL_NOTIFICATIONS_UNREAD,
} from "../actions";

const initialState = {
  notificationList: [],
  totalNotificationsUnread: 0,
};

const notification = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIST_NOTIFICATION:
      return {
        ...state,
        notificationList: [action.payload, ...state.notificationList],
      };
    case SET_TOTAL_NOTIFICATIONS_UNREAD:
      return {
        ...state,
        totalNotificationsUnread: action.payload,
      };
    case INCREASE_TOTAL_NOTIFICATIONS_UNREAD:
      const total = state.totalNotificationsUnread + action.payload;
      return {
        ...state,
        totalNotificationsUnread: total < 0 ? 0 : total,
      };
    default:
      return state;
  }
};

export default notification;

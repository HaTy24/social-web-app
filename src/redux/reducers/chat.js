import {
  INCREASE_TOTAL_MESSAGES_UNREAD,
  SET_TOTAL_MESSAGES_UNREAD,
} from "../actions";

const initialState = {
  totalMessagesUnread: 0,
};

const chat = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOTAL_MESSAGES_UNREAD:
      return {
        ...state,
        totalMessagesUnread: action.payload,
      };
    case INCREASE_TOTAL_MESSAGES_UNREAD:
      const total = state.totalMessagesUnread + action.payload;
      return {
        ...state,
        totalMessagesUnread: total < 0 ? 0 : total,
      };
    default:
      return state;
  }
};

export default chat;

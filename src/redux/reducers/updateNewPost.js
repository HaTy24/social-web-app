import { SET_RELOAD_POST, SET_RELOADED } from "../actions";

const initialState = {
  refresh: false,
};

const updateNewPost = (state = initialState, action) => {
  switch (action.type) {
    case SET_RELOAD_POST:
      return {
        refresh: true,
      };
    case SET_RELOADED:
      return {
        refresh: false,
      };
    default:
      return state;
  }
};

export default updateNewPost;

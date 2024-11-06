import { SET_MODAL_APP_VERSION } from "../actions";

const initialState = {
  showModalAppVersion: false,
};

const modalAppVersion = (state = initialState, action) => {
  switch (action.type) {
    case SET_MODAL_APP_VERSION:
      return {
        ...state,
        showModalAppVersion: !state.showModalAppVersion,
      };
    default:
      return state;
  }
};

export default modalAppVersion;

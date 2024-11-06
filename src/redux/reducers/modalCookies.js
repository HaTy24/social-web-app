import { SET_MODAL_COOKIES_POLICY } from "../actions";

const initialState = {
  showModalCookiesPolicy: false,
};

const modalCookies = (state = initialState, action) => {
  switch (action.type) {
    case SET_MODAL_COOKIES_POLICY:
      return {
        ...state,
        showModalCookiesPolicy: action.payload || !state.showModalCookiesPolicy,
      };
    default:
      return state;
  }
};

export default modalCookies;

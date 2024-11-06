import { SET_LANGUAGE } from "../actions";

const languages = {
  en: "en",
  cn: "cn",
};

const initialState = languages.en;

const language = (state = initialState, action) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return languages[action.payload];
    default:
      return state;
  }
};

export default language;

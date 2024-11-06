import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Routes from "./Routes";
import { SET_THEME } from "./redux/actions";
import i18next from "i18next";

import translationEN from "../locales/en.json";
import translationCN from "../locales/cn.json";


function App() {
  const theme = useSelector((state) => state.theme);
  const language = useSelector((state) => state.language);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Object.keys(theme).length === 0)
      dispatch({ type: SET_THEME, payload: "default" });
  }, []);

  i18next.init({
    resources: {
      en: {
        translation: translationEN,
      },
      cn: {
        translation: translationCN,
      },
    },
    lng: language,
    fallbackLng: "en",
  });

  return (
    <React.Suspense
      fallback={
        <div
          style={{
            backgroundColor: `${theme.bg}`,
            position: "fixed",
            width: "100vw",
            height: "100vh",
          }}
        />
      }
    >
      <ToastContainer hideProgressBar />
      <Routes />
    </React.Suspense>
  );
}

export default App;

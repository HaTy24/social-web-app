import React from "react";
import { useSelector } from "react-redux";
import { ErrorIcon } from "./icons/ErrorIcon";
import { DescriptionErrorPage, TitleErrorPage } from "./styles/common";
const PageError = () => {
  const theme = useSelector((state) => state.theme);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: theme.bg,
        padding: "0 20xp",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        <ErrorIcon color={theme.color} />
        <TitleErrorPage color={theme.color}>500 Server error</TitleErrorPage>
      </div>
      <DescriptionErrorPage color={theme.color}>
        Oops! Something went wrong on our server. Please try again later, or
        contact support if the issue persists. We apologize for the
        inconvenience
      </DescriptionErrorPage>
    </div>
  );
};
export default PageError;

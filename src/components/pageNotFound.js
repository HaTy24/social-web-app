import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, DescriptionErrorPage, TitleErrorPage } from "./styles/common";

const PageNotFound = () => {
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
      }}
    >
      <h2
        style={{
          fontSize: "160px",
          fontWeight: 700,
          margin: 0,
          color: theme.color,
          lineHeight: 1,
          marginBottom: "16px",
        }}
      >
        404
      </h2>
      <div
        style={{ textAlign: "center", color: theme.color, padding: "0 20px" }}
      >
        <TitleErrorPage style={{ marginBottom: "20px" }} color={theme.color}>
          Page not found
        </TitleErrorPage>
        <DescriptionErrorPage>
          It's looking like you have taken a wrong turn. Don't worry... It's
          happens to the most of us
        </DescriptionErrorPage>
      </div>
      <Link to={"/home"}>
        <Button
          width="100%"
          padding="12px 30px"
          type="text"
          style={{
            background: "rgba(29, 161, 242, 1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
            color: theme.color,
          }}
        >
          GO BACK TO HOME PAGE
        </Button>
      </Link>
    </div>
  );
};

export default PageNotFound;

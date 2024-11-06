import React from "react";
import { NoEmailIcon } from "../icons/NoEmailIcon";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { Button } from "../styles/profile-wallet";
import i18next from "i18next";

export default function NoMessageNotification() {
  const theme = useSelector((state) => state.theme);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
      }}
    >
      <NoEmailIcon color={theme.color} />
      <span
        style={{
          color: theme.color,
          fontSize: "24px",
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {i18next.t("message.noMessage")}
      </span>
      <p style={{ color: theme.color, width: "296px", textAlign: "center" }}>
        {i18next.t("message.noMessageTitle")}
      </p>
      <Link style={{ color: theme.color }} to={"/explore"}>
        <Button
          style={{
            padding: "8px 16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            width: "max-content",
            borderRadius: "8px",
          }}
        >
          {i18next.t("explore")}
        </Button>
      </Link>
    </div>
  );
}

import i18next from "i18next";
import React from "react";
import { useSelector } from "react-redux";

export const ComingSoon = () => {
  const theme = useSelector((state) => state.theme);

  return (
    <div style={{ width: "100%", textAlign: "center", paddingTop: "20px" }}>
      <span style={{ color: theme.color, fontSize: "20px", fontWeight: 700 }}>
        {i18next.t("game.textComingSoon")}
      </span>
    </div>
  );
};

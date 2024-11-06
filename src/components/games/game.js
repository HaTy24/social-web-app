import React from "react";
import { useSelector } from "react-redux";

import { GameBox } from "../styles/common";

export const Game = ({ info }) => {
  const { id, name, banner, status, url } = info;
  const theme = useSelector((state) => state.theme);

  return (
    <GameBox color={theme.color} tweetHov={theme.tweetHov}>
      <img
        src={banner}
        alt={name}
        width="100%"
        style={{ borderRadius: "10px" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "5px",
          fontSize: "16px",
        }}
      >
        {name}
      </div>
    </GameBox>
  );
};

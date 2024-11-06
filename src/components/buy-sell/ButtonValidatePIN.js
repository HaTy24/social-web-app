import React, { useState, useEffect } from "react";
import Loading from "../loading";
import { Button } from "../styles/common";
import { useSelector } from "react-redux";

export const ButtonValidatePIN = (props) => {
  const [isShowDes, setIsShowDes] = useState(false);
  const user = useSelector((state) => state.profile.user);
  const theme = useSelector((state) => state.theme);
  const {
    handleTradeShare,
    isDisable,
    isLoading,
    text,
    bgColor,
    style,
    opacity,
    rotateColor,
  } = props;
  return (
    <Button
      onClick={handleTradeShare}
      style={{
        borderRadius: "10px",
        width: "50%",
        padding: "15px",
        backgroundColor: bgColor,
        color: `${theme.color}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        gap: "5px",
        opacity: isDisable || !user?.isPinSet ? "0.6" : "1",
        fontSize: "16px",
        position: "relative",
        ...style,
      }}
      disabled={isDisable || !user?.isPinSet}
    >
      {text}
      {isLoading && (
        <Loading
          style={{ padding: 0 }}
          color={rotateColor || "#fff"}
          size={10}
        />
      )}
    </Button>
  );
};

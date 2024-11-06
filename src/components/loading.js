import React from "react";
import { useSelector } from "react-redux";
import { LoadingIcon } from "./styles/loading";

const Loading = ({ style, color, size }) => {
  const theme = useSelector((state) => state.theme);
  return (
    <LoadingIcon style={style}>
      <svg viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          fill="none"
          r={size || 14}
          strokeWidth="4"
          style={{ stroke: color || theme.defaultBg, opacity: "0.2" }}
        ></circle>
        <circle
          cx="16"
          cy="16"
          fill="none"
          r={size || 14}
          strokeWidth="4"
          style={{
            stroke: color || theme.defaultBg,
            strokeDasharray: 80,
            strokeDashoffset: 60,
          }}
        ></circle>
      </svg>
    </LoadingIcon>
  );
};

export default Loading;

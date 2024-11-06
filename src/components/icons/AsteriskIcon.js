import React from "react";

export const AsteriskIcon = ({ color, width, height }) => (
  <svg
    width={width || 13}
    height={height || 12}
    viewBox="0 0 13 12"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.513 6.54l-4.64-.92.92-2.72 4.2 2.04-.6-4.64h2.88l-.6 4.64 4.2-2.04.92 2.72-4.56.92 3.28 3.44-2.28 1.72-2.4-4.16-2.32 4.16-2.32-1.72 3.32-3.44z"
      fill={color}
    />
  </svg>
);

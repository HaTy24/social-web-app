import React from "react";

export const CloseIcon = ({ color, height = 30, width = 30 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke={color || "currentColor"}
    aria-hidden="true"
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    ></path>
  </svg>
);

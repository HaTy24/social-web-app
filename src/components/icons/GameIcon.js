import React from "react";

export const GameIcon = ({ color, active, activeColor }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill={active ? color : "none"}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3.65"
      y="3.65"
      width="20.7"
      height="20.7"
      rx="1.35"
      stroke={active ? activeColor : color}
      strokeWidth="1.3"
    />
    <path
      d="M14 16C15.1046 16 16 15.1046 16 14C16 12.8954 15.1046 12 14 12C12.8954 12 12 12.8954 12 14C12 15.1046 12.8954 16 14 16Z"
      fill={active ? activeColor : color}
    />
    <path
      d="M19 11C20.1046 11 21 10.1046 21 9C21 7.89539 20.1046 7 19 7C17.8954 7 17 7.89539 17 9C17 10.1046 17.8954 11 19 11Z"
      fill={active ? activeColor : color}
    />
    <path
      d="M9 21C10.1046 21 11 20.1046 11 19C11 17.8954 10.1046 17 9 17C7.89539 17 7 17.8954 7 19C7 20.1046 7.89539 21 9 21Z"
      fill={active ? activeColor : color}
    />
  </svg>
);

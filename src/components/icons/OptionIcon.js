import React from "react";

export const OptionIcon = ({ color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={`${color}`}
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke={`${color}`}
    aria-hidden="true"
    width={28}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
    ></path>
  </svg>
);

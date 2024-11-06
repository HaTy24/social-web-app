import React from "react";

export const MoreInfoIcon = ({ color }) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      clipPath="url(#clip0_91_1827)"
      fillRule="evenodd"
      clipRule="evenodd"
      fill={color}
    >
      <path d="M10 2.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM.833 10a9.167 9.167 0 1118.334 0A9.167 9.167 0 01.833 10z" />
      <path d="M10 9.167c.46 0 .834.373.834.833v3.333a.833.833 0 11-1.667 0V10c0-.46.373-.833.833-.833zM9.167 6.667c0-.46.373-.834.833-.834h.008a.833.833 0 010 1.667H10a.833.833 0 01-.833-.833z" />
    </g>
    <defs>
      <clipPath id="clip0_91_1827">
        <path fill={color} d="M0 0H20V20H0z" />
      </clipPath>
    </defs>
  </svg>
);

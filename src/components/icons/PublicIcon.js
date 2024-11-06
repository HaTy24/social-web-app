import React from "react";

export const PublicIcon = (props) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1039_1176)">
      <path
        d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12 12-5.373 12-12z"
        fill={props.color || "#1D9BF0"}
        fillOpacity={0.12}
      />
      <mask
        id="a"
        style={{
          maskType: "luminance",
        }}
        maskUnits="userSpaceOnUse"
        x={4}
        y={4}
        width={16}
        height={16}
      >
        <path d="M20 4H4v16h16V4z" fill="#fff" />
      </mask>
      <g
        mask="url(#a)"
        stroke={props.color || "#1D9BF0"}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 18v-2.667A1.334 1.334 0 0115.333 14H18M8.667 6.667V8a2 2 0 002 1.334A1.333 1.333 0 0112 10.667a1.333 1.333 0 102.667 0A1.334 1.334 0 0116 9.334h2M6 11.333h1.333a1.334 1.334 0 011.334 1.333v.667A1.333 1.333 0 0010 14.666 1.333 1.333 0 0111.333 16v2.666" />
        <path d="M12 18.666a6.667 6.667 0 100-13.333 6.667 6.667 0 000 13.333z" />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_1039_1176">
        <path fill="#fff" d="M0 0H24V24H0z" />
      </clipPath>
    </defs>
  </svg>
);

import React from "react";

export const EarthIcon = (props) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1039_1440)">
      <mask
        id="a"
        style={{
          maskType: "luminance",
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={16}
        height={16}
      >
        <path d="M16 0H0v16h16V0z" fill={props.color || "#fff"} />
      </mask>
      <g
        mask="url(#a)"
        stroke={props.color || "#F1F5F9"}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 14v-2.667A1.334 1.334 0 0111.333 10H14M4.667 2.667V4a2 2 0 002 1.334A1.333 1.333 0 018 6.667a1.333 1.333 0 102.667 0A1.334 1.334 0 0112 5.334h2M2 7.333h1.333a1.334 1.334 0 011.334 1.333v.667A1.333 1.333 0 006 10.666 1.333 1.333 0 017.333 12v2.666" />
        <path d="M8 14.666A6.667 6.667 0 108 1.333a6.667 6.667 0 000 13.333z" />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_1039_1440">
        <path fill={props.color || "#fff"} d="M0 0H16V16H0z" />
      </clipPath>
    </defs>
  </svg>
);

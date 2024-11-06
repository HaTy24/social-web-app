import React from "react";

export const DeleteIcon = (props) => (
  <svg
    width={props.width || 16}
    height={props.height || 16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2 4h12M12.667 4v9.333a1.333 1.333 0 01-1.333 1.334H4.667a1.334 1.334 0 01-1.333-1.334V4m2 0V2.667a1.333 1.333 0 011.333-1.334h2.667a1.333 1.333 0 011.333 1.334V4M6.667 7.333v4M9.334 7.333v4"
      stroke={props.color || "#F1F5F9"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

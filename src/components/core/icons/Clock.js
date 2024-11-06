import React from "react";
export const Clock = (props) => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.3334 22C17.8562 22 22.3334 17.5228 22.3334 12C22.3334 6.47715 17.8562 2 12.3334 2C6.81053 2 2.33337 6.47715 2.33337 12C2.33337 17.5228 6.81053 22 12.3334 22Z"
      stroke={props.color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.3334 6V12L16.3334 14"
      strokeWidth="1.5"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

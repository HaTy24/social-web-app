import React from "react";

export const Close = ({ color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke={color}
    aria-hidden="true"
    className="main-text-read h-[24px] w-[24px] cursor-pointer hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    ></path>
  </svg>
);

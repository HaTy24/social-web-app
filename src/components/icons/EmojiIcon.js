import React from "react";

export const EmojiIcon = ({ color, height }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height || 24}
      height={height || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "#475569"}
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M22 11v1a10 10 0 11-9-10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9L9.01 9" />
      <path d="M15 9L15.01 9" />
      <path d="M16 5h6M19 2v6" />
    </svg>
  );
};

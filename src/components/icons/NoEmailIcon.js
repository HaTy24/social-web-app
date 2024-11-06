import React from "react";
export const NoEmailIcon = ({ color }) => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.3335 4.66675H4.66683C3.37817 4.66675 2.3335 5.71142 2.3335 7.00008V21.0001C2.3335 22.2887 3.37817 23.3334 4.66683 23.3334H23.3335C24.6222 23.3334 25.6668 22.2887 25.6668 21.0001V7.00008C25.6668 5.71142 24.6222 4.66675 23.3335 4.66675Z"
      stroke={color || "#1E293B"}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25.6668 8.16675L15.2018 14.8167C14.8416 15.0424 14.4252 15.1621 14.0002 15.1621C13.5751 15.1621 13.1587 15.0424 12.7985 14.8167L2.3335 8.16675"
      stroke={color || "#1E293B"}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

import React from "react";
import { useSelector } from "react-redux";

import { UserImage } from "../styles/profile";
import { PriceIcon } from "../icons/PriceIcon";
import i18next from "i18next";

export const VoteItem = ({
  top,
  imageUrl,
  fullname,
  userName,
  holders,
  amount,
  realAmount,
  hidePrice,
}) => {
  const theme = useSelector((state) => state.theme);
  const renderTopVote = () => {
    switch (top) {
      case 0:
        return (
          <span
            style={{
              backgroundColor: "#E53A3B",
              padding: "0 4px",
              borderRadius: "14px",
              color: `${theme.color}`,
              position: "absolute",
              top: 0,
              left: "-15px",
              width: "38px",
              textAlign: "center",
            }}
          >
            1st
          </span>
        );
      case 1:
        return (
          <span
            style={{
              backgroundColor: "#E5823A",
              padding: "0 4px",
              borderRadius: "14px",
              color: `${theme.color}`,
              position: "absolute",
              top: 0,
              left: "-15px",
              width: "38px",
              textAlign: "center",
            }}
          >
            2nd
          </span>
        );
      case 2:
        return (
          <span
            style={{
              backgroundColor: "#EBAB04",
              padding: "0 4px",
              borderRadius: "14px",
              color: `${theme.color}`,
              position: "absolute",
              top: 0,
              left: "-15px",
              width: "38px",
              textAlign: "center",
            }}
          >
            3rd
          </span>
        );
      default:
        break;
    }
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <div style={{ position: "relative" }}>
          <UserImage src={imageUrl} style={{ width: "60px", height: "60px" }} />
          {renderTopVote()}
        </div>
        <div style={{ color: `${theme.color}` }}>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>{fullname}</div>
          <div style={{ color: "#999" }}>@{userName}</div>
          <div style={{ color: "#999" }}>
            {i18next.t("votes.holders")} <span style={{ color: theme.color }}>{holders}</span>
          </div>
        </div>
      </div>
      {!hidePrice && (
        <div style={{ color: `${theme.color}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ fontSize: "16px", fontWeight: "bold" }}>{amount}</div>
            <PriceIcon color={theme.color} />
          </div>
          <div style={{ color: "#999", textAlign: "right", fontSize: "13px" }}>
            ${realAmount}
          </div>
        </div>
      )}
    </div>
  );
};

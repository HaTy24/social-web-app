import React, { useState } from "react";
import { useSelector } from "react-redux";

import { toast } from "react-toastify";
import { CopyIcon } from "../core/icons/CopyIcon";
import Loading from "../loading";
import Modal from "../modal";
import ProfileHeader from "../profileHeader";
import { ProfileCorner } from "../styles/common";
import i18next from "i18next";

const Deposit = () => {
  const user = useSelector((state) => state.profile.user);
  const theme = useSelector((state) => state.theme);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(user.walletAddress)
      .then(() => toast(`${i18next.t("copiedToClipboard")}`), {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  };

  if (user === null) return <Loading />;
  return (
    <React.Fragment>
      <ProfileCorner border={theme.border}>
        <ProfileHeader heading={`${i18next.t("deposit.receiveBNB")}`} flex={"space-between"} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "20px",
            marginTop: "30px",
          }}
        >
          <div>
            <p
              style={{
                lineHeight: "1.5rem",
                fontWeight: "bold",
                fontSize: "15px",
                marginBottom: "5px",
                color: theme.color,
              }}
            >
              {i18next.t("deposit.network")}
            </p>
            <div
              style={{
                padding: "10px 15px",
                border: `1px solid ${theme.border}`,
                borderRadius: "6px",
                backgroundColor: "#F1F5F9",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  marginBottom: 0,
                }}
              >
                {i18next.t("deposit.BNBChain")}
              </p>
            </div>
          </div>
          <div>
            <p
              style={{
                lineHeight: "1.5rem",
                fontWeight: "bold",
                fontSize: "15px",
                marginBottom: "5px",
                color: theme.color,
              }}
            >
              {i18next.t("deposit.yourWalletAddress")}
            </p>
            <div
              style={{
                padding: "10px 15px",
                border: `1px solid ${theme.border}`,
                borderRadius: "6px",
                backgroundColor: "#F1F5F9",
                overflow: "hidden",
                display: "flex",
                justifyContent: "space-between",
              }}
              onClick={handleCopy}
            >
              <p
                style={{
                  fontSize: "14px",
                  marginBottom: 0,
                  maxWidth: "90%",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {user.walletAddress}
              </p>
              <div
                style={{
                  color: `#657786`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                }}
              >
                <div style={{ width: "18px" }}>
                  <CopyIcon color={theme.color} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <p
              style={{
                lineHeight: "1.5rem",
                fontWeight: "bold",
                fontSize: "15px",
                marginBottom: "5px",
                color: theme.color,
              }}
            >
              {i18next.t("deposit.yourBalance")}
            </p>
            <div
              style={{
                padding: "10px 15px",
                border: `1px solid ${theme.border}`,
                borderRadius: "6px",
                backgroundColor: "#F1F5F9",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  marginBottom: 0,
                }}
              >
                {user.balance > 0 ? Number(user.balance).toFixed(6) : 0}
              </p>
            </div>
          </div>
        </div>
      </ProfileCorner>
    </React.Fragment>
  );
};

export default Deposit;

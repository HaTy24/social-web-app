import React from "react";
import Modal from "../modal";
import { ModalTransfer } from "../styles/profile-wallet";
import { ProcessingIcon } from "../icons/ProcessingIcon";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { Button } from "../styles/common";
import i18next from "i18next";

export default function ModalGameTransactionSuccess({ onClose }) {
  const theme = useSelector((state) => state.theme);
  const toggleOpen = () => {
    onClose();
  };
  return (
    <Modal
      toggleOpen={toggleOpen}
      children={
        <ModalTransfer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              alignItems: "center",
              padding: "20px 0px",
            }}
          >
            <ProcessingIcon />
            <span
              style={{
                color: theme.color,
                fontSize: "20px",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              {i18next.t("depositWithdraw.yourTransactionIsProcessing")}
            </span>
            <span style={{ color: theme.color, textAlign: "center" }}>
              {i18next.t("depositWithdraw.reviewingYourRequest")}
            </span>
            <Link
              style={{ color: theme.bg, width: "100%" }}
              to={"/my-portfolio?tabs=game-portfolio"}
            >
              <Button
                color="#000"
                type="button"
                style={{
                  padding: "12px 24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "5px",
                  width: "100%",
                  borderRadius: "8px",
                }}
              >
                {i18next.t("depositWithdraw.viewTransactionHistory")}
              </Button>
            </Link>
          </div>
        </ModalTransfer>
      }
      handleClose={onClose}
      padding="5px 20px"
      heading=" "
      display="flex"
    />
  );
}

import React, { useEffect, useState } from "react";
import { NoEmailIcon } from "../icons/NoEmailIcon";
import { Button } from "../styles/common";
import Loading from "../loading";
import i18next from "i18next";

export default function VerifyEmail({
  handleResend,
  onBack,
  isLoading,
  isStartCountDown,
  setIsStartCountDown,
  email
}) {
  const [countdown, setCountdown] = useState(60);
  useEffect(() => {
    let countdownInterval;

    if (countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => {
        clearInterval(countdownInterval);
      };
    } else if (countdown === 0) {
      setIsStartCountDown(false);
    }
  }, [countdown]);

  useEffect(() => {
    isStartCountDown && setCountdown(60);
  }, [isStartCountDown]);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#18181B",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "450px",
          maxWidth: "100%",
        }}
      >
        <NoEmailIcon color={"#fff"} />
        <span
          style={{
            color: "#fff",
            fontSize: "24px",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {i18next.t("verifyEmail")}
        </span>
        <p style={{ color: "#fff", textAlign: "center" }}>
          {i18next.t("weHaveSentLinkTo")} {email}.
        </p>
        <p style={{ color: "#fff", textAlign: "center" }}>
          {i18next.t("pleaseClickOnTheLink")}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Button
            onClick={handleResend}
            disabled={countdown > 0}
            style={{
              padding: "12px 24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              width: "max-content",
              borderRadius: "8px",
              // background: "#fff",
              color: "#1E293B",
            }}
          >
            {i18next.t("resendEmail")}
            {countdown > 0 && <div style={{ width: "20px" }}>{countdown}</div>}
            {isLoading && (
              <Loading style={{ padding: 0 }} size={10} color={"#111"} />
            )}
          </Button>
          <Button
            onClick={onBack}
            style={{
              padding: "12px 24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              width: "max-content",
              borderRadius: "8px",
              background: "transparent",
              color: "#fff",
              border: "1px solid #444",
            }}
          >
            {i18next.t("returnToSite")}
          </Button>
        </div>
      </div>
    </div>
  );
}

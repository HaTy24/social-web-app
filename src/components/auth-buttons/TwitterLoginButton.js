import React from "react";
import { Button } from "../styles/signin";
import { TwitterIcon } from "../icons/TwitterIcon";
import { authService } from "../../services/AuthService";

const getloginUrl = async () => {
  const response = await authService.twitterGetLoginUrl();
  if (response.success) {
    const a = document.createElement("a");
    a.href = response.data.url;
    a.click();
  }
};

// the component
export function TwitterOauthButton() {
  return (
    <Button
      style={{
        background: "#27272A",
        border: 0,
        padding: "8px",
        borderRadius: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
      }}
      onClick={getloginUrl}
    >
      <TwitterIcon color="white" />
      {/* Continue with X (formerly Twitter) */}
    </Button>
  );
}

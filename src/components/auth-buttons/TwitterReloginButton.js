import React from "react";
import { Button } from "../styles/signin";
import { TwitterIcon } from "../icons/TwitterIcon";
import { authService } from "../../services/AuthService";
import { useDispatch } from "react-redux";
import { LOGOUT_USER } from "../../redux/actions";

// the component
export const TwitterReloginButton = () => {
  const dispatch = useDispatch();
  const getloginUrl = async () => {
    try {
      dispatch({ type: LOGOUT_USER });
      authService.logout();
      const response = await authService.twitterGetLoginUrl();
      if (response.success) {
        const a = document.createElement("a");
        a.href = response.data.url;
        a.click();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      style={{
        background: "white",
        border: 0,
        padding: "8px 10px",
        borderRadius: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
      }}
      onClick={getloginUrl}
    >
      <TwitterIcon />
      Login with X (formerly Twitter)
    </Button>
  );
};

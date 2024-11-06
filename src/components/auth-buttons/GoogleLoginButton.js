import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { SET_THEME, SET_USER } from "../../redux/actions";
import { authService } from "../../services/AuthService";
import { GoogleIcon } from "../icons/GoogleIcon";
import { Button } from "../styles/signin";
import i18next from "i18next";

export function GoogleLoginButton() {
  const dispatch = useDispatch();
  const history = useHistory();
  let googleButtonWrapper = null;
  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });

  useEffect(() => {
    const src = "https://accounts.google.com/gsi/client";
    const id = process.env.GOOGLE_CLIENT_ID;

    loadScript(src)
      .then(() => {
        /*global google*/
        google.accounts.id.initialize({
          client_id: id,
          callback: handleCredentialResponse,
        });
        const createFakeGoogleWrapper = () => {
          const googleLoginWrapper = document.createElement("div");
          // Or you can simple hide it in CSS rule for custom-google-button
          googleLoginWrapper.style.display = "none";
          googleLoginWrapper.classList.add("custom-google-button");

          // Add the wrapper to body
          document.body.appendChild(googleLoginWrapper);

          // Use GSI javascript api to render the button inside our wrapper
          // You can ignore the properties because this button will not appear
          google.accounts.id.renderButton(googleLoginWrapper, {
            type: "icon",
            width: "200",
          });

          const googleLoginWrapperButton =
            googleLoginWrapper.querySelector("div[role=button]");

          return {
            click: () => {
              googleLoginWrapperButton.click();
            },
          };
        };

        // Now we have a wrapper to click
        googleButtonWrapper = createFakeGoogleWrapper();
        google.accounts.id.renderButton(googleButtonWrapper, {
          theme: "outline",
          size: "large",
        });
      })
      .catch(console.error);

    return () => {
      const scriptTag = document.querySelector(`script[src="${src}"]`);
      if (scriptTag) document.body.removeChild(scriptTag);
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const loginResponse = await authService.googleLogin(response.credential);
      if (!loginResponse.success) {
        if (loginResponse.message === "email already registered") {
          toast.error(`${i18next.t("emailAlreadyRegistered")}`);
        } else {
          toast.error(loginResponse.message);
        }
        return;
      }
      if (!loginResponse.data.user || !loginResponse.data.access_token) {
        // toast(loginResponse.code);
        toast.error(`${i18next.t("somethingWentWrong")}`);
      } else {
        authService.setAccessToken(loginResponse.data.access_token);
        dispatch({ type: SET_USER, payload: loginResponse.data.user });
        dispatch({ type: SET_THEME, payload: "dark" });
        history.replace("/home");
      }
    } catch (error) {
      toast.error(`${i18next.t("somethingWentWrong")}`);
      console.log(error);
    }
  };

  return (
    <Button
      onClick={() => googleButtonWrapper.click()}
      style={{
        background: "#27272A",
        width: "40px",
        height: "40px",
        border: 0,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GoogleIcon />
    </Button>
  );
}

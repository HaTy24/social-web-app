import { Col, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { getStaticURL } from "../../constants";
import { LOGOUT_USER, SET_THEME, SET_USER } from "../../redux/actions";
import { authService } from "../../services/AuthService";
import { formatErrorMessage } from "../../utils/formatErrorMessage";
import { TwitterOauthButton } from "../auth-buttons/TwitterLoginButton";
import { BackgroundContent } from "../styles/signin";
import i18next from "i18next";

const TwitterCallback = ({ linkTwitter }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const oauthToken = searchParams.get("oauth_token");
  const oauthVerifier = searchParams.get("oauth_verifier");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);
  const history = useHistory();

  const twitterLogin = async () => {
    const loginResponse = await authService.twitterLogin(
      oauthToken,
      oauthVerifier
    );

    if (loginResponse.success) {
      if (["inactive", "suspended"].includes(loginResponse.data.user.status)) {
        dispatch({ type: LOGOUT_USER });
        authService.logout();
        history.push("/");
        toast.error(`${i18next.t("accountLocked")}`, {
          position: "bottom-center",
          autoClose: 4000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        authService.setAccessToken(loginResponse.data.access_token);
        dispatch({ type: SET_USER, payload: loginResponse.data.user });
        dispatch({ type: SET_THEME, payload: "dark" });
        history.push("/home");
      }
    } else {
      toast(formatErrorMessage(loginResponse.code), {
        position: "bottom-center",
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleLinkTwitter = async () => {
    const response = await authService.linkTwitter(oauthToken, oauthVerifier);
    if (response.success) {
      authService.setAccessToken(response.data.access_token);
      dispatch({ type: SET_USER, payload: response.data.user });
      dispatch({ type: SET_THEME, payload: "dark" });
      history.push("/home");
    } else {
      toast(formatErrorMessage(response.code), {
        position: "bottom-center",
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    twitterLogin();
    // const token = authService.loadAccessToken();
    // if (token && !user.twitterId) {
    //   handleLinkTwitter();
    // } else {
    //   twitterLogin();
    // }
  }, []);
  return (
    <React.Fragment>
      <BackgroundContent
        style={{
          minHeight: "100vh",
          overflow: "hidden",
          backgroundColor: "#18181B",
        }}
      >
        <Row>
          <Col span={24}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={`${getStaticURL()}/assets/images/weknot_logo_c.svg`}
                alt="Weknot"
                width={220}
                height={220}
              />
              <h1
                style={{
                  fontSize: "2.8rem",
                  marginTop: "2rem",
                  fontWeight: "bold",
                  padding: "0px 10px",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Step into the Next Era: Where SocialFi and GameFi Collide.
              </h1>
              <h2
                style={{
                  fontSize: "1.5rem",
                  marginTop: "1rem",
                  color: "white",
                }}
              >
                {user.id && !user.twitterId
                  ? "Please link with Twitter!"
                  : "Join us today."}
              </h2>
              <div
                style={{
                  marginTop: "2rem",
                  marginBottom: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                {/* {!user.id && <GoogleLoginButton />} */}
                <TwitterOauthButton />
              </div>
              {/* <div
                style={{
                  padding: "1rem",
                  backgroundColor: "white",
                  borderRadius: "10px",
                  display: "flex",
                  gap: "1rem",
                  marginTop: "2rem",
                }}
              >
                <a href="/" target="_blank">
                  <img
                    src={`${getStaticURL()}/assets/images/discord.svg`}
                    alt="discord"
                  />
                </a>
                <a href="/" target="_blank">
                  <img
                    src={`${getStaticURL()}/assets/images/telegram.svg`}
                    alt="telegram"
                  />
                </a>
                <a href="/" target="_blank">
                  <img
                    src={`${getStaticURL()}/assets/images/twitter-x.svg`}
                    alt="twitter-x"
                  />
                </a>
              </div> */}
            </div>
          </Col>
        </Row>
      </BackgroundContent>
    </React.Fragment>
  );
};

export default TwitterCallback;

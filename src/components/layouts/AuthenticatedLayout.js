import { Col, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import { WS_TOPIC } from "../../constants";
import { WebSocketCtx } from "../../providers/WebSocketProvider";
import {
  INCREASE_TOTAL_MESSAGES_UNREAD,
  INCREASE_TOTAL_NOTIFICATIONS_UNREAD,
  LOGOUT_USER,
  SET_MODAL_APP_VERSION,
  SET_MODAL_COOKIES_POLICY,
  SET_TOTAL_MESSAGES_UNREAD,
  SET_TOTAL_NOTIFICATIONS_UNREAD,
} from "../../redux/actions";
import { ACCESS_TOKEN, authService } from "../../services/AuthService";
import { notificationService } from "../../services/NotificationService";
import updatedText from "../../updatedText.json";
import { isInStandaloneMode, isIos } from "../../utils/pwaHelper";
import ModalCenter from "../modalCenter";
import ModalCookies from "../modalCookies";
import { ProfileCorner } from "../styles/common";
import { chatService } from "../../services/ChatService";

const SideBar = React.lazy(() => import("../sidebar/index"));
const NavigationBar = React.lazy(() => import("../NavigationBar"));
const Navbar = React.lazy(() => import("../Navbar"));
const MenuBar = React.lazy(() => import("../menubar/index"));

export const AuthenticatedLayout = (WrappedComponent, isNotShow) => (props) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const appVersion = process.env.APP_VERSION;
  const modalAppVersion = useSelector((state) => state.modalAppVersion);
  const modalCookies = useSelector((state) => state.modalCookies);
  const history = useHistory();
  const localCookiesPolicy = localStorage.getItem("isCookiesPolicyAccepted");
  const location = useLocation();
  const [firstRender, setFirstRender] = useState(true);
  const { webSocket, register } = useContext(WebSocketCtx);
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const user = useSelector((state) => state.profile.user);

  useEffect(() => {
    if (accessToken && !webSocket) {
      register(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (webSocket) {
      webSocket.on("connect", () => {
        countNotificationsUnread();
        countMessagesUnread();
      });

      if (location.pathname !== "/notifications") {
        if (
          !firstRender &&
          webSocket._callbacks[`$notification`] == undefined
        ) {
          webSocket.on(WS_TOPIC.NOTIFICATION, () => {
            countNotificationsUnread();
          });
        }
      }

      if (location.pathname.split("/")[1] !== "messages") {
        if (
          !firstRender &&
          webSocket._callbacks[`$send_message`] == undefined &&
          webSocket._callbacks[`$reply_message`] == undefined
        ) {
          webSocket.on(WS_TOPIC.SEND_MESSAGE, (data) => {
            if (data.fromUserId != user.id) {
              dispatch({ type: INCREASE_TOTAL_MESSAGES_UNREAD, payload: 1 });
            }
          });
          webSocket.on(WS_TOPIC.REPLY_MESSAGE, (data) => {
            if (data.fromUserId != user.id) {
              dispatch({ type: INCREASE_TOTAL_MESSAGES_UNREAD, payload: 1 });
            }
          });
        } else {
          webSocket.off(WS_TOPIC.SEND_MESSAGE);
          webSocket.off(WS_TOPIC.REPLY_MESSAGE);
        }
      }
      setFirstRender(false);
    }
  }, [firstRender, webSocket]);

  const countNotificationsUnread = async () => {
    const countResponse = await notificationService.countNotificationsUnread();
    if (countResponse.success) {
      dispatch({
        type: SET_TOTAL_NOTIFICATIONS_UNREAD,
        payload: countResponse.data,
      });
    }
  };

  const countMessagesUnread = async () => {
    const countResponse = await chatService.countMessageUnread();
    if (countResponse.success) {
      dispatch({
        type: SET_TOTAL_MESSAGES_UNREAD,
        payload: countResponse.data,
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem("isCookiesPolicyAccepted", true);
    dispatch({ type: SET_MODAL_COOKIES_POLICY, payload: false });
  };

  const handleDecline = () => {
    dispatch({ type: LOGOUT_USER });
    authService.logout();
    history.push("/");
    localStorage.setItem("isCookiesPolicyAccepted", false);
  };

  const checkAppVersion = () => {
    const localVersion = localStorage.getItem("version");
    if (localVersion !== appVersion) {
      dispatch({ type: SET_MODAL_APP_VERSION });
      localStorage.setItem("version", appVersion);
    }
  };

  const handleCloseModalAppVersion = () => {
    dispatch({ type: SET_MODAL_APP_VERSION, payload: false });
    if (localCookiesPolicy === null) {
      dispatch({ type: SET_MODAL_COOKIES_POLICY });
    }
  };
  //install app
  const installApp = (e) => {
    e.preventDefault();

    const deferredPrompt = e;
    const installButton = document.getElementById("install-box");

    installButton.addEventListener("click", () => {
      // Checks if should display install popup notification:
      if (isIos() && !isInStandaloneMode()) {
        return;
      }

      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("App installed");
        } else {
          console.log("App installation declined");
        }
      });
    });
  };

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", installApp);
    checkAppVersion();
    if (!localCookiesPolicy || localCookiesPolicy === "false") {
      dispatch({ type: SET_MODAL_COOKIES_POLICY, payload: true });
    }
  }, []);

  return (
    <React.Fragment>
      <div style={{ background: theme.bg }}>
        <Row>
          <Col lg={7} md={5} xs={0}>
            <MenuBar />
          </Col>
          <Col span={24} lg={9} md={19} sm={100}>
            {!isNotShow && <Navbar />}
            <ProfileCorner>
              <WrappedComponent />
            </ProfileCorner>
            {!isNotShow && <NavigationBar />}
          </Col>
          <Col lg={8} md={0} xs={0}>
            <SideBar />
          </Col>
        </Row>
      </div>
      {modalAppVersion.showModalAppVersion && (
        <ModalCenter
          children={
            <div style={{ color: theme.color }}>
              <ul style={{ listStyle: "none", paddingLeft: "15px" }}>
                {updatedText.newFeatures.map((feature, idx) => (
                  <li
                    style={{
                      fontSize: "16px",
                      marginTop: "10px",
                    }}
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          }
          handleClose={handleCloseModalAppVersion}
          padding="15px"
          heading={`🚀 What's New in Version ${updatedText.version}`}
        />
      )}
      {modalCookies.showModalCookiesPolicy && (
        <ModalCookies
          onClickAccept={handleAccept}
          onClickDecline={handleDecline}
        />
      )}
    </React.Fragment>
  );
};

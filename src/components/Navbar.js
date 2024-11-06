import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { getStaticURL } from "../constants";
import { LOGOUT_USER, SET_LANGUAGE, SET_THEME, SET_USER } from "../redux/actions";
import { authService } from "../services/AuthService";
import { customFormat } from "../utils/Number";
import { isInStandaloneMode, isIos } from "../utils/pwaHelper";
import { ClickOutside } from "../utils/triggerClickOutside";
import Icon from "./icon";
import { CloseIcon } from "./icons/CloseIcon";
import { DownloadIcon } from "./icons/DownloadIcon";
import { LogoutIcon } from "./icons/LogoutIcon";
import { NotifyIcon } from "./icons/NotifyIcon";
import { UploadIcon } from "./icons/UploadIcon";
import ModalCenter from "./modalCenter";
import { MoreItem, NavbarContainer, NavbarUserBalance } from "./styles/common";
import {
  MenuItem,
  MenuTitle,
  ModalMore,
  NotificationsCountBox,
  Overlay,
  SelectItem,
  SidebarMobile,
} from "./styles/menubar";
import { UserImage } from "./styles/profile";
import { InvestIcon } from "./icons/InvestIcon";
import { AsteriskIcon } from "./icons/AsteriskIcon";
import { EyeOffIcon } from "./icons/EyeOffIcon";
import { EyeOnIcon } from "./icons/EyeOnIcon";
import i18next from "i18next";
import Modal from "./modal";
import { CheckIcon } from "./icons/CheckIcon";

const Navbar = () => {
  const [direction, setDirection] = useState("up");
  const theme = useSelector((state) => state.theme);
  const totalNotificationsUnread = useSelector(
    (state) => state.notification.totalNotificationsUnread
  );
  const [userInfo, setUserInfo] = useState({});
  const mode = theme.mode;
  const user = useSelector((state) => state.profile.user);
  const refresh = useSelector((state) => state.update.refresh);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const ref = useRef();
  const [isModalOpenLanguage, setIsModalOpenLanguage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleMore, setToggleMore] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const language = useSelector((state) => state.language);
  const refMore = useRef();

  function getPWADisplayMode() {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    if (document.referrer.startsWith("android-app://")) {
      return "twa";
    } else if (navigator.standalone || isStandalone) {
      return "standalone";
    }
    return "browser";
  }

  const checkFlatform = () => {
    if (isIos() && !isInStandaloneMode()) {
      setIsGuideModalOpen(true);
      return;
    }
  };

  const handleLogout = () => {
    dispatch({ type: LOGOUT_USER });
    authService.logout();
    history.push("/");
  };
  const paths = {
    votes: [
      <svg
        width={28}
        height={28}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x={4.5}
          y={8.5}
          width={5}
          height={16}
          rx={0.5}
          stroke={theme.color || "#F1F5F9"}
          style={{ strokeWidth: 1.4 }}
        />
        <rect
          x={11.5}
          y={3.5}
          width={5}
          height={21}
          rx={0.5}
          stroke={theme.color || "#F1F5F9"}
          style={{ strokeWidth: 1.4 }}
        />
        <rect
          x={18.5}
          y={11.5}
          width={5}
          height={13}
          rx={0.5}
          stroke={theme.color || "#F1F5F9"}
          style={{ strokeWidth: 1.4 }}
        />
      </svg>,
    ],
    referral: [
      "M20,18a1,1,0,0,0,1-1V13a1,1,0,0,0-1-1H13V9.858a4,4,0,1,0-2,0V12H4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V14h6v3a1,1,0,0,0,2,0V14h6v3A1,1,0,0,0,20,18ZM12,8a2,2,0,1,1,2-2A2,2,0,0,1,12,8ZM23,21a1,1,0,0,1-1,1H18a1,1,0,0,1,0-2h4A1,1,0,0,1,23,21ZM1,21a1,1,0,0,1,1-1H6a1,1,0,0,1,0,2H2A1,1,0,0,1,1,21Zm13-1a1,1,0,0,1,0,2H10a1,1,0,0,1,0-2Z",
    ],
    invest: [
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.3334 8.1665H4.66671C3.37804 8.1665 2.33337 9.21117 2.33337 10.4998V22.1665C2.33337 23.4552 3.37804 24.4998 4.66671 24.4998H23.3334C24.622 24.4998 25.6667 23.4552 25.6667 22.1665V10.4998C25.6667 9.21117 24.622 8.1665 23.3334 8.1665Z"
          fill={theme.bg || "#F1F5F9"}
          stroke={theme.color || "#F1F5F9"}
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.6667 24.5V5.83333C18.6667 5.21449 18.4209 4.621 17.9833 4.18342C17.5457 3.74583 16.9522 3.5 16.3334 3.5H11.6667C11.0479 3.5 10.4544 3.74583 10.0168 4.18342C9.57921 4.621 9.33337 5.21449 9.33337 5.83333V24.5"
          stroke={theme.color || "#F1F5F9"}
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.6667 24.5002V8M9.33337 8V24.5002"
          stroke="#191919"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>,
    ],
    ["profile-wallet"]: [
      "M22.9286 7.59184H4.96939C4.6717 7.59184 4.3862 7.47358 4.1757 7.26308C3.9652 7.05258 3.84694 6.76708 3.84694 6.46939C3.84694 6.1717 3.9652 5.8862 4.1757 5.6757C4.3862 5.4652 4.6717 5.34694 4.96939 5.34694H20.2347C20.4133 5.34694 20.5846 5.27598 20.7109 5.14968C20.8372 5.02338 20.9082 4.85208 20.9082 4.67347C20.9082 4.49485 20.8372 4.32355 20.7109 4.19725C20.5846 4.07095 20.4133 4 20.2347 4H4.96939C4.31447 4 3.68637 4.26017 3.22327 4.72327C2.76017 5.18637 2.5 5.81447 2.5 6.46939V20.8367C2.5 21.4917 2.76017 22.1198 3.22327 22.5829C3.68637 23.046 4.31447 23.3061 4.96939 23.3061H22.9286C23.3453 23.3061 23.745 23.1406 24.0397 22.8459C24.3344 22.5512 24.5 22.1515 24.5 21.7347V9.16327C24.5 8.7465 24.3344 8.3468 24.0397 8.0521C23.745 7.7574 23.3453 7.59184 22.9286 7.59184ZM23.1531 21.7347C23.1531 21.7942 23.1294 21.8513 23.0873 21.8934C23.0452 21.9355 22.9881 21.9592 22.9286 21.9592H4.96939C4.6717 21.9592 4.3862 21.8409 4.1757 21.6304C3.9652 21.4199 3.84694 21.1344 3.84694 20.8367V8.66826C4.19421 8.84651 4.57904 8.93926 4.96939 8.93878H22.9286C22.9881 8.93878 23.0452 8.96243 23.0873 9.00453C23.1294 9.04663 23.1531 9.10373 23.1531 9.16327V21.7347ZM20.0102 15C20.0102 15.222 19.9444 15.439 19.821 15.6236C19.6977 15.8082 19.5224 15.9521 19.3173 16.037C19.1122 16.122 18.8865 16.1442 18.6688 16.1009C18.451 16.0576 18.251 15.9507 18.0941 15.7937C17.9371 15.6367 17.8302 15.4367 17.7869 15.219C17.7436 15.0012 17.7658 14.7756 17.8507 14.5705C17.9357 14.3654 18.0796 14.1901 18.2642 14.0667C18.4487 13.9434 18.6658 13.8776 18.8878 13.8776C19.1854 13.8776 19.4709 13.9958 19.6814 14.2063C19.8919 14.4168 20.0102 14.7023 20.0102 15Z",
    ],
    ["my-portfolio"]: [
      <svg
        width={28}
        height={28}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.333 25.667a1.167 1.167 0 100-2.333 1.167 1.167 0 000 2.333zM22.167 25.667a1.167 1.167 0 100-2.333 1.167 1.167 0 000 2.333zM2.391 2.391h2.333l3.104 14.49a2.333 2.333 0 002.333 1.844h11.41a2.333 2.333 0 002.275-1.832l1.925-8.668H5.973"
          stroke={theme.color || "#F1F5F9"}
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>,
    ],
    profile: [
      "M12 11.816c1.355 0 2.872-.15 3.84-1.256.814-.93 1.078-2.368.806-4.392-.38-2.825-2.117-4.512-4.646-4.512S7.734 3.343 7.354 6.17c-.272 2.022-.008 3.46.806 4.39.968 1.107 2.485 1.256 3.84 1.256zM8.84 6.368c.162-1.2.787-3.212 3.16-3.212s2.998 2.013 3.16 3.212c.207 1.55.057 2.627-.45 3.205-.455.52-1.266.743-2.71.743s-2.255-.223-2.71-.743c-.507-.578-.657-1.656-.45-3.205zm11.44 12.868c-.877-3.526-4.282-5.99-8.28-5.99s-7.403 2.464-8.28 5.99c-.172.692-.028 1.4.395 1.94.408.52 1.04.82 1.733.82h12.304c.693 0 1.325-.3 1.733-.82.424-.54.567-1.247.394-1.94zm-1.576 1.016c-.126.16-.316.246-.552.246H5.848c-.235 0-.426-.085-.552-.246-.137-.174-.18-.412-.12-.654.71-2.855 3.517-4.85 6.824-4.85s6.114 1.994 6.824 4.85c.06.242.017.48-.12.654z",
    ],
    more: [
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_367_1374"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="28"
          height="28"
        >
          <path d="M28 0H0V28H28V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_367_1374)">
          <path
            d="M14 24.5C19.799 24.5 24.5 19.799 24.5 14C24.5 8.20101 19.799 3.5 14 3.5C8.20101 3.5 3.5 8.20101 3.5 14C3.5 19.799 8.20101 24.5 14 24.5Z"
            stroke={theme.color || "#F1F5F9"}
            strokeWidth="1.5"
            strokeMiterlimit="10"
          />
          <path
            d="M14 15.3125C14.7249 15.3125 15.3125 14.7249 15.3125 14C15.3125 13.2751 14.7249 12.6875 14 12.6875C13.2751 12.6875 12.6875 13.2751 12.6875 14C12.6875 14.7249 13.2751 15.3125 14 15.3125Z"
            fill={theme.color || "#F1F5F9"}
          />
          <path
            d="M18.8125 15.3125C19.5374 15.3125 20.125 14.7249 20.125 14C20.125 13.2751 19.5374 12.6875 18.8125 12.6875C18.0876 12.6875 17.5 13.2751 17.5 14C17.5 14.7249 18.0876 15.3125 18.8125 15.3125Z"
            fill={theme.color || "#F1F5F9"}
          />
          <path
            d="M9.1875 15.3125C9.91237 15.3125 10.5 14.7249 10.5 14C10.5 13.2751 9.91237 12.6875 9.1875 12.6875C8.46263 12.6875 7.875 13.2751 7.875 14C7.875 14.7249 8.46263 15.3125 9.1875 15.3125Z"
            fill={theme.color || "#F1F5F9"}
          />
        </g>
      </svg>,
    ],
  };
  const dark = [
    "M15.692 11.205l6.383-7.216c.45-.45.45-1.18 0-1.628-.45-.45-1.178-.45-1.627 0l-7.232 6.402s.782.106 1.595.93c.548.558.882 1.51.882 1.51z",
    "M17.45 22.28H3.673c-1.148 0-2.083-.946-2.083-2.11V7.926c0-1.165.934-2.112 2.082-2.112h5.836c.414 0 .75.336.75.75s-.336.75-.75.75H3.672c-.32 0-.583.274-.583.612V20.17c0 .336.26.61.582.61h13.78c.32 0 .583-.273.583-.61v-6.28c0-.415.336-.75.75-.75s.75.335.75.75v6.28c0 1.163-.934 2.11-2.084 2.11z",
    "M8.18 16.99c-.19.154-.476.032-.504-.21-.137-1.214-.234-4.053 1.483-5.943.908-1 3.02-1.52 4.475-.198s1.14 3.473.23 4.473c-2.07 2.15-3.428.058-5.686 1.878z",
  ];

  let lastScrollTop = 0;

  const scrollDirection = () => {
    if (window.scrollY < lastScrollTop || window.scrollY <= 100) {
      setDirection("up");
    } else {
      setDirection("down");
    }
    lastScrollTop = window.scrollY;
  };

  // useEffect(() => {
  //   window.addEventListener("scroll", scrollDirection);

  //   return () => {
  //     window.removeEventListener("scroll", scrollDirection);
  //   };
  // }, []);

  useEffect(() => {
    getUserInfo();
  }, [refresh]);

  useEffect(() => {
    const userInfoInterval = setInterval(() => {
      getUserInfoWithoutRedux();
    }, 20000);

    return () => clearInterval(userInfoInterval);
  }, [refresh]);

  const getUserInfo = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setUserInfo(response.data);
        dispatch({ type: SET_USER, payload: { ...user, ...response.data } });
        if (["inactive", "suspended"].includes(response.data.status)) {
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
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserInfoWithoutRedux = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setUserInfo(response.data);
        if (["inactive", "suspended"].includes(response.data.status)) {
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
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  ClickOutside(refMore, () => {
    setToggleMore(false);
  });

  return (
    <>
    {isModalOpenLanguage && (
        <Modal
          children={
            <div
              style={{
                padding: "30px 0",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <SelectItem
                onClick={() => {
                  dispatch({ type: SET_LANGUAGE, payload: "en" });
                }}
                bgHov={theme.tweetHov}
                style={{
                  padding: "10px 20px",
                  justifyContent: "space-between",
                  background: theme.tweetHov,
                  color: theme.mode === "dark" ? "#fff" : "#000"
                }}
              >
                English
                {language === "en" && <CheckIcon />}
              </SelectItem>
              <SelectItem
                onClick={() => {
                  dispatch({ type: SET_LANGUAGE, payload: "cn" });
                }}
                bgHov={theme.tweetHov}
                style={{
                  padding: "10px 20px",
                  justifyContent: "space-between",
                  background: theme.tweetHov,
                  color: theme.mode === "dark" ? "#fff" : "#000"
                }}
              >
                简体中文
                {language === "cn" && <CheckIcon />}
              </SelectItem>
            </div>
          }
          handleClose={() => setIsModalOpenLanguage(false)}
          toggleOpen={() => setIsModalOpenLanguage(!isModalOpenLanguage)}
          padding="15px"
          top="10%"
        />
      )}
      <NavbarContainer
        bg={theme.bg}
        // style={{
        //   transform: `${
        //     direction == "up" ? "translate(0,0)" : "translate(0px, -50px)"
        //   }`,
        //   transitionDuration: "0.5s",
        // }}
      >
        <UserImage
          src={userInfo.profile_image_url}
          style={{ width: "40px", height: "40px" }}
          onClick={toggleModalOpen}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (location.pathname === "/notifications") {
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth",
                });
              } else {
                history.push("/notifications");
              }
            }}
          >
            <MenuItem color={theme.color} style={{ marginTop: 0 }}>
              <div style={{ position: "relative" }}>
                {totalNotificationsUnread > 0 && (
                  <NotificationsCountBox
                    defaultBg={theme.defaultBg}
                    style={{ top: "5px", left: "5px" }}
                  >
                    {totalNotificationsUnread > 99
                      ? "99+"
                      : totalNotificationsUnread}
                  </NotificationsCountBox>
                )}
                <NotifyIcon color={theme.color} />
              </div>
            </MenuItem>
          </div>
          <NavbarUserBalance>
            <div
              to="/profile-wallet"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                height: "22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "black",
                  minWidth: "102px",
                  minHeight: "22px",
                }}
              >
                {showBalance
                  ? customFormat(userInfo.balance, 7)
                  : Array.from({ length: 8 }, (_, index) => (
                    <AsteriskIcon
                      key={index}
                      color={"black"}
                      width={8}
                      height={8}
                    />
                  ))}
                &nbsp;BNB
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? (
                  <EyeOffIcon color={"black"} width={16} height={16} />
                ) : (
                  <EyeOnIcon color={"black"} width={16} />
                )}
              </div>
              {/* <UserImage
                style={{ width: "20px", height: "20px", margin: "5px" }}
                src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
              /> */}
            </div>
          </NavbarUserBalance>
        </div>
      </NavbarContainer>
      {isModalOpen && <Overlay bg={theme.tweetHov} onClick={toggleModalOpen} />}
      <SidebarMobile
        bg={theme.bg}
        style={{
          transform: `${
            isModalOpen ? "translate(0,0)" : "translate(-400px, 0)"
          }`,
          transitionDuration: "0.5s",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            position: "sticky",
            marginTop: "20px",
          }}
          onClick={toggleModalOpen}
        >
          <CloseIcon color={theme.color} />
        </div>
        <div
          style={{
            marginTop: "10px",
            backgroundColor: `${theme.tweetHov}`,
            padding: "14px",
            borderRadius: "10px",
            color: `${theme.color}`,
            height: "75%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflowY: "auto",
          }}
        >
          <div>
            <div
              style={{
                borderBottom: `1.5px solid ${theme.border}`,
                padding: "10px",
              }}
            >
              <div style={{ color: `${theme.color}`, fontSize: "20px" }}>
                {userInfo.fullname}
              </div>
              <div style={{ color: "#999", fontSize: "14px" }}>
                @{userInfo.twitterScreenName}
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              {Object.keys(paths).map((item) => {
                return item === "more" ? (
                  <div
                    key={item}
                    style={{ position: "relative" }}
                    ref={refMore}
                  >
                    <ModalMore
                      style={{ color: theme.color }}
                      display={toggleMore ? "flex" : "none"}
                      bg={theme.bg}
                      boxShadow={theme.boxShadow}
                    >
                      <MoreItem tweetHov={theme.tweetHov}>
                        <div
                          className="link"
                          onClick={() => setIsModalOpenLanguage(true)}
                          style={{ color: theme.color, cursor: "pointer" }}
                        >
                          {i18next.t("language")}
                        </div>
                      </MoreItem>
                      <MoreItem tweetHov={theme.tweetHov}>
                        <NavLink
                          className="link"
                          to="/terms-of-services"
                          style={{ color: theme.color }}
                        >
                          {i18next.t("termsOfService")}
                        </NavLink>
                      </MoreItem>
                      <MoreItem tweetHov={theme.tweetHov}>
                        <NavLink
                          className="link"
                          to="/privacy-and-safety"
                          style={{ color: theme.color }}
                        >
                          {i18next.t("privacyPolicy")}
                        </NavLink>
                      </MoreItem>
                      <MoreItem tweetHov={theme.tweetHov}>
                        <NavLink
                          className="link"
                          to="/feedback"
                          style={{ color: theme.color }}
                        >
                          {i18next.t("feedback")}
                        </NavLink>
                      </MoreItem>
                    </ModalMore>
                    <MenuItem
                      onClick={() => setToggleMore(!toggleMore)}
                      style={{ cursor: "pointer" }}
                      className="active"
                      color={theme.color}
                    >
                      <div>
                        {paths[item]}
                        <MenuTitle>{i18next.t(`menuBar.${item}`)}</MenuTitle>
                      </div>
                    </MenuItem>
                  </div>
                ) : (
                  <NavLink
                    to={
                      item === "profile"
                        ? `/${item}/${userInfo.id}`
                        : item === "deposit/withdraw"
                        ? "/deposit-withdraw"
                        : `/${item}`
                    }
                    activeClassName="selected"
                    key={item}
                  >
                    <MenuItem className="active" color={theme.color}>
                      <div>
                        {["votes", "my-portfolio", "invest"].includes(item) ? (
                          paths[item]
                        ) : (
                          <Icon
                            d={paths[item]}
                            width="26.25px"
                            height="26.25px"
                            fill={theme.color}
                          />
                        )}
                        <MenuTitle>
                          {item === "my-portfolio"
                            ? i18next.t("menuBar.myPortfolio")
                            : item == "profile-wallet"
                              ? i18next.t("menuBar.profileWallet")
                              : i18next.t(`menuBar.${item}`)}
                        </MenuTitle>
                      </div>
                    </MenuItem>
                  </NavLink>
                );
              })}
              <MenuItem
                color={theme.color}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  dispatch({
                    type: SET_THEME,
                    payload: mode === "dark" ? "default" : "dark",
                  })
                }
              >
                <div>
                  <Icon
                    d={dark}
                    width="26.25px"
                    height="26.25px"
                    fill={theme.color}
                  />
                  <MenuTitle>
                    {mode === "dark" ? i18next.t("menuBar.lightMode") : i18next.t("menuBar.darkMode")}
                  </MenuTitle>
                </div>
              </MenuItem>
              {getPWADisplayMode() === "browser" && (
                <MenuItem
                  style={{
                    display: "flex",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                  id="install-box"
                  onClick={checkFlatform}
                >
                  <DownloadIcon color={theme.color} />
                  <MenuTitle style={{ color: theme.color }}>
                    {i18next.t("installApp")}
                  </MenuTitle>
                </MenuItem>
              )}
            </div>
          </div>
          <div
            onClick={handleLogout}
            style={{
              padding: "30px 10px 10px 7px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <LogoutIcon color={theme.color} width={30} />
            <MenuTitle>{i18next.t("logout")}</MenuTitle>
          </div>
        </div>
      </SidebarMobile>
      {isGuideModalOpen && (
        <ModalCenter
          children={
            <div style={{ color: theme.color }}>
              <div style={{ marginBottom: "3px" }}>
                {i18next.t("install")} <b>{i18next.t("weknot")}</b> {i18next.t("onYourIPhone")}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {i18next.t("click")}&nbsp; <UploadIcon /> &nbsp;{i18next.t("andThenClick")}&nbsp;
                <div>
                  "<b>{i18next.t("addToHomeScreen")}</b>"
                </div>
              </div>
            </div>
          }
          handleClose={() => setIsGuideModalOpen(!isGuideModalOpen)}
          padding="15px"
          heading={i18next.t("installWeknot")}
        />
      )}
    </>
  );
};

export default Navbar;

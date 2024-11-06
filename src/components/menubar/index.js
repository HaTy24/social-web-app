import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useHistory } from "react-router-dom";

import { getStaticURL } from "../../constants";
import { LOGOUT_USER, SET_LANGUAGE, SET_THEME } from "../../redux/actions";
import { authService } from "../../services/AuthService";
import { ClickOutside } from "../../utils/triggerClickOutside";
import Icon from "../icon";
import { LogoutIcon } from "../icons/LogoutIcon";
import { OptionIcon } from "../icons/OptionIcon";
import Modal from "../modal";
import {
  LogoutItem,
  LogoutPopup,
  MoreItem,
  ProfileBox,
} from "../styles/common";
import {
  Button,
  Header,
  HeaderWrapper,
  MenuItem,
  MenuTitle,
  MenuWrapper,
  ModalMore,
  NotificationsCountBox,
  ProfileTextTweeterName,
  ProfileTextUserName,
} from "../styles/menubar";
import { UserImage } from "../styles/profile";
import TweetModal from "./tweetModal";
import i18next from "i18next";
import { SelectItem } from "../styles/game";
import { CheckIcon } from "../icons/CheckIcon";

const MenuBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenLanguage, setIsModalOpenLanguage] = useState(false);
  const [isModalLogoutOpen, setIsModalLogoutOpen] = useState(false);
  const [toggleMore, setToggleMore] = useState(false);
  const [heightProfileBox, setHeightProfileBox] = useState(120);
  const user = useSelector((state) => state.profile.user);
  const theme = useSelector((state) => state.theme);
  const totalMessagesUnread = useSelector(
    (state) => state.chat.totalMessagesUnread
  );
  const language = useSelector((state) => state.language);
  const mode = theme.mode;
  const ref = useRef(null);
  const refHeightProfileBox = useRef(null);
  ClickOutside(ref, () => {
    setIsModalLogoutOpen(false);
  });
  const refMore = useRef();

  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    dispatch({ type: LOGOUT_USER });
    authService.logout();
    history.push("/");
  };

  const paths = {
    home: [
      <svg
        width="22"
        height="23"
        viewBox="0 0 22 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.625 20.7499V15.4999C13.625 15.2679 13.5328 15.0453 13.3687 14.8812C13.2046 14.7171 12.9821 14.6249 12.75 14.6249H9.25C9.0179 14.6249 8.7954 14.7171 8.6313 14.8812C8.4672 15.0453 8.375 15.2679 8.375 15.4999V20.7499C8.375 20.982 8.2828 21.2045 8.1187 21.3686C7.9546 21.5327 7.7321 21.6249 7.5 21.6249H2.25C2.01794 21.6249 1.79538 21.5327 1.63128 21.3686C1.46719 21.2045 1.375 20.982 1.375 20.7499V10.6371C1.37501 10.5152 1.40051 10.3946 1.44986 10.2831C1.49921 10.1716 1.57132 10.0716 1.66156 9.9896L10.4116 1.72742C10.5727 1.58078 10.7827 1.49951 11.0005 1.49951C11.2184 1.49951 11.4284 1.58078 11.5895 1.72742L20.3395 9.9896C20.4298 10.0716 20.5019 10.1716 20.5512 10.2831C20.6006 10.3946 20.6261 10.5152 20.6261 10.6371V20.7499C20.6261 20.982 20.5339 21.2045 20.3698 21.3686C20.2057 21.5327 19.9832 21.6249 19.7511 21.6249H14.5C14.2679 21.6249 14.0454 21.5327 13.8813 21.3686C13.7172 21.2045 13.625 20.982 13.625 20.7499Z"
          stroke={theme.color || "#F1F5F9"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>,
    ],
    explore: [
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.25 19C15.0825 19 19 15.0825 19 10.25C19 5.41751 15.0825 1.5 10.25 1.5C5.41751 1.5 1.5 5.41751 1.5 10.25C1.5 15.0825 5.41751 19 10.25 19Z"
          stroke={theme.color || "#F1F5F9"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.4375 16.4373L22.5002 22.4999"
          stroke={theme.color || "#F1F5F9"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>,
    ],
    messages: [
      "M19.25 3.018H4.75C3.233 3.018 2 4.252 2 5.77v12.495c0 1.518 1.233 2.753 2.75 2.753h14.5c1.517 0 2.75-1.235 2.75-2.753V5.77c0-1.518-1.233-2.752-2.75-2.752zm-14.5 1.5h14.5c.69 0 1.25.56 1.25 1.25v.714l-8.05 5.367c-.273.18-.626.182-.9-.002L3.5 6.482v-.714c0-.69.56-1.25 1.25-1.25zm14.5 14.998H4.75c-.69 0-1.25-.56-1.25-1.25V8.24l7.24 4.83c.383.256.822.384 1.26.384.44 0 .877-.128 1.26-.383l7.24-4.83v10.022c0 .69-.56 1.25-1.25 1.25z",
    ],
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
    games: [
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3.65"
          y="3.65"
          width="20.7"
          height="20.7"
          rx="1.35"
          stroke={theme.color || "#F1F5F9"}
          strokeWidth="1.3"
        />
        <path
          d="M14 16C15.1046 16 16 15.1046 16 14C16 12.8954 15.1046 12 14 12C12.8954 12 12 12.8954 12 14C12 15.1046 12.8954 16 14 16Z"
          fill={theme.color || "#F1F5F9"}
        />
        <path
          d="M19 11C20.1046 11 21 10.1046 21 9C21 7.89539 20.1046 7 19 7C17.8954 7 17 7.89539 17 9C17 10.1046 17.8954 11 19 11Z"
          fill={theme.color || "#F1F5F9"}
        />
        <path
          d="M9 21C10.1046 21 11 20.1046 11 19C11 17.8954 10.1046 17 9 17C7.89539 17 7 17.8954 7 19C7 20.1046 7.89539 21 9 21Z"
          fill={theme.color || "#F1F5F9"}
        />
      </svg>,
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
    profileWallet: [
      "M22.9286 7.59184H4.96939C4.6717 7.59184 4.3862 7.47358 4.1757 7.26308C3.9652 7.05258 3.84694 6.76708 3.84694 6.46939C3.84694 6.1717 3.9652 5.8862 4.1757 5.6757C4.3862 5.4652 4.6717 5.34694 4.96939 5.34694H20.2347C20.4133 5.34694 20.5846 5.27598 20.7109 5.14968C20.8372 5.02338 20.9082 4.85208 20.9082 4.67347C20.9082 4.49485 20.8372 4.32355 20.7109 4.19725C20.5846 4.07095 20.4133 4 20.2347 4H4.96939C4.31447 4 3.68637 4.26017 3.22327 4.72327C2.76017 5.18637 2.5 5.81447 2.5 6.46939V20.8367C2.5 21.4917 2.76017 22.1198 3.22327 22.5829C3.68637 23.046 4.31447 23.3061 4.96939 23.3061H22.9286C23.3453 23.3061 23.745 23.1406 24.0397 22.8459C24.3344 22.5512 24.5 22.1515 24.5 21.7347V9.16327C24.5 8.7465 24.3344 8.3468 24.0397 8.0521C23.745 7.7574 23.3453 7.59184 22.9286 7.59184ZM23.1531 21.7347C23.1531 21.7942 23.1294 21.8513 23.0873 21.8934C23.0452 21.9355 22.9881 21.9592 22.9286 21.9592H4.96939C4.6717 21.9592 4.3862 21.8409 4.1757 21.6304C3.9652 21.4199 3.84694 21.1344 3.84694 20.8367V8.66826C4.19421 8.84651 4.57904 8.93926 4.96939 8.93878H22.9286C22.9881 8.93878 23.0452 8.96243 23.0873 9.00453C23.1294 9.04663 23.1531 9.10373 23.1531 9.16327V21.7347ZM20.0102 15C20.0102 15.222 19.9444 15.439 19.821 15.6236C19.6977 15.8082 19.5224 15.9521 19.3173 16.037C19.1122 16.122 18.8865 16.1442 18.6688 16.1009C18.451 16.0576 18.251 15.9507 18.0941 15.7937C17.9371 15.6367 17.8302 15.4367 17.7869 15.219C17.7436 15.0012 17.7658 14.7756 17.8507 14.5705C17.9357 14.3654 18.0796 14.1901 18.2642 14.0667C18.4487 13.9434 18.6658 13.8776 18.8878 13.8776C19.1854 13.8776 19.4709 13.9958 19.6814 14.2063C19.8919 14.4168 20.0102 14.7023 20.0102 15Z",
    ],
    myPortfolio: [
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
    referral: [
      "M20,18a1,1,0,0,0,1-1V13a1,1,0,0,0-1-1H13V9.858a4,4,0,1,0-2,0V12H4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V14h6v3a1,1,0,0,0,2,0V14h6v3A1,1,0,0,0,20,18ZM12,8a2,2,0,1,1,2-2A2,2,0,0,1,12,8ZM23,21a1,1,0,0,1-1,1H18a1,1,0,0,1,0-2h4A1,1,0,0,1,23,21ZM1,21a1,1,0,0,1,1-1H6a1,1,0,0,1,0,2H2A1,1,0,0,1,1,21Zm13-1a1,1,0,0,1,0,2H10a1,1,0,0,1,0-2Z",
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

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const toggleModalOpen = () => {
    setIsModalLogoutOpen(!isModalLogoutOpen);
  };
  useEffect(() => {
    if (refHeightProfileBox.current) {
      setHeightProfileBox(refHeightProfileBox.current.clientHeight);
    }
  }, []);

  ClickOutside(refMore, () => {
    setToggleMore(false);
  });
  const toggleOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const renderIcon = (item, index) => {
    switch (item) {
      case "home":
        return (
          <NavLink
            to={item === "profile" ? `/${item}/${user.id}` : `/${item}`}
            activeClassName="selected"
            key={index}
          >
            <MenuItem className="active" color={theme.color}>
              <div>
                {paths[item]}
                {!window.matchMedia("(max-width: 768px)").matches && (
                  <MenuTitle>{i18next.t(`menuBar.${item}`)}</MenuTitle>
                )}
              </div>
            </MenuItem>
          </NavLink>
        );
      case "games":
        return (
          <NavLink
            to={item === "profile" ? `/${item}/${user.id}` : `/${item}`}
            activeClassName="selected"
            key={index}
          >
            <MenuItem className="active" color={theme.color}>
              <div>
                {paths[item]}
                {!window.matchMedia("(max-width: 768px)").matches && (
                  <MenuTitle>{i18next.t(`menuBar.${item}`)}</MenuTitle>
                )}
              </div>
            </MenuItem>
          </NavLink>
        );
      case "explore":
        return (
          <NavLink
            to={item === "profile" ? `/${item}/${user.id}` : `/${item}`}
            activeClassName="selected"
            key={index}
          >
            <MenuItem className="active" color={theme.color}>
              <div>
                {paths[item]}
                {!window.matchMedia("(max-width: 768px)").matches && (
                  <MenuTitle>{i18next.t(`menuBar.${item}`)}</MenuTitle>
                )}
              </div>
            </MenuItem>
          </NavLink>
        );
      case "votes":
        return (
          <NavLink
            to={item === "profile" ? `/${item}/${user.id}` : `/${item}`}
            activeClassName="selected"
            key={index}
          >
            <MenuItem className="active" color={theme.color}>
              <div>
                {paths[item]}
                {!window.matchMedia("(max-width: 768px)").matches && (
                  <MenuTitle>{i18next.t(`menuBar.${item}`)}</MenuTitle>
                )}
              </div>
            </MenuItem>
          </NavLink>
        );
      case "more":
        return (
          <div key={index} style={{ position: "relative" }} ref={refMore}>
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
                  style={{ color: theme.color, cursor: "pointer", width: "100%" }}
                >
                  {i18next.t("language")}
                </div>
              </MoreItem>
              <MoreItem tweetHov={theme.tweetHov}>
                <NavLink
                  className="link"
                  to="/terms-of-services"
                  style={{ color: theme.color, width: "100%" }}
                >
                  {i18next.t("termsOfService")}
                </NavLink>
              </MoreItem>
              <MoreItem tweetHov={theme.tweetHov}>
                <NavLink
                  className="link"
                  to="/privacy-and-safety"
                  style={{ color: theme.color, width: "100%" }}
                >
                  {i18next.t("privacyPolicy")}
                </NavLink>
              </MoreItem>
              <MoreItem tweetHov={theme.tweetHov}>
                <NavLink
                  className="link"
                  to="/feedback"
                  style={{ color: theme.color, width: "100%" }}
                  target="_blank"
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
                {!window.matchMedia("(max-width: 768px)").matches && (
                  <MenuTitle>{i18next.t(`menuBar.${item}`)}</MenuTitle>
                )}
              </div>
            </MenuItem>
          </div>
        );
      case "myPortfolio":
        return (
          <NavLink
            to={item === "profile" ? `/${item}/${user.id}` : `/my-portfolio`}
            activeClassName="selected"
            key={index}
          >
            <MenuItem className="active" color={theme.color}>
              <div>
                {paths[item]}
                {!window.matchMedia("(max-width: 768px)").matches && (
                  <MenuTitle>{i18next.t(`menuBar.${item}`)}</MenuTitle>
                )}
              </div>
            </MenuItem>
          </NavLink>
        );
      case "profileWallet":
        return (
          <NavLink
            to={item === "profile" ? `/${item}/${user.id}` : `/profile-wallet`}
            activeClassName="selected"
            key={index}
          >
            <MenuItem className="active" color={theme.color}>
              <div>
                <Icon
                  d={paths[item]}
                  width="26.25px"
                  height="26.25px"
                  fill={theme.color}
                />
                {!window.matchMedia("(max-width: 768px)").matches && (
                  <MenuTitle>{i18next.t(`menuBar.${item}`)}</MenuTitle>
                )}
              </div>
            </MenuItem>
          </NavLink>
        );
      case "invest":
        return (
          <NavLink
            to={item === "profile" ? `/${item}/${user.id}` : `/${item}`}
            activeClassName="selected"
            key={index}
          >
            <MenuItem className="active" color={theme.color}>
              <div>
                {paths[item]}
                {!window.matchMedia("(max-width: 768px)").matches && (
                  <MenuTitle>{i18next.t(`menuBar.${item}`)}</MenuTitle>
                )}
              </div>
            </MenuItem>
          </NavLink>
        );
      case "messages":
        return (
          <NavLink
            to={item === "profile" ? `/${item}/${user.id}` : `/${item}`}
            activeClassName="selected"
            key={index}
          >
            <MenuItem className="active" color={theme.color}>
              {totalMessagesUnread > 0 && (
                <NotificationsCountBox
                  defaultBg={theme.defaultBg}
                  style={{ top: "3px", left: "3px" }}
                >
                  {totalMessagesUnread > 99 ? "99+" : totalMessagesUnread}
                </NotificationsCountBox>
              )}
              <div>
                <Icon
                  d={paths[item]}
                  width="26.25px"
                  height="26.25px"
                  fill={theme.color}
                />
                {!window.matchMedia("(max-width: 768px)").matches && (
                  <MenuTitle>{i18next.t(`menuBar.${item}`)}</MenuTitle>
                )}
              </div>
            </MenuItem>
          </NavLink>
        );
      default:
        return (
          <NavLink
            to={
              item === "profile"
                ? `/${item}/${user.id}`
                : item === "deposit/withdraw"
                  ? "/deposit-withdraw"
                  : `/${item}`
            }
            activeClassName="selected"
            key={index}
          >
            <MenuItem className="active" color={theme.color}>
              <div>
                <Icon
                  d={paths[item]}
                  width="26.25px"
                  height="26.25px"
                  fill={theme.color}
                />
                {!window.matchMedia("(max-width: 768px)").matches && (
                  <MenuTitle>{i18next.t(`menuBar.${item}`)}</MenuTitle>
                )}
              </div>
            </MenuItem>
          </NavLink>
        );
    }
  };
  return (
    <React.Fragment>
      {isModalOpen && (
        <Modal
          children={<TweetModal handleClose={handleClose} />}
          handleClose={handleClose}
          toggleOpen={toggleOpen}
          padding="15px"
          top="10%"
        />
      )}

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
      {window.matchMedia("(min-width: 424px)").matches && (
        <Header>
          <HeaderWrapper>
            <MenuWrapper
              style={{
                height: `calc(100% -  ${heightProfileBox || 120}px)`,
              }}
            >
              <Link to="/home">
                <MenuItem logo>
                  <img
                    src={
                      theme.mode === "dark"
                        ? `${getStaticURL()}/assets/images/weknot_logo_c.svg`
                        : `${getStaticURL()}/assets/images/weknot_logo.svg`
                    }
                    alt="Weknot"
                    width={120}
                    height={120}
                  />
                </MenuItem>
              </Link>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: `${window.matchMedia("(max-width: 768px)").matches
                      ? "center"
                      : "left"
                    }`,
                }}
              >
                {Object.keys(paths).map((item, index) =>
                  renderIcon(item, index)
                )}
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
                    {!window.matchMedia("(max-width: 768px)").matches && (
                      <MenuTitle>
                        {mode === "dark"
                          ? i18next.t("menuBar.lightMode")
                          : i18next.t("menuBar.darkMode")}
                      </MenuTitle>
                    )}
                  </div>
                </MenuItem>
                <div style={{ marginBottom: "10px" }}></div>

                <div style={{ marginBottom: "10px" }}></div>
              </div>
            </MenuWrapper>
            {/*  */}
            <div
              ref={refHeightProfileBox}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                padding: "0 10px",
              }}
            >
              {window.matchMedia("(max-width: 768px)").matches ? (
                <Button
                  width="40px"
                  height="40px"
                  padding="0"
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </Button>
              ) : (
                <Button
                  width="100%"
                  padding="12px 30px"
                  onClick={() => setIsModalOpen(true)}
                >
                  {i18next.t("post")}
                </Button>
              )}
              {window.matchMedia("(max-width: 768px)").matches ? (
                <div onClick={handleLogout}>
                  <LogoutIcon color={theme.color} width={30} />
                </div>
              ) : (
                <ProfileBox
                  style={{ marginBottom: 0, width: "100%" }}
                  tweetHov={theme.tweetHov}
                  ref={ref}
                  onClick={toggleModalOpen}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <UserImage src={user?.profile_image_url} />
                    <div>
                      <ProfileTextUserName
                        style={{
                          color: `${theme.color}`,
                        }}
                      >
                        {user.fullname}
                      </ProfileTextUserName>
                      <ProfileTextTweeterName
                        style={{ color: `${theme.color}` }}
                      >
                        @{user.twitterScreenName}
                      </ProfileTextTweeterName>
                    </div>
                  </div>
                  <div>
                    <OptionIcon color={theme.color} />
                  </div>
                  {isModalLogoutOpen && (
                    <LogoutPopup
                      bg={theme.bg}
                      color={theme.color}
                      boxShadow={theme.boxShadow}
                    >
                      <Link to={`/profile/${user.id}`}>
                        <LogoutItem tweetHov={theme.tweetHov}>
                          <UserImage src={user?.profile_image_url} />
                          <div>
                            <ProfileTextUserName
                              style={{
                                color: `${theme.color}`,
                              }}
                            >
                              {user.fullname}
                            </ProfileTextUserName>
                            <ProfileTextTweeterName
                              style={{ color: `${theme.color}` }}
                            >
                              @{user.twitterScreenName}
                            </ProfileTextTweeterName>
                          </div>
                        </LogoutItem>
                      </Link>
                      <LogoutItem
                        tweetHov={theme.tweetHov}
                        onClick={handleLogout}
                      >
                        <div style={{ display: "flex", width: "max-content" }}>
                          <LogoutIcon color={theme.color} />
                          <div style={{ fontSize: "16px" }}>
                            {i18next.t("menuBar.logout")}
                          </div>
                        </div>
                        <ProfileTextTweeterName>
                          @{user.twitterScreenName}
                        </ProfileTextTweeterName>
                      </LogoutItem>
                    </LogoutPopup>
                  )}
                </ProfileBox>
              )}
            </div>
          </HeaderWrapper>
        </Header>
      )}
    </React.Fragment>
  );
};

export default MenuBar;

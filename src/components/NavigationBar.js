import { Col, Row } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { GameIcon } from "./icons/GameIcon.js";
import { HomeIcon } from "./icons/HomeIcon.js";
import { MailIcon } from "./icons/MailIcon.js";
import { NotifyIcon } from "./icons/NotifyIcon.js";
import { SearchIcon } from "./icons/SearchIcon.js";
import { NavigationBarContainer } from "./styles/common.js";
import { NotificationsCountBox } from "./styles/menubar.js";

const NavigationBar = () => {
  const [direction, setDirection] = useState("up");
  const theme = useSelector((state) => state.theme);
  const { pathname } = useLocation();
  const totalMessagesUnread = useSelector(
    (state) => state.chat.totalMessagesUnread
  );

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

  return (
    <NavigationBarContainer
      bg={theme.bg}
      style={{
        // transform: `${
        //   direction == "up" ? "translate(0,0)" : "translate(0px, 80px)"
        // }`,
        // transitionDuration: "0.5s",
        padding: "20px 20px 30px 20px",
      }}
      borderColor="#2f3336"
    >
      <Row justify="space-between">
        <Col>
          <Link to="/home">
            <HomeIcon color={theme.color} active={pathname === "/home"} />
          </Link>
        </Col>
        <Col>
          <Link to="/explore">
            <SearchIcon color={theme.color} active={pathname === "/explore"} />
          </Link>
        </Col>
        <Col style={{ position: "relative" }}>
          <Link to="/messages">
            {totalMessagesUnread > 0 && (
              <NotificationsCountBox
                defaultBg={theme.defaultBg}
                style={{ top: "-5px", left: "-10px" }}
              >
                {totalMessagesUnread > 99 ? "99+" : totalMessagesUnread}
              </NotificationsCountBox>
            )}
            <MailIcon color={theme.color} active={pathname === "/messages"} />
          </Link>
        </Col>
        <Col>
          <Link to="/games">
            <GameIcon
              color={theme.color}
              activeColor={theme.bg}
              active={pathname === "/games"}
            />
          </Link>
        </Col>
      </Row>
    </NavigationBarContainer>
  );
};

export default NavigationBar;

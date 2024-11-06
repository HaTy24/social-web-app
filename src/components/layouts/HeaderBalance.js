import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";

import { getStaticURL } from "../../constants";
import { customFormat } from "../../utils/Number";
import Icon from "../icon";
import { NotifyIcon } from "../icons/NotifyIcon";
import { EyeOnIcon } from "../icons/EyeOnIcon";
import { EyeOffIcon } from "../icons/EyeOffIcon";
import { AsteriskIcon } from "../icons/AsteriskIcon";
import { Header as Navbar, NavbarUserBalance } from "../styles/common";
import { MenuItem, NotificationsCountBox } from "../styles/menubar";
import { BackBtn, UserImage } from "../styles/profile";

const HeaderBalance = (props) => {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);
  const history = useHistory();
  const location = useLocation();
  const totalNotificationsUnread = useSelector(
    (state) => state.notification.totalNotificationsUnread
  );
	const [showBalance, setShowBalance] = useState(false);
  const { title, backButton } = props;
  const backIconPaths = [
    "M20 11H7.414l4.293-4.293c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0l-6 6c-.39.39-.39 1.023 0 1.414l6 6c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L7.414 13H20c.553 0 1-.447 1-1s-.447-1-1-1z",
  ];

  return (
    <Navbar border={theme.border} bg={theme.bg} color={theme.color}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          {backButton && (
            <BackBtn onClick={history.goBack}>
              <Icon
                d={backIconPaths}
                width="22.5px"
                height="22.5px"
                fill="rgb(29, 161, 242)"
              />
            </BackBtn>
          )}
          <h2>{title}</h2>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            to="/notifications"
            style={{ cursor: "pointer" }}
            // onClick={() => {
            //   if (location.pathname === "/notifications") {
            //     window.scrollTo({
            //       top: 0,
            //       left: 0,
            //       behavior: "smooth",
            //     });
            //   } else {
            //     history.push("/notifications");
            //   }
            // }}
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
          </Link>
          <NavbarUserBalance >
            <div
              to="/profile-wallet"
              style={{ display: "flex", alignItems: "center", gap: "8px", height: "22px" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "black", minWidth: "102px", minHeight: "22px" }}>
                {showBalance
									? customFormat(user.balance, 7)
									: Array.from({length: 8}, (_, index) => (
										<AsteriskIcon key={index} color={"black"} width={8} height={8}/>
									))
								}
                &nbsp;BNB
              </div>
							<div
								style={{display: "flex", alignItems: "center", cursor: "pointer"}}
								onClick={() => setShowBalance(!showBalance)}
							>
								{showBalance ?  <EyeOffIcon color={"black"} width={16} height={16} /> : <EyeOnIcon color={"black"} width={16}/>}
							</div>
              {/* <UserImage
                style={{ width: "20px", height: "20px", margin: "5px" }}
                src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
              /> */}
            </div>
          </NavbarUserBalance>
        </div>
      </div>
    </Navbar>
  );
};

export default HeaderBalance;

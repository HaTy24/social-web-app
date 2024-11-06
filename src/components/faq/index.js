import React, { useState, useEffect } from "react";
import { ArrowBottom } from "../icons/ArrowBottom";
import { Body } from "../styles/faq";
import { Header } from "../styles/common";
import { NavbarUserBalance } from "../styles/common";
import { Link } from "react-router-dom";
import { UserImage } from "../styles/profile";
import { useSelector } from "react-redux";
import { customFormat } from "../../utils/Number";
import { getStaticURL } from "../../constants";
const FAQ = () => {
  const theme = useSelector((state) => state.theme);
  const [userInfo, setUserInfo] = useState({});
  const [showSubContent, setShowSubContent] = useState({ [0]: false });
  const getUserInfo = async () => {
    try {
      const response = await authService.getUserInfo(user.id);
      if (response.success) {
        setUserInfo(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      <Header border={theme.border} bg={theme.bg} color={theme.color}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>FAQ</h2>
          <NavbarUserBalance style={{ paddingRight: "0px" }}>
            <Link
              to="/profile-wallet"
              style={{ display: "flex", alignItems: "center" }}
            >
              <span style={{ fontWeight: "bold", color: "black" }}>
                {customFormat(userInfo.balance, 7)}
                &nbsp;BNB
              </span>
              <UserImage
                style={{ width: "20px", height: "20px", margin: "5px" }}
                src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
              />
            </Link>
          </NavbarUserBalance>
        </div>
      </Header>
      <div style={{ padding: "0 16px" }}>
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <Body border={showSubContent[index] ? "transparent" : "#393939"}>
              <p
                style={{
                  color: `${showSubContent[index] ? "#F1F5F9" : "#94A3B8"}`,
                  fontSize: "16px",
                  fontWeight: "700px",
                  marginBottom: 0,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                finibus id quam eget pulvinar.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  rotate: `${showSubContent[index] ? "180deg" : "0deg"}`,
                }}
                onClick={() =>
                  setShowSubContent((prev) => ({ [index]: !prev[index] }))
                }
              >
                <ArrowBottom />
              </div>
            </Body>
            <p
              style={{
                color: "#F1F5F9",
                fontSize: "16px",
                fontWeight: "700px",
                display: `${showSubContent[index] ? "block" : "none"}`,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              finibus id quam eget pulvinar. Integer egestas, leo sed egestas
              feugiat, metus quam vulputate metus, id ornare felis nulla vel
              libero.
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default FAQ;

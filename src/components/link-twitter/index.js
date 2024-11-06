import React from "react";
import { Col, Row } from "antd";
import Icon from "../icon";
import { BackgroundContent } from "../styles/signin";
import { logo } from "./paths";
// import { Row, Col } from "../styles/common";
import { getStaticURL } from "../../constants";
import { TwitterOauthButton } from "../auth-buttons/TwitterLoginButton";

const URL = process.env.REACT_APP_SERVER_URL;

const LinkTwitter = (props) => {
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
          <Col span={24} style={{ padding: "15px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Icon
                d={logo}
                width="150px"
                height="150px"
                fill="rgb(29,161,242)"
              />
              <h1
                style={{
                  fontSize: "3rem",
                  marginTop: "4rem",
                  fontWeight: "bold",
                  color: "white",
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
                Please link with Twitter.
              </h2>
              <div
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <TwitterOauthButton />
              </div>
              <div
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
              </div>
            </div>
          </Col>
        </Row>
      </BackgroundContent>
    </React.Fragment>
  );
};

export default LinkTwitter;

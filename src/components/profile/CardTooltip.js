import { Button, Tooltip } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getStaticURL, ACCOUNT_TYPE } from "../../constants";
import { CardTooltipContainer, CoverImage } from "../styles/profile";
import { YellowTick } from "../icons/YellowTick";
import i18next from "i18next";

const CardTooltip = (props) => {
  const { children, item, id } = props;
  const user = useSelector((state) => state.profile.user);
  const theme = useSelector((state) => state.theme);
  const mode = theme.mode;
  return (
    <Tooltip
      showArrow={false}
      color="none"
      placement="bottom"
      overlayInnerStyle={{
        backgroundColor: "none",
        border: "none",
        boxShadow: "none",
        translate: "0 -2rem",
      }}
      zIndex={102}
      title={
        <CardTooltipContainer>
          <div
            className="container"
            style={{
              background: theme.bg,
              boxShadow:
                mode === "dark"
                  ? "0 0 15px #ffffff33, 0 0 3px 1px #ffffff26"
                  : "0 0 15px #65778633, 0 0 3px 1px #65778626",
              overflow: "hidden",
            }}
          >
            <figure>
              <CoverImage src={item.coverImage} />
            </figure>
            <div className="flex-container">
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  position: "relative",
                  marginBottom: "1rem",
                }}
              >
                <div className="avatar-item">
                  <img className="user-avatar" src={item.user.imageUrl} />
                </div>
                <div
                  style={{ marginTop: "10px", display: "flex", gap: "15px" }}
                >
                  <Link to={`/buy-sell/${id}`}>
                    <Button
                      type="primary"
                      size="large"
                      style={{
                        borderRadius: "6px",
                        backgroundColor: theme.color,
                        border: "none",
                      }}
                    >
                      <p style={{ color: theme.bg, fontWeight: "bold" }}>
                        {i18next.t("profile.trade")}
                      </p>
                    </Button>
                  </Link>
                </div>
              </div>
              <Link to={`/profile/${id}`}>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <p
                      className="user-name"
                      style={{ color: theme.color, marginBottom: "0px" }}
                    >
                      {item.user.fullname}
                    </p>
                    {item.user.accountType === ACCOUNT_TYPE.INVESTMENT && (
                      <YellowTick />
                    )}
                  </div>
                  {item.user.username && (
                    <p
                      style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        color: "#8E9CB0",
                      }}
                    >
                      @{item.user.username}
                    </p>
                  )}
                </div>
              </Link>
              {/* <p style={{ color: theme.color, fontSize: "1.075rem" }}>
                {item.description}
              </p> */}
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  fontSize: "1.075rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <p
                    style={{
                      color: theme.color,
                      marginBottom: "0px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.following}
                  </p>
                  <p style={{ color: "#8E9CB0", marginBottom: "0px" }}>
                    Following
                  </p>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <p
                    style={{
                      color: theme.color,
                      marginBottom: "0px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.followers}
                  </p>
                  <p style={{ color: "#8E9CB0", marginBottom: "0px" }}>
                    Followers
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </CardTooltipContainer>
      }
      overlayStyle={{
        transition: "opacity 200ms ease",
        backgroundColor: "none",
        border: "none",
      }}
    >
      <span>{children}</span>
    </Tooltip>
  );
};

export default CardTooltip;

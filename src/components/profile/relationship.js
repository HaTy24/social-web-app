import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";

import { getStaticURL } from "../../constants";
import { authService } from "../../services/AuthService";
import { userService } from "../../services/UserService";
import { customFormat } from "../../utils/Number";
import Loading from "../loading";
import { Header, NavbarUserBalance, ProfileCorner } from "../styles/common";
import { BackBtn, User, UserBalance, UserImage } from "../styles/profile";
import { Button, UserFlex } from "../styles/sidebar";
import Tabs from "../tabs";
import Icon from "../icon";
import i18next from "i18next";

const backIconPaths = [
  "M20 11H7.414l4.293-4.293c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0l-6 6c-.39.39-.39 1.023 0 1.414l6 6c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L7.414 13H20c.553 0 1-.447 1-1s-.447-1-1-1z",
];

function Relationship() {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);
  const [isLoading, setIsLoading] = useState(false);
  const query = new URLSearchParams(useLocation().search).get("tabs");
  const { id } = useParams();
  const [relationships, setRelationships] = useState();
  const history = useHistory();

  const getRelationships = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getRelationships(id);
      if (response.success) {
        setRelationships(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getRelationships();
  }, [user]);

  const tabList = [
    {
      name: "holders",
      title: `${i18next.t("profile.holder")}`,
      path: `/relationship/${id}?tabs=holders`,
    },
    {
      name: "holdings",
      title: `${i18next.t("profile.holding")}`,
      path: `/relationship/${id}?tabs=holdings`,
    },
  ];

  const handleBuy = async (e, id) => {
    e.preventDefault();
    history.push(`/buy-sell/${id}`);
  };

  const renderTabVoteContent = () => {
    switch (query) {
      case "holders":
        return (
          <div>
            {relationships?.holderAddreses.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                  color: theme.color,
                }}
              >
                {i18next.t("profile.noData")}
              </div>
            ) : (
              <>
                {relationships?.holderAddreses.map((relationship) => (
                  <Link
                    to={`/profile/${relationship.id}`}
                    key={relationship.id}
                  >
                    <UserFlex
                      color={theme.color}
                      style={{ alignItems: "center" }}
                    >
                      <User>
                        <UserImage src={relationship.imageUrl} />
                        <UserBalance>
                          <span>{customFormat(relationship?.share?.buyPrice ? relationship?.share?.buyPrice : 0, 3)}</span>
                          <img
                            src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
                            alt="discord"
                          />
                        </UserBalance>
                      </User>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <h3>{relationship.fullname}</h3>
                        </div>
                        <p>@{relationship.username}</p>
                      </div>
                      <div style={{ marginLeft: "auto" }}>
                        <Button
                          onClick={(e) => handleBuy(e, relationship.id)}
                          style={{ color: "#000" }}
                        >
                          {i18next.t("profile.trade")}
                        </Button>
                      </div>
                    </UserFlex>
                  </Link>
                ))}
              </>
            )}
          </div>
        );
      case "holdings":
        return (
          <div>
            {relationships?.holdingAddresses.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                  color: theme.color,
                }}
              >
                {i18next.t("profile.noData")}
              </div>
            ) : (
              <>
                {relationships?.holdingAddresses.map((relationship) => (
                  <Link
                    to={`/profile/${relationship.id}`}
                    key={relationship.id}
                  >
                    <UserFlex
                      color={theme.color}
                      style={{ alignItems: "center" }}
                    >
                      <User>
                        <UserImage src={relationship.imageUrl} />
                        <UserBalance>
                          <span>{customFormat(relationship?.share?.buyPrice ? relationship?.share?.buyPrice : 0, 3)}</span>
                          <img
                            src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
                            alt="discord"
                          />
                        </UserBalance>
                      </User>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <h3>{relationship.fullname}</h3>
                        </div>
                        <p>@{relationship.username}</p>
                      </div>
                      <div style={{ marginLeft: "auto" }}>
                        <Button
                          onClick={(e) => handleBuy(e, relationship.id)}
                          style={{ color: "#000" }}
                        >
                          {i18next.t("profile.trade")}
                        </Button>
                      </div>
                    </UserFlex>
                  </Link>
                ))}
              </>
            )}
          </div>
        );
      default:
        return (
          <div>
            {relationships?.holderAddreses.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                  color: theme.color,
                }}
              >
                {i18next.t("profile.noData")}
              </div>
            ) : (
              <>
                {relationships?.holderAddreses.map((relationship) => (
                  <Link
                    to={`/profile/${relationship.id}`}
                    key={relationship.id}
                  >
                    <UserFlex
                      color={theme.color}
                      style={{ alignItems: "center" }}
                    >
                      <User>
                        <UserImage src={relationship.imageUrl} />
                        <UserBalance>
                          <span>{customFormat(relationship.balance, 3)}</span>
                          <img
                            src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
                            alt="discord"
                          />
                        </UserBalance>
                      </User>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <h3>{relationship.fullname}</h3>
                        </div>
                        <p>@{relationship.username}</p>
                      </div>
                      <div style={{ marginLeft: "auto" }}>
                        <Button
                          onClick={(e) => handleBuy(e, relationship.id)}
                          style={{ color: "#000" }}
                        >
                          {i18next.t("profile.trade")}
                        </Button>
                      </div>
                    </UserFlex>
                  </Link>
                ))}
              </>
            )}
          </div>
        );
    }
  };

  if (user === null) {
    return (
      <div style={{ height: "100vh", backgroundColor: theme.bg }}>
        <Loading />
      </div>
    );
  }

  return (
    <ProfileCorner border={theme.border}>
      <Header border={theme.border} bg={theme.bg} color={theme.color}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BackBtn onClick={history.goBack}>
              <Icon
                d={backIconPaths}
                width="22.5px"
                height="22.5px"
                fill="rgb(29, 161, 242)"
              />
            </BackBtn>
            <h2>{user.fullname}</h2>
          </div>
          <NavbarUserBalance style={{ paddingRight: "0px" }}>
            <Link
              to="/profile-wallet"
              style={{ display: "flex", alignItems: "center" }}
            >
              <span style={{ fontWeight: "bold", color: "black" }}>
                {customFormat(user.balance, 7)}
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
      <Tabs tabList={tabList} />
      {renderTabVoteContent()}
      <div style={{ position: "fixed", bottom: 0, right: "50%" }}>
        {isLoading && <Loading />}
      </div>
    </ProfileCorner>
  );
}

export default Relationship;

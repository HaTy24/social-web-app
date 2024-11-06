import { Input } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { getStaticURL } from "../../constants";
import { authService } from "../../services/AuthService";
import { voteService } from "../../services/VoteService";
import { customFormat } from "../../utils/Number";
import Icon from "../icon";
import Loading from "../loading";
import {
  Button,
  Header,
  NavbarUserBalance,
  ProfileCorner,
} from "../styles/common";
import { BackBtn, UserImage } from "../styles/profile";
import i18next from "i18next";

function CreateVote() {
  const theme = useSelector((state) => state.theme);
  const [disabled, setDisabled] = useState(false);
  const user = useSelector((state) => state.profile.user);
  const history = useHistory();

  const backIconPaths = [
    "M20 11H7.414l4.293-4.293c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0l-6 6c-.39.39-.39 1.023 0 1.414l6 6c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L7.414 13H20c.553 0 1-.447 1-1s-.447-1-1-1z",
  ];

  const createVote = async (e) => {
    try {
      setDisabled(true);
      e.preventDefault();
      const screenName = e.target["handle"].value;
      const response = await voteService.createVote(screenName);
      if (response.success) {
        history.push(`/votes/${response.data.twitterScreenName}`);
      } else {
        toast.error(`${i18next.t("votes.twitterAlreadyLinkedError")}`);
      }
    } catch (error) {
      console.log(error);
    }
    setDisabled(false);
  };

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
            <h2>{i18next.t("votes.title")}</h2>
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
      <div style={{ margin: "20px" }}>
        <div style={{ color: `${theme.color}` }}>{i18next.t("votes.socialMedia")}</div>
        <div
          style={{
            color: "#000",
            border: `1px solid ${theme.border}`,
            backgroundColor: "#fff",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img
              src={`${getStaticURL()}/assets/images/twitter-x.svg`}
              alt="twitter-x"
            />
            X ({i18next.t("votes.twitter")})
          </div>
        </div>
      </div>
      <form
        onSubmit={createVote}
        style={{
          padding: "10px 20px 30px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ color: `${theme.color}` }}>{i18next.t("votes.handle")}</div>
        <Input
          id="handle"
          name="handle"
          style={{
            padding: "10px",
            marginTop: "10px",
            borderRadius: "10px",
            border: `1px solid ${theme.border}`,
            backgroundColor: "#fff",
            fontSize: "16px",
          }}
          bordered={false}
          placeholder={i18next.t("votes.handle")}
        />
        <Button
          style={{
            borderRadius: "8px",
            width: "100%",
            padding: "10px 0",
            color: `${theme.color}`,
            marginTop: "50px",
            backgroundColor: `${theme.bg}`,
            border: `1px solid ${theme.color}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            gap: "5px",
          }}
          type="submit"
          disabled={disabled}
        >
          {i18next.t("votes.continue")}
          {disabled && (
            <Loading style={{ padding: 0 }} color={theme.color} size={10} />
          )}
        </Button>
      </form>
    </ProfileCorner>
  );
}

export default CreateVote;

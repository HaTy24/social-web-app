import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import HeaderBalance from "../layouts/HeaderBalance";
import TweetModal from "../menubar/tweetModal";
import { ProfileCorner } from "../styles/common";
import { Tweet } from "../styles/home";
import Activity from "../tweet/activity";
import i18next from "i18next";

const URL = process.env.REACT_APP_SERVER_URL;
const Home = () => {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);

  useEffect(() => {
    document.title = "Home / Weknot.io";
  }, []);

  return (
    <ProfileCorner border={theme.border} style={{ position: "relative" }}>
      <HeaderBalance title={i18next.t("menuBar.home")}/>
      <Tweet border={theme.border}>
        <TweetModal rows={3} userInfo={user} autoFocus={false} />
      </Tweet>
      <Activity
        url={`${URL}/feed?userId=${1}`}
        feed
      />
    </ProfileCorner>
  );
};

export default Home;

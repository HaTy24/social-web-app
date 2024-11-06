import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { ProfileCorner } from "../styles/common";
import Tabs from "../tabs";
import GamePortfolio from "./GamePortfolio";
import MyPortfolio from "./MyPortfolio";
import MyProfile from "./MyProfile";
import EmailRequireModal from "../ModalRequireEmail";
import HeaderBalance from "../layouts/HeaderBalance";
import i18next from "i18next";

const tabList = [
  {
    name: "my-portfolio",
    title: `${i18next.t("portfolio.myPortfolio")}`,
    path: "/my-portfolio",
  },
  {
    name: "my-profile",
    title: `${i18next.t("portfolio.myProfile")}`,
    path: "/my-portfolio?tabs=my-profile",
  },
  {
    name: "game-portfolio",
    title: `${i18next.t("portfolio.gamePortfolio")}`,
    path: "/my-portfolio?tabs=game-portfolio",
  },
];
export default function Portfolio() {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);
  const query = new URLSearchParams(useLocation().search).get("tabs");
  const [pageTitle, setPageTitle] = useState(`${i18next.t("portfolio.myPortfolio")}`);

  const handleRenderTabs = () => {
    switch (query) {
      case "game-portfolio":
        return <GamePortfolio />;
      case "my-profile":
        return <MyProfile />;
      default:
        return <MyPortfolio />;
    }
  };
  useEffect(() => {
    switch (query) {
      case "my-portfolio":
        setPageTitle(`${i18next.t("portfolio.myPortfolio")}`);
        break;
      case "my-profile":
        setPageTitle(`${i18next.t("portfolio.myProfile")}`);
        break;
      default:
        setPageTitle(`${i18next.t("portfolio.gamePortfolio")}`);
        break;
    }
  }, [query]);

  return (
    <ProfileCorner border={theme.border}>
      <EmailRequireModal />
      <HeaderBalance title={pageTitle} />
      <Tabs tabList={tabList} pathDefault={"my-portfolio"} />
      {handleRenderTabs()}
    </ProfileCorner>
  );
}

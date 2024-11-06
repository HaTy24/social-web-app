import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useLocation } from "react-router-dom";
import EmailRequireModal from "../ModalRequireEmail";
import HeaderBalance from "../layouts/HeaderBalance";
import { ProfileCorner } from "../styles/common";
import Tabs from "../tabs";
import { ComingSoon } from "./comingSoon";
import { GameList } from "./gameList";
import i18next from "i18next";

const MockupPlinko = [
  {
    id: "plinko",
    name: "Plinko",
    banner: "https://game-asset.augmentlabs.io/plinko_banners.png",
    status: "active",
    url: "https://games-backend-api.augmentlabs.io/v1/game/create-session?gameid=plinko",
    isNeedLogin: true,
    businessType: "internal",
    isAutoPlay: false,
    botPathName: null,
  },
];

function Games() {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);
  const location = useLocation();
  const [games, setSetGames] = useState(MockupPlinko);

  useEffect(() => {
    document.title = "Games / Weknot.io";
  }, []);

  const tabList = [
    {
      name: "all",
      title: `${i18next.t("game.all")}`,
      path: "/games",
    },
    {
      name: "slots",
      title: `${i18next.t("game.slots")}`,
      path: "/games?category=slots",
    },
    {
      name: "blackjack",
      title: `${i18next.t("game.blackjack")}`,
      path: "/games?category=blackjack",
    },
    {
      name: "roulette",
      title: `${i18next.t("game.roulette")}`,
      path: "/games?category=roulette",
    },
    {
      name: "tableGame",
      title: `${i18next.t("game.tableGame")}`,
      path: "/games?category=tableGame",
    },
  ];

  const renderTabContent = () => {
    if (location.pathname) {
      switch (location.search) {
        case "":
          return <GameList data={games} />;
        case "?category=slots":
          return <ComingSoon />;
        case "?category=blackjack":
          return <ComingSoon />;
        case "?category=roulette":
          return <ComingSoon />;
        case "?category=tableGame":
          return <ComingSoon />;
        default:
          return;
      }
    }
  };

  return (
    <ProfileCorner border={theme.border}>
      <EmailRequireModal />
      <HeaderBalance title={i18next.t("game.title")} />
      <Tabs tabList={tabList} />
      {/* {renderTabContent()} */}
      <GameList data={games} />
    </ProfileCorner>
  );
}

export default Games;

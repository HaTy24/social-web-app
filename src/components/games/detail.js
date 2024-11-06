import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { getStaticURL } from "../../constants";
import { customFormat } from "../../utils/Number";
import {
  GameImage,
  Header,
  NavbarUserBalance,
  ProfileCorner,
} from "../styles/common";
import { UserImage } from "../styles/profile";
import { PlayGameButton } from "../styles/game";
import { gameService } from "../../services/GameService";
import Loading from "../loading";
import { isSafari } from "../../utils/pwaHelper";
import i18next from "i18next";

const MockupPlinko = {
  id: "plinko",
  name: "Plinko",
  banner: "https://game-asset.augmentlabs.io/plinko_banners.png",
  status: "active",
  url: "https://games-backend-api.augmentlabs.io/v1/game/create-session?gameid=plinko",
  isNeedLogin: true,
  businessType: "internal",
  isAutoPlay: false,
  description:
    "Players drop a ball from the top of a peg-filled board and watch as it bounces unpredictably toward the bottom. The ball lands in one of several slots, each with a point value or prize. The objective is to strategize the initial placement of the ball to maximize rewards. Simple yet addictive, Plinko combines elements of luck and skill for endless entertainment.",
  botPathName: null,
  redirectUrl: "https://games-plinko-demo.weknot.io",
};

function GameDetail() {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);
  const [gameDetail, setGameDetail] = useState(MockupPlinko);
  const [isLoading, setIsLoading] = useState(false);

  const launchGame = async () => {
    setIsLoading(true);
    const loginResult = await gameService.loginOrCreate();
    if (!loginResult.success) {
      toast.error(`${i18next.t("loginInTo")} ${gameDetail.name} ${i18next.t("failed")}`);
      return;
    }

    await gameService.setGameAccessToken(loginResult.data.tokens.access.token);
    const createSessionResult = await gameService.createSessionResult(
      gameDetail.id
    );
    if (createSessionResult.success) {
      //Open new tab
      const newLink = document.createElement("a");
      newLink.href = createSessionResult.data.redirectUrl;
      newLink.target = !isSafari ? "_blank" : "";
      newLink.click();
    }
    setIsLoading(false);
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
          <h2>{i18next.t("game.title")}</h2>
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
      <div
        style={{
          color: `${theme.color}`,
          margin: "10px 20px",
          paddingBottom: "20px",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          {gameDetail.name}
        </div>
        <GameImage src={gameDetail.banner} alt={gameDetail.name} />
        <p>{gameDetail.description}</p>
        <PlayGameButton
          bg={theme.bg}
          color={theme.color}
          disabled={isLoading}
          onClick={() => window.open("https://games-plinko-demo.weknot.io")}
        >
          {isLoading && (
            <Loading style={{ padding: 0 }} color={theme.bg} size={10} />
          )}
          <span style={{ fontSize: "16px" }}>{i18next.t("game.title")}</span>
        </PlayGameButton>
      </div>
    </ProfileCorner>
  );
}

export default GameDetail;

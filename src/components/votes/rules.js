import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { voteService } from "../../services/VoteService";
import { customFormat } from "../../utils/Number";
import Loading from "../loading";
import i18next from "i18next";

export const Rules = () => {
  const [totalUnclaimed, setTotalUnclaimed] = useState(0);
  const [liveBNBBalance, setLiveBNBBalance] = useState({});
  const theme = useSelector((state) => state.theme);

  const getLiveBNB = async () => {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=BTC,USD,EUR"
    );
    setLiveBNBBalance(response.data);
  };

  const getTotalUnclaimed = async () => {
    const response = await voteService.getTotalUnclaimed();
    if (response.success) {
      setTotalUnclaimed(response.data);
    }
  };

  useEffect(() => {
    getTotalUnclaimed();
    getLiveBNB();
  }, []);

  if (!totalUnclaimed || !liveBNBBalance) return <Loading />;

  return (
    <div style={{ margin: "30px 20px" }}>
      <div
        style={{
          color: `${theme.bg}`,
          backgroundColor: `${theme.color}`,
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
        }}
      >
        <div>{i18next.t("votes.totalUnclaimedAmount")}</div>
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          {customFormat(totalUnclaimed, 8)} BNB
        </div>
        <div style={{ fontSize: "13px" }}>
          ${customFormat(liveBNBBalance.USD * totalUnclaimed, 8)}
        </div>
      </div>
      <div
        style={{
          backgroundColor: `${theme.tweetHov}`,
          color: `${theme.color}`,
          padding: "15px",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h2 style={{ textAlign: "center", color: `${theme.color}` }}>
          {i18next.t("votes.introductionToVotes")}
        </h2>
        <div>
          <div style={{ fontSize: "18px" }}>{i18next.t("votes.howVotesWorkTitle")}</div>
          <span style={{ color: "#999" }}>
            {i18next.t("votes.howVotesWorkContent")}
          </span>
        </div>
        <div style={{ marginTop: "20px" }}>
          <div style={{ fontSize: "18px" }}>
            {i18next.t("votes.howRoyaltyFeesForVotesWorkTitle")}
          </div>
          <span style={{ color: "#999" }}>
            {i18next.t("votes.howRoyaltyFeesForVotesWorkContent")}
          </span>
        </div>
      </div>
    </div>
  );
};

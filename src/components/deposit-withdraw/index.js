import React from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

import EmailRequireModal from "../ModalRequireEmail";
import HeaderBalance from "../layouts/HeaderBalance";
import { ProfileCorner } from "../styles/common";
import Tabs from "../tabs";
import GameDeposit from "./GameDeposit";
import GameWithdraw from "./GameWithdraw";
import i18next from "i18next";

const tabList = [
  {
    name: "deposit",
    title: "Deposit",
    path: "/deposit-withdraw",
  },
  {
    name: "withdraw",
    title: "Withdraw",
    path: "/deposit-withdraw?tabs=withdraw",
  },
];

export default function DepositAndWithdraw() {
  const query = new URLSearchParams(useLocation().search).get("tabs");
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);

  const handleRenderTabs = () => {
    switch (query) {
      case "withdraw":
        return <GameWithdraw />;
      default:
        return <GameDeposit />;
    }
  };

  return (
    <ProfileCorner border={theme.border}>
      <EmailRequireModal />
      <HeaderBalance title={i18next.t("depositWithdraw.gameTransaction")} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          paddingTop: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "0 16px",
          }}
        >
          <NavLink
            className="link"
            to="/my-portfolio?tabs=game-portfolio"
            style={{
              padding: "4px 12px",
              fontWeight: 700,
              background: "#94A3B8",
              borderRadius: "20px",
              width: "max-content",
              color: theme.color,
            }}
          >
            {i18next.t("depositWithdraw.transactionHistory")}
          </NavLink>
        </div>
        <Tabs tabList={tabList} pathDefault={"deposit"} />
      </div>
      {handleRenderTabs()}
    </ProfileCorner>
  );
}

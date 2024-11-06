import React, { useEffect, useMemo, useState } from "react";
import { ProfileCorner } from "../styles/common";
import { useSelector } from "react-redux";
import { UserImage } from "../styles/profile";
import TableCustom from "../table";
import { userService } from "../../services/UserService";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { UserTable } from "../styles/game";
import { customFormat, removeTrailingZeros } from "../../utils/Number";
import axios from "axios";
import { ACCOUNT_TYPE } from "../../constants";
import { YellowTick } from "../icons/YellowTick";
import i18next from "i18next";
const columns = [
  {
    title: (
      <span
        style={{
          fontWeight: 400,
          fontSize: "13px",
          color: "rgb(101, 119, 134)",
        }}
      >
        {i18next.t("portfolio.user")}
      </span>
    ),
    dataIndex: "user",
    key: "user",
    align: "left",
    width: "30px",
  },
  {
    title: (
      <span
        style={{
          fontWeight: 400,
          fontSize: "13px",
          color: "rgb(101, 119, 134)",
        }}
      >
        {i18next.t("portfolio.buyPrice")}
      </span>
    ),
    dataIndex: "buyPrice",
    key: "buyPrice",
    align: "right",
    width: "30px",
  },
  {
    title: (
      <span
        style={{
          fontWeight: 400,
          fontSize: "13px",
          color: "rgb(101, 119, 134)",
        }}
      >
        {i18next.t("portfolio.sellPrice")}
      </span>
    ),
    dataIndex: "sellPrice",
    key: "sellPrice",
    align: "right",
  },
];

export default function MyPortfolio() {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);
  const [isLoading, setIsLoading] = useState(false);
  const [holdingDataTable, setHoldingDataTable] = useState([]);
  const [{ holders, holdings }, setSharesCount] = useState({
    holders: 0,
    holdings: 0,
  });

  const getLiveBNB = async () => {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=BTC,USD,EUR"
    );
    return response.data;
  };
  const getRelationships = async () => {
    try {
      setIsLoading(true);
      const liveBNBBalance = await getLiveBNB();
      const response = await userService.getRelationships(user.id);
      if (response.success) {
        setSharesCount({
          holders: response.data.holderAddreses.length,
          holdings: response.data.holdingAddresses.reduce(
            (a, b) => a + b.sharesCount,
            0
          ),
        });
        setHoldingDataTable(() =>
          response.data.holdingAddresses.map((data) =>
            generateHoldingData(data, liveBNBBalance)
          )
        );
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRelationships();
  }, [user]);

  const generateHoldingData = (data, liveBNBBalance) => ({
    user: (
      <Link
        to={`/profile/${data.id}`}
        style={{ display: "flex", alignItems: "center", gap: "2px" }}
      >
        <UserImage
          style={{ width: "40px", height: "40px" }}
          src={data.imageUrl}
        />
        <UserTable>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              color: theme.color,
              maxWidth: "180px",
            }}
          >
            {data.fullname}
            {data.accountType === ACCOUNT_TYPE.INVESTMENT && <YellowTick />}
          </h3>
          <span style={{ color: "rgb(101, 119, 134)" }}>@{data.username}</span>
          <span style={{ color: "rgb(101, 119, 134)", fontSize: "10px" }}>
            {i18next.t("portfolio.youOwn")}{" "}
            <span style={{ color: theme.color }}>{data.sharesCount}</span> {i18next.t("portfolio.shares")}
            {Number(data.sharesCount) > 1 ? "s" : ""}
          </span>
        </UserTable>
      </Link>
    ),
    buyPrice: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: "2px",
        }}
      >
        <span style={{ color: "#10B981", fontWeight: 700 }}>
          {customFormat(data?.share?.buyPrice, 7)}
        </span>
        <span style={{ color: "rgb(101, 119, 134)", fontSize: "10px" }}>
          ~$
          {customFormat(liveBNBBalance?.USD * Number(data?.share?.buyPrice), 4)}
        </span>
      </div>
    ),
    sellPrice: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: "2px",
        }}
      >
        <span style={{ color: "#EF4444", fontWeight: 700 }}>
          {customFormat(data?.share?.sellPrice, 7)}
        </span>
        <span style={{ color: "rgb(101, 119, 134)", fontSize: "10px" }}>
          ~$
          {customFormat(
            liveBNBBalance?.USD * Number(data?.share?.sellPrice),
            4
          )}
        </span>
      </div>
    ),
  });

  return (
    <ProfileCorner border={theme.border}>
      <div
        style={{
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <UserImage
            style={{ width: "48px", height: "48px" }}
            src={user.profile_image_url}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "16px",
            }}
          >
            <span style={{ color: theme.color, fontWeight: 700 }}>
              {user.fullname}
            </span>
            <span style={{ color: "rgb(101, 119, 134)" }}>
              {i18next.t("portfolio.holding")} {holdings} {i18next.t("portfolio.shares")}
            </span>
          </div>
        </div>
        <div style={{ padding: "0 16px" }}>
          <TableCustom
            isLoading={isLoading}
            columns={columns}
            data={holdingDataTable}
          />
        </div>
      </div>
    </ProfileCorner>
  );
}

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import HeaderBalance from "../layouts/HeaderBalance";
import { CheckIcon } from "../icons/CheckIcon";
import { UserTable } from "../styles/game";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import TableCustom from "../table";
import { UserImage } from "../styles/profile";
import { YellowTick } from "../icons/YellowTick";
import { Button } from "../styles/sidebar";
import { ProfileCorner } from "../styles/common";
import { customFormat, removeTrailingZeros } from "../../utils/Number";
import { userService } from "../../services/UserService";
import i18next from "i18next";

const columns = [
  {
    title: "",
    dataIndex: "company",
    key: "company",
    align: "left",
    width: "30px",
  },
  {
    title: "",
    dataIndex: "value",
    key: "value",
    align: "right",
    width: "max-content",
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    align: "right",
    width: "max-content",
  },
];

const InvestPage = () => {
  const history = useHistory();
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);
  const [isLoading, setIsLoading] = useState(false);
  const [investmentDataTable, setInvestmentDataTable] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const getLiveBNB = async () => {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=BTC,USD,EUR"
    );
    return response.data;
  };
  const getListInvestment = async (pagination) => {
    try {
      setIsLoading(true);
      const liveBNBBalance = await getLiveBNB();
      const response = await userService.getInvestment(pagination);
      if (response.success) {
        setTotalCount(response.data.totalCount);
        setInvestmentDataTable(
          response.data.rows.map((data) =>
            generateInvestmentData(data, liveBNBBalance)
          )
        );
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   getListInvestment();
  // }, [user]);
  const generateInvestmentData = (data, liveBNBBalance) => ({
    company: (
      <Link
        to={`/profile/${data.id}`}
        style={{ display: "flex", alignItems: "center", gap: "2px" }}
      >
        <UserImage
          style={{ width: "48px", height: "48px" }}
          src={data.profile_image_url}
        />
        <UserTable>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: theme.color,
              maxWidth: "180px",
            }}
          >
            {data?.fullname}
            <YellowTick />
          </h3>
          <span style={{ color: "rgb(101, 119, 134)" }}>
            @{data.twitterScreenName}
          </span>
        </UserTable>
      </Link>
    ),
    value: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "end",
        }}
      >
        <span
          style={{
            color: theme.color,
            fontSize: "14px",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {customFormat(data?.share?.buyPrice, 8)}
        </span>
        <span style={{ color: "rgb(101, 119, 134)", fontSize: "10px" }}>
          ~$
          {customFormat(liveBNBBalance?.USD * Number(data?.share?.buyPrice), 4)}
        </span>
      </div>
    ),
    action: (
      <Button
        onClick={(e) => handleBuy(e, data.id)}
        style={{ color: "#000", padding: "4px 8px" }}
      >
        {i18next.t("trade")}
      </Button>
    ),
  });
  const handleBuy = async (e, id) => {
    e.preventDefault();
    history.push(`/buy-sell/${id}`);
  };
  return (
    <ProfileCorner border={theme.border}>
      <HeaderBalance title={i18next.t("invest.title")} />
      <div
        style={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "12",
        }}
      >
        <span style={{ color: theme.color, fontSize: "18px", fontWeight: 700 }}>
          {i18next.t("invest.companyAccounts")}
        </span>
        <div
          style={{
            borderRadius: "10px",
            background: theme.mode == "dark" ? "#1E293B" : "#efefef",
            padding: "12px",
          }}
        >
          <div
            style={{
              color: `${theme.color}`,
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "10px",
            }}
          >
            {i18next.t("invest.howItWorks")}
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div>
              <CheckIcon />
            </div>
            <span style={{ color: `${theme.color}`, fontSize: "16px" }}>
              <b>{i18next.t("invest.profitSharingTitle")}</b>: {i18next.t("invest.profitSharingContent")}
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div>
              <CheckIcon />
            </div>
            <span style={{ color: `${theme.color}`, fontSize: "16px" }}>
              <b>{i18next.t("invest.pioneerToNewFeaturesTitle")}</b>: {i18next.t("invest.pioneerToNewFeaturesTitle")}
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div>
              <CheckIcon />
            </div>
            <span style={{ color: `${theme.color}`, fontSize: "16px" }}>
              <b>{i18next.t("invest.votingRightsTitle")}</b>: {i18next.t("invest.votingRightsContent")}
            </span>
          </div>
        </div>
        <div style={{ padding: "0 12px" }}>
          <TableCustom
            isLoading={isLoading}
            columns={columns}
            data={investmentDataTable}
            fetchData={getListInvestment}
            isPagination
            totalCount={totalCount}
          />
        </div>
      </div>
    </ProfileCorner>
  );
};
export default InvestPage;

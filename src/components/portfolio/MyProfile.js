import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProfileCorner, UserInfo } from "../styles/common";
import { removeTrailingZeros, customFormat } from "../../utils/Number";
import TableCustom from "../table";
import { userService } from "../../services/UserService";
import { UserImage } from "../styles/profile";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { UserTable } from "../styles/game";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
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
        {i18next.t("portfolio.company")}
      </span>
    ),
    dataIndex: "company",
    key: "company",
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
        {i18next.t("portfolio.numberOfShares")}
      </span>
    ),
    dataIndex: "valueHoldings",
    key: "valueHoldings",
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
        {i18next.t("portfolio.percentageOfShares")}
      </span>
    ),
    dataIndex: "shareAmount",
    key: "shareAmount",
    align: "right",
  },
];

export default function MyProfile() {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);

  const [isLoading, setIsLoading] = useState(false);
  const [companyDataTable, setCompanyDataTable] = useState([]);
  const [holding, setHolding] = useState(0);
  const [date, setDate] = useState(new Date());

  const renderMonthContent = (month, shortMonth, longMonth, day) => {
    const fullYear = new Date(day).getFullYear();
    const tooltipText = `${i18next.t("portfolio.tooltipForMonth")} ${longMonth} ${fullYear}`;

    return <span title={tooltipText}>{shortMonth}</span>;
  };

  const getCompanyData = async (month) => {
    try {
      setIsLoading(true);
      const response = await userService.getCompanyHistory(month);
      if (response.success) {
        setCompanyDataTable(
          response.data.map((data) => generateCompanyData(data))
        );
        setHolding(
          response.data.reduce((a, b) => a + b.analytic.totalShares, 0)
        );
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompanyData(date);
    document.getElementById("date-picker").setAttribute("readonly", "true");
  }, [user, date]);

  const generateCompanyData = (data) => ({
    company: (
      <Link
        to={`/profile/${data.id}`}
        style={{ display: "flex", alignItems: "center", gap: "2px" }}
      >
        <UserImage
          style={{ width: "24px", height: "24px" }}
          src={data.profile_image_url}
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
            {data?.fullName}
            <YellowTick />
          </h3>
          <span style={{ color: "rgb(101, 119, 134)", fontSize: "10px" }}>
            {i18next.t("portfolio.totalShares")}{" "}
            <span style={{ color: theme.color }}>
              {data?.analytic?.totalShares}
            </span>
          </span>
        </UserTable>
      </Link>
    ),
    valueHoldings: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <span
          style={{ color: theme.color, fontSize: "14px", textAlign: "center" }}
        >
          {data?.analytic?.details?.count}
        </span>
      </div>
    ),
    shareAmount: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <span
          style={{ color: theme.color, fontSize: "14px", textAlign: "center" }}
        >
          {data?.analytic?.details?.percentage}%
        </span>
      </div>
    ),
  });

  return (
    <ProfileCorner
      border={theme.border}
      color={theme.color}
      bg={theme.bg}
      boxShadow={theme.boxShadow}
      tweetHov={theme.tweetHov}
    >
      <div className="my-profile">
        <UserInfo color={theme.color}>
          <UserImage
            style={{ width: "48px", height: "48px", marginRight: 0 }}
            src={user.profile_image_url}
          />
          <div className="info">
            <span className="user-name">{user.fullname}</span>
            <span className="shares">{i18next.t("portfolio.holding")} {holding} {i18next.t("portfolio.companyShares")}</span>
          </div>
        </UserInfo>
        <div
          style={{
            display: "flex",
            padding: "12px 0",
            borderRadius: "8px",
            border: "1px solid #393939",
          }}
        >
          <div style={{ borderRight: "1px solid #393939", width: "50%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  color: "#999",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {i18next.t("portfolio.buyPrice")}
              </span>
              <h2
                style={{
                  color: "#11B981",
                  margin: 0,
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                {customFormat(user.share.buyPrice, 8)} BNB
              </h2>
            </div>
          </div>
          <div style={{ width: "50%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  color: "#999",
                  fontWeight: 700,
                  fontSize: "14px",
                }}
              >
                {i18next.t("portfolio.sellPrice")}
              </span>
              <h2
                style={{
                  color: "#F43F5E",
                  margin: 0,
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                {customFormat(user.share.sellPrice, 8)} BNB
              </h2>
            </div>
          </div>
        </div>
        <div>
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                color: theme.color,
                fontSize: "14px",
                fontWeight: 700,
                flex: 1,
              }}
            >
              {i18next.t("portfolio.revenueShare")}
            </span>

            <DatePicker
              selected={date}
              renderMonthContent={renderMonthContent}
              onSelect={(date) => setDate(new Date(date))}
              showMonthYearPicker
              maxDate={new Date()}
              className="date-picker"
              id="date-picker"
              dateFormat="MM/yyyy"
            />
          </div>
          <div style={{ padding: "0 12px" }}>
            <TableCustom
              isLoading={false}
              columns={columns}
              data={companyDataTable}
            />
          </div>
        </div>
      </div>
    </ProfileCorner>
  );
}

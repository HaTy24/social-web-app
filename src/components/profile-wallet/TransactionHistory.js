import React, { useEffect, useState } from "react";
import { TransactioHistory } from "../styles/profile-wallet";
import {
  TRANSACTION_ACTIONS,
  getStaticScanUrl,
  getStaticURL,
} from "../../constants";
import { customFormat } from "../../utils/Number";
import { Link, useParams } from "react-router-dom";
import { DateTime } from "luxon";
import { useSelector } from "react-redux";
import { ExternalIcon } from "../core/icons/ExternalIcon";
import Loading from "../loading";
import i18next from "i18next";

export const TransactionHistory = (props) => {
  const theme = useSelector((state) => state.theme);
  const {
    getTransactions,
    transferHistory,
    limit,
    offset,
    setPaginations,
    isLoading,
    setIsLoading,
  } = props;
  // useEffect(() => {
  //   const isFirstLoad = true;
  //   getTransactions({ limit: 2, offset: 0 }, isFirstLoad);
  // }, []);

  return (
    <TransactioHistory>
      {transferHistory.map((item, index) => (
        <div key={index}>
          {item.ownerAddress && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                <div>
                  {item.action === TRANSACTION_ACTIONS.BUY_SHARES ? (
                    <p style={{ color: "#69BC84" }}>{i18next.t("profileWallet.youBuy")}</p>
                  ) : (
                    <p style={{ color: "red" }}>{i18next.t("profileWallet.youSell")}</p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      justifyContent: "space-between",
                      fontSize: "14px",
                      color: theme.color,
                    }}
                  >
                    {item.quantity} {i18next.t("profileWallet.shares")}
                  </div>
                </div>
                <a
                  href={`${getStaticScanUrl()}/${item.txHash}`}
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #E6ECF0",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  target="_blank"
                >
                  <div style={{ width: "16px", height: "16px" }}>
                    <ExternalIcon />
                  </div>
                </a>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  justifyContent: "space-between",
                  color: theme.color,
                  fontSize: "14px",
                }}
              >
                <p>{i18next.t("profileWallet.totalPrice")}</p>
                <p>{customFormat(item.amount, 8)} BNB</p>
              </div>
              {/* <div
                style={{
                  display: "flex",
                  gap: "5px",
                  justifyContent: "space-between",
                  fontSize: "14px",
                }}
              >
                <p
                  style={{
                    color: theme.color,
                  }}
                >
                  Profile
                </p>
                <Link to={"/profile/" + item.owner.id}>
                  @{item.owner.twitterScreenName}
                </Link>
              </div> */}
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  justifyContent: "space-between",
                  color: theme.color,
                  fontSize: "14px",
                }}
              >
                <p>{i18next.t("profileWallet.time")}</p>
                <p>
                  {DateTime.fromISO(item.createdAt).toFormat(
                    "yyyy-MM-dd HH:mm"
                  )}
                </p>
              </div>
              <div
                style={{
                  width: "100%",
                  margin: "0 auto",
                  border: "1px solid #E6ECF0",
                }}
              />
            </div>
          )}
        </div>
      ))}
      <div style={{ position: "fixed", bottom: 0, right: "50%" }}>
        {isLoading && <Loading />}
      </div>
    </TransactioHistory>
  );
};

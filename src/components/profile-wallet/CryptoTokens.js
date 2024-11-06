import React, { useState } from "react";
import { useEffect } from "react";
import { LIST_TOKEN, getStaticURL } from "../../constants";
import { userService } from "../../services/UserService";
import { useSelector } from "react-redux";
import Loading from "../loading";
import {
  convertBalanceDecimalToNumber,
  customFormat,
} from "../../utils/Number";
import i18next from "i18next";

export default function CryptoTokens() {
  const theme = useSelector((state) => state.theme);
  const refresh = useSelector((state) => state.update.refresh);
  const [listToken, setListToken] = useState([]);
  const [isAfterFirstLoad, setIsAfterFirstLoad] = useState(true);

  const handleGetListToken = async (isLoading = false) => {
    try {
      const result = await userService.getTokens();
      if (result.success === true) {
        const newTokens = result.data.map((token) => {
          const logoURI = LIST_TOKEN.find(
            (item) => item.symbol == token.symbol
          ).logoURI;
          return { ...token, logoURI };
        });
        setListToken(newTokens);
      }
      isLoading && setIsAfterFirstLoad(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getTokenInterval = setInterval(() => handleGetListToken(), 30000);
    return () => clearInterval(getTokenInterval);
  }, []);

  useEffect(() => {
    handleGetListToken(true);
  }, [refresh]);
  return (
    <div>
      <h3
        style={{
          fontSize: "20px",
          fontWeight: 700,
          marginBottom: "24px",
          color: theme.color,
        }}
      >
        {i18next.t("profileWallet.cryptoTokens")}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {isAfterFirstLoad ? (
          <Loading style={{ padding: 0 }} color={theme.color} size={10} />
        ) : listToken.length > 0 ? (
          listToken.map((token, index) => (
            <div
              key={token.symbol}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 12px",
                borderRadius: "4px",
                background: index % 2 != 0 ? "#b5b5b53b" : "",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <img
                  src={token.logoURI}
                  alt=""
                  style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                />
                <span style={{ fontSize: "16px", color: theme.color }}>
                  {token.symbol}
                </span>
              </div>
              <span style={{ fontSize: "16px", color: theme.color }}>
                {customFormat(
                  convertBalanceDecimalToNumber(token.amount, token.decimals),
                  6
                )}
              </span>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: theme.color }}>{i18next.t("profileWallet.noData")}</p>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { UserImage } from "../styles/profile";
import { LIST_TOKEN } from "../../constants";
import SelectCustom from "../select";
import { Button } from "../styles/common";
import { Input } from "antd";
import { userService } from "../../services/UserService";
import {
  convertBalanceDecimalToNumber,
  customFormat,
} from "../../utils/Number";
import { toast } from "react-toastify";
import Loading from "../loading";
import { gameService } from "../../services/GameService";
import ModalSuccess from "./ModalGameTransactionSuccess";
import i18next from "i18next";

export default function GameWithdraw() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const [amount, setAmount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWithdraw, setIsLoadingWithdraw] = useState(false);
  const [listToken, setListToken] = useState([]);
  const [currentToken, setCurrentToken] = useState({});
  const [gameBalance, setGameBalance] = useState(0);
  const [isOpenModelSuccess, setIsOpenModelSuccess] = useState(false);

  const getListToken = async () => {
    try {
      setIsLoading(true);
      const result = await userService.getTokens();
      if (result.success === true) {
        const newTokens = result.data.map((token) => {
          const logoURI = LIST_TOKEN.find(
            (item) => item.symbol == token.symbol
          ).logoURI;
          return {
            value: convertBalanceDecimalToNumber(token.amount, token.decimals),
            label: token.name,
            src: logoURI,
            symbol: token.symbol,
            decimals: token.decimals,
            address: token.address,
          };
        });
        setListToken(newTokens.filter((token) => token.symbol === "USDT"));
        setCurrentToken(newTokens.find((token) => token.symbol === "USDT"));
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      if (amount && currentToken.address) {
        setIsLoadingWithdraw(true);
        if (amount > gameBalance) {
          toast(`${i18next.t("maximumAmount")} ${gameBalance}`, {
            type: "error",
            position: "top-right",
            autoClose: 2500,
            closeOnClick: true,
          });
          return;
        }
        const response = await gameService.withdraw({
          amount,
          tokenAddress: currentToken.address,
        });

        if (response.success) {
          setIsOpenModelSuccess(true);
          dispatch({ type: SET_UPDATE });
          setAmount();
          setGameBalance(response.data.balance);
        } else {
          toast(`${i18next.t("withdrawFailed")}`, {
            type: "error",
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
          });
        }
      }
    } catch (error) {
    } finally {
      setIsLoadingWithdraw(false);
    }
  };
  useEffect(() => {
    getListToken();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await gameService.getGameBalance("plinko");
      if (response.success) {
        setGameBalance(Number(response.data.gameBalance));
      }
    })();
  }, []);
  return (
    <div
      style={{
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <form
        onSubmit={handleWithdraw}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{ color: theme.color, fontSize: "20px", fontWeight: 700 }}
            >
              {i18next.t("depositWithdraw.gameBalance")}
            </span>
            <span
              style={{ color: theme.color, fontSize: "20px", fontWeight: 700 }}
            >
              {customFormat(gameBalance, 2)}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{ color: theme.color, fontSize: "20px", fontWeight: 700 }}
            >
              {i18next.t("depositWithdraw.withdraw")}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <SelectCustom
              isLoading={isLoading}
              width={"140px"}
              listItem={listToken}
              currentItem={currentToken}
              onChange={(newToken) => {
                setCurrentToken(newToken);
              }}
            />
          </div>
        </div>
        <div>
          <span style={{ color: theme.color, fontSize: "14px" }}>{i18next.t("depositWithdraw.amount")}</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "6px",
            }}
          >
            <UserImage
              style={{ width: "32px", height: "32px" }}
              src={currentToken.src}
            />
            <Input
              style={{
                width: "auto",
                fontSize: "32px",
                color: theme.color,
                padding: 0,
              }}
              bordered={false}
              id="amount"
              name="amount"
              type="number"
              min={0}
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value));
              }}
              onKeyDown={(e) =>
                ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
              }
            />
          </div>
          <div style={{ color: "rgb(101, 119, 134)", marginTop: "10px" }}>
            {i18next.t("depositWithdraw.minimumAmount")}
          </div>
        </div>
        <div>
          <Button
            type="submit"
            disabled={!amount || isLoadingWithdraw || amount < 5}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {i18next.t("depositWithdraw.withdraw")}
            {isLoadingWithdraw && (
              <Loading style={{ padding: 0 }} color={theme.color} size={10} />
            )}
          </Button>
        </div>
      </form>
      {isOpenModelSuccess && (
        <ModalSuccess onClose={() => setIsOpenModelSuccess(false)} />
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { UserImage } from "../styles/profile";
import { LIST_TOKEN } from "../../constants";
import SelectCustom from "../select";
import { Button } from "../styles/common";
import { Input, Tooltip } from "antd";
import { MoreInfoIcon } from "../icons/MoreInfoIcon";
import { userService } from "../../services/UserService";
import {
  convertBalanceDecimalToNumber,
  customFormat,
} from "../../utils/Number";
import { gameService } from "../../services/GameService";
import Loading from "../loading";
import { toast } from "react-toastify";
import { SET_UPDATE } from "../../redux/actions";
import ModalSuccess from "./ModalGameTransactionSuccess";
import i18next from "i18next";

export default function GameDeposit() {
  const refresh = useSelector((state) => state.update.refresh);
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const [amount, setAmount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDeposit, setIsLoadingDeposit] = useState(false);
  const [listToken, setListToken] = useState([]);
  const [currentToken, setCurrentToken] = useState({});
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
            value: customFormat(
              convertBalanceDecimalToNumber(token.amount, token.decimals),
              2
            ),
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

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      if (amount && currentToken.address) {
        setIsLoadingDeposit(true);
        if (amount > Number(currentToken.value)) {
          toast(`${i18next.t("notEnoughBalance")}`, {
            type: "error",
            position: "top-right",
            autoClose: 2500,
            closeOnClick: true,
          });
          return;
        }
        const response = await gameService.deposit({
          amount,
          tokenAddress: currentToken.address,
        });
        if (response.success) {
          setIsOpenModelSuccess(true);
          setAmount();
          dispatch({ type: SET_UPDATE });
        } else {
          toast(`${i18next.t("depositUnsuccessful")}`, {
            type: "error",
            position: "top-right",
            autoClose: 2500,
            closeOnClick: true,
          });
        }
      }
    } catch (error) {
    } finally {
      setIsLoadingDeposit(false);
    }
  };

  useEffect(() => {
    getListToken();
  }, [refresh]);

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
        onSubmit={handleDeposit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: theme.color }}>
              {i18next.t("depositWithdraw.blockchainWalletBalance")}
            </span>
            <Tooltip
              color={theme.color}
              overlayInnerStyle={{
                color: theme.bg,
              }}
              placement="top"
              title={i18next.t("depositWithdraw.textTotalAmountTooltip")}
            >
              <div style={{ marginTop: "5px" }}>
                <MoreInfoIcon color={theme.color} />
              </div>
            </Tooltip>
          </div>
          <SelectCustom
            isLoading={isLoading}
            listItem={listToken}
            currentItem={currentToken}
            isShowValue={true}
            onChange={(newItem) => {
              setCurrentToken(newItem);
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{ color: theme.color, fontSize: "20px", fontWeight: 700 }}
          >
            {i18next.t("depositWithdraw.deposit")}
          </span>
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
              src={currentToken?.src}
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
            disabled={!amount || isLoadingDeposit || amount < 5}
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
            {i18next.t("depositWithdraw.deposit")}
            {isLoadingDeposit && (
              <Loading style={{ padding: 0 }} color={theme.color} size={10} />
            )}
          </Button>
        </div>
      </form>
      {/* <div>
        <div
          style={{
            color: theme.color,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          <span>Verify transaction by Tx Hash</span>
          <Tooltip
            color={theme.color}
            overlayInnerStyle={{
              color: theme.bg,
            }}
            placement="top"
            title={
              "If you already transferred to our wallet but something wrong happen, you can re-submit the transaction hash here."
            }
          >
            <div style={{ marginTop: "5px" }}>
              <MoreInfoIcon color={theme.color} />
            </div>
          </Tooltip>
        </div>
      </div> */}
      {/* <div>
        <div style={{ color: theme.color, fontWeight: 700 }}>
          Transaction Hash
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Input
            style={{
              fontSize: "14px",
              color: theme.color,
              borderBottom: `1px solid ${theme.border}`,
            }}
            bordered={false}
            id="amount"
            name="amount"
            type="text"
            min={0}
          />
          <Button style={{ padding: "12px 24px", borderRadius: "8px" }}>
            Verify
          </Button>
        </div>
      </div> */}
      {isOpenModelSuccess && (
        <ModalSuccess onClose={() => setIsOpenModelSuccess(false)} />
      )}
    </div>
  );
}

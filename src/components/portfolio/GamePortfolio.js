import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { GAME_WITHDRAW_STATUS, LIST_TOKEN } from "../../constants";
import { gameService } from "../../services/GameService";
import { userService } from "../../services/UserService";
import {
  convertBalanceDecimalToNumber,
  customFormat,
} from "../../utils/Number";
import { CopyIcon } from "../core/icons/CopyIcon";
import Loading from "../loading";
import SelectCustom from "../select";
import { Button } from "../styles/common";
import {
  PortfolioBoxBorder,
  PortfolioWrapper,
  SwitchItem,
  SwitchWrapper,
} from "../styles/portfolio";
import TableCustom from "../table";
import i18next from "i18next";
import { convertDate } from "../../utils/convertDate";

const columnsDeposit = [
  {
    title: `${i18next.t("portfolio.action")}`,
    dataIndex: "action",
    key: "name",
    align: "left",
    width: "30px",
  },
  {
    title: `${i18next.t("portfolio.amount")}`,
    dataIndex: "amount",
    key: "amount",
    align: "right",
    width: "30px",
  },
  {
    title: `${i18next.t("portfolio.txHash")}`,
    dataIndex: "txHash",
    key: "txHash",
    align: "right",
  },
  {
    title: `${i18next.t("portfolio.status")}`,
    dataIndex: "status",
    key: "status",
    align: "right",
  },
  {
    title: `${i18next.t("portfolio.time")}`,
    dataIndex: "time",
    key: "time",
    align: "right",
  },
];
const columnsWithdraw = [
  {
    title: `${i18next.t("portfolio.action")}`,
    dataIndex: "action",
    key: "name",
    align: "left",
    width: "30px",
  },
  {
    title: `${i18next.t("portfolio.amount")}`,
    dataIndex: "amount",
    key: "amount",
    align: "right",
    width: "30px",
  },
  {
    title: `${i18next.t("portfolio.fee")}`,
    dataIndex: "txnfee",
    key: "txnfee",
    align: "right",
    width: "60px",
  },
  {
    title: `${i18next.t("portfolio.credit")}`,
    dataIndex: "amttocredit",
    key: "amttocredit",
    align: "right",
    width: "60px",
  },
  {
    title: `${i18next.t("portfolio.status")}`,
    dataIndex: "status",
    key: "status",
    align: "center",
    tooltip: true,
    tooltipText: (
      <div>
        <span>
          <b>{i18next.t("portfolio.underReviewTitle")}</b> {i18next.t("portfolio.underReviewContent")}
        </span>
        <br />
        <span
          style={{
            display: "inline-block",
            marginTop: "5px",
          }}
        >
          <b>{i18next.t("portfolio.approvedTitle")}</b> {i18next.t("portfolio.approvedContent")}
        </span>
      </div>
    ),
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    align: "right",
    width: "60px",
  },
];
export default function GamePortfolio() {
  const theme = useSelector((state) => state.theme);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingMoreHistory, setIsLoadingMoreHistory] = useState(false);
  const [listToken, setListToken] = useState([]);
  const [currentToken, setCurrentToken] = useState({});
  const [isShowDepositHistory, setIsShowDepositHistory] = useState(true);
  const [historiesDeposit, setHistoriesDeposit] = useState([]);
  const [historiesWithdraw, setHistoriesWithdraw] = useState([]);
  const [gameBalance, setGameBalance] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [{ offset, limit }, setPaginations] = useState({
    offset: 0,
    limit: 10,
  });

  const getDepositHistory = async (pagination) => {
    let newHistories = [];
    try {
      pagination.offset == 0 && setIsLoadingHistory(true);
      pagination.offset > 0 && setIsLoadingMoreHistory(true);
      const response = await gameService.depositHistory(pagination);

      if (response.success && response.data) {
        newHistories = response.data.items.map((item) => ({
          key: "1",
          action: i18next.t("portfolio.deposit"),
          amount: customFormat(item.amttoinvest, 2),
          txHash: (
            <div
              style={{
                display: "flex",
                gap: "4px",
                justifyContent: "flex-end",
              }}
            >
              {item.txnid.slice(0, 4) + "..." + item.txnid.slice(-4)}
              <div
                style={{ width: "18px", cursor: "pointer" }}
                onClick={() => handleCopy(item.txnid)}
              >
                <CopyIcon color={theme.color} />
              </div>
            </div>
          ),
          status: (
            <span style={{ textTransform: "capitalize" }}>{i18next.t("portfolio." + item.status)}</span>
          ),
          time: (
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <span> {convertDate(item.addon)}</span>
            </div>
          ),
        }));
        setCurrentPage(response.data.page);
        setTotalPage(response.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingHistory(false);
      setIsLoadingMoreHistory(false);
    }
    if (pagination.offset > 0) {
      setHistoriesDeposit((prev) => [...prev, ...newHistories]);
    } else {
      setHistoriesDeposit([...newHistories]);
    }

    return newHistories;
  };

  const getWithdrawHistory = async (pagination) => {
    let newHistories = [];
    try {
      pagination.offset == 0 && setIsLoadingHistory(true);
      pagination.offset > 0 && setIsLoadingMoreHistory(true);
      const response = await gameService.withdrawHistory(pagination);
      if (response.success && response.data) {
        newHistories = response.data.items.map((item) => ({
          key: "1",
          action: "Withdraw",
          amount: customFormat(item.wdamt, 2),
          txnfee: customFormat(item.txnfee, 2),
          amttocredit: customFormat(item.amttocredit, 2),
          status: (
            <span style={{ textTransform: "capitalize" }}>
              {item.status === GAME_WITHDRAW_STATUS.INPROGRESS
                ? "Under review"
                : item.status}
            </span>
          ),
          time: (
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <span>{convertDate(item.addon)}</span>
            </div>
          ),
        }));
        setCurrentPage(response.data.page);
        setTotalPage(response.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingHistory(false);
      setIsLoadingMoreHistory(false);
    }

    if (pagination.offset > 0) {
      setHistoriesWithdraw((prev) => [...prev, ...newHistories]);
    } else {
      setHistoriesWithdraw([...newHistories]);
    }

    return newHistories;
  };

  const handleViewMore = () => {
    setPaginations({ limit: limit, offset: offset + limit });
  };

  useEffect(() => {
    if (isShowDepositHistory) {
      getDepositHistory({ limit, offset });
      return;
    }
    getWithdrawHistory({ limit, offset });
  }, [isShowDepositHistory, offset]);

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
              4
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

  const handleCopy = (value) => {
    navigator.clipboard
      .writeText(value)
      .then(() => toast(`${i18next.t("copiedToClipboard")}`), {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  };

  useEffect(() => {
    getListToken();
  }, []);

  const handleSwitchTab = (value) => {
    setTotalPage(0);
    setPaginations({ limit: limit, offset: 0 });
    setIsShowDepositHistory(value);
  };

  useEffect(() => {
    (async () => {
      const response = await gameService.getGameBalance("plinko");
      if (response.success) {
        setGameBalance(Number(response.data.gameBalance));
      }
    })();
  }, []);

  return (
    <PortfolioWrapper>
      <PortfolioBoxBorder style={{ color: theme.color }} border={theme.border}>
        <div>
          <div
            style={{
              color: theme.color,
              fontSize: "20px",
              fontWeight: 700,
              marginBottom: "12px",
            }}
          >
            {i18next.t("portfolio.gameBalance")}
          </div>
          <SelectCustom
            isLoading={isLoading}
            listItem={listToken}
            currentItem={currentToken}
            onChange={(newItem) => {
              setCurrentToken(newItem);
            }}
          />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>{i18next.t("portfolio.balance")}</span>
            <span> {customFormat(gameBalance, 2)}</span>
          </div>
        </div>
      </PortfolioBoxBorder>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <SwitchWrapper bg={theme.tweetHov}>
            <SwitchItem
              color={!isShowDepositHistory && theme.color}
              bg={isShowDepositHistory && "#ffff"}
              onClick={() => handleSwitchTab(true)}
            >
              {i18next.t("portfolio.deposit")}
            </SwitchItem>
            <SwitchItem
              color={isShowDepositHistory && theme.color}
              bg={!isShowDepositHistory && "#ffff"}
              onClick={() => handleSwitchTab(false)}
            >
              {i18next.t("portfolio.withdraw")}
            </SwitchItem>
          </SwitchWrapper>
        </div>
        <PortfolioBoxBorder border={theme.border}>
          <span
            style={{
              color: theme.color,
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            {i18next.t("portfolio.transactionHistory")}
          </span>
          {isLoadingHistory ? (
            <Loading style={{ padding: 0 }} color={theme.color} size={10} />
          ) : isShowDepositHistory ? (
            <TableCustom
              isLoadingMore={isLoadingMoreHistory}
              columns={columnsDeposit}
              data={historiesDeposit}
            />
          ) : (
            <TableCustom
              isLoadingMore={isLoadingMoreHistory}
              columns={columnsWithdraw}
              data={historiesWithdraw}
            />
          )}
          {currentPage < totalPage && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={handleViewMore}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                }}
              >
                {i18next.t("portfolio.viewMore")}
              </Button>
            </div>
          )}
        </PortfolioBoxBorder>
      </div>
    </PortfolioWrapper>
  );
}

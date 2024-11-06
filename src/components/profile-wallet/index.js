import { Col, Row } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import { toast } from "react-toastify";
import { SET_USER } from "../../redux/actions";
import { authService } from "../../services/AuthService";
import { transactionService } from "../../services/TransactionService";
import { customFormat } from "../../utils/Number";
import { ArrowLeftBottom } from "../core/icons/ArrowLeftBottom";
import { ArrowRight } from "../core/icons/ArrowRight";
import { Clock } from "../core/icons/Clock";
import { CopyIcon } from "../core/icons/CopyIcon";
import { CheckIcon } from "../icons/CheckIcon";
import HeaderBalance from "../layouts/HeaderBalance";
import Loading from "../loading";
import Modal from "../modal";
import { ProfileCorner } from "../styles/common";
import { PeopleFlex } from "../styles/profile";
import { Button, UserImage } from "../styles/profile-wallet";
import ChangePinModal from "./ChangePinModal";
import CryptoTokens from "./CryptoTokens";
import { ExportPrivateKey } from "./ExportPrivateKey";
import { HistoryTable } from "./HistoryTable";
import SetUpPinModal from "./SetUpPin";
import TransferModal from "./TransferModal";
import Tabs from "../tabs";
import { ACCOUNT_TYPE } from "../../constants";
import i18next from "i18next";

const tabList = [
  {
    name: "personal-accounts",
    title: `${i18next.t("profileWallet.personalAccounts")}`,
    path: "/profile-wallet",
  },
  {
    name: "company-accounts",
    title: `${i18next.t("profileWallet.companyAccounts")}`,
    path: "/profile-wallet?tabs=company-accounts",
  },
];

const ProfileWallet = () => {
  const [transferHistory, setTransferHistory] = useState([]);
  const [headerText, setHeaderText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenHistory, setIsModalOpenHistory] = useState(false);
  const [isModalPinOpen, setIsModalPinOpen] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const query = new URLSearchParams(useLocation().search).get("tabs");
  const accountType =
    query === "company-accounts"
      ? ACCOUNT_TYPE.INVESTMENT
      : ACCOUNT_TYPE.NORMAL;

  const user = useSelector((state) => state.profile.user);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [{ offset, limit }, setPaginations] = useState({
    offset: 0,
    limit: 10,
  });

  const [totalCount, setTotalCount] = useState(0);

  const getUserProfile = async () => {
    const userProfile = await authService.getProfile();
    dispatch({
      type: SET_USER,
      payload: { ...user, ...userProfile.data },
    });
  };

  const getTransferHistory = async (pagination) => {
    try {
      setIsLoading(true);
      const response = await transactionService.getProfileTrades(
        pagination,
        accountType
      );

      if (response.success && response.data.rows) {
        setTransferHistory(response.data.rows);
        setTotalCount(response.data.total);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleRenderTabs = () => {
    switch (query) {
      case "company-accounts":
        return (
          <HistoryTable
            transferHistory={transferHistory}
            fetchTransferHistory={getTransferHistory}
            totalCount={totalCount}
            isLoading={isLoading}
            companyAccount={true}
          />
        );
      default:
        return (
          <HistoryTable
            transferHistory={transferHistory}
            fetchTransferHistory={getTransferHistory}
            totalCount={totalCount}
            isLoading={isLoading}
          />
        );
    }
  };

  const hashWalletAddress = useMemo(() => {
    if (user.walletAddress) {
      return (
        user.walletAddress.slice(0, 4) + "..." + user.walletAddress.slice(-4)
      );
    }
    return "";
  }, [user]);

  useEffect(() => {
    document.title = "Wallet / Weknot.io";
    getUserProfile();
  }, [isRefresh]);

  useEffect(() => {
    getTransferHistory({
      offset,
      limit,
    });
  }, [isRefresh, accountType]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(user.walletAddress)
      .then(() => toast(`${i18next.t("copiedToClipboard")}`), {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  };

  if (user === null) return <Loading />;

  const toggleOpen = () => {
    setIsModalOpenHistory(!isModalOpenHistory);
  };

  return (
    <React.Fragment>
      {/* MODAL TRANSFER */}
      <TransferModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        handleRefresh={() => setIsRefresh(!isRefresh)}
        userInfo={user}
      />
      {/* MODAL TRANSFER */}
      {/* MODEL SET UP PIN */}
      {user.isPinSet ? (
        <ChangePinModal isOpen={isModalPinOpen} setIsOpen={setIsModalPinOpen} />
      ) : (
        <SetUpPinModal
          handleRefresh={() => setIsRefresh(!isRefresh)}
          isOpen={isModalPinOpen}
          setIsOpen={setIsModalPinOpen}
        />
      )}
      {isModalOpenHistory && (
        <Modal
          toggleOpen={toggleOpen}
          children={
            <div>
              <Tabs tabList={tabList} pathDefault={"personal-accounts"} />
              {handleRenderTabs()}
            </div>
          }
          handleClose={() => setIsModalOpenHistory(false)}
          padding="24px 16px"
          heading={i18next.t("profileWallet.transactionHistory")}
          widthModal="50%"
        />
      )}

      {/* MODEL CHANGE UP PIN */}
      <ProfileCorner border={theme.border}>
        <HeaderBalance title={i18next.t("profileWallet.myAccount")} backButton />
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <PeopleFlex hover border={theme.border} tweetHov={theme.tweetHov}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <UserImage src={user?.profile_image_url} />
                <div>
                  <div
                    style={{
                      color: `${theme.color}`,
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    {user.fullname}
                  </div>
                  <div style={{ color: `#657786` }}>
                    @{user.twitterScreenName}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end",
                  alignItems: "end",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    color: `${theme.color}`,
                    fontSize: "18px",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    {customFormat(user.balance, 7)}&nbsp;BNB
                  </span>
                </div>
                <div
                  style={{
                    color: `#657786`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                  onClick={handleCopy}
                >
                  {hashWalletAddress}{" "}
                  <div style={{ width: "18px" }}>
                    <CopyIcon color={theme.color} />
                  </div>
                </div>
                <Button
                  style={{
                    padding: "4px 8px",
                    background: "#94A3B8",
                    borderRadius: "20px",
                    color: theme.color,
                  }}
                  onClick={() => setIsModalPinOpen(!isModalPinOpen)}
                >
                  {user.isPinSet ? `${i18next.t("profileWallet.changePIN")}` : `${i18next.t("profileWallet.setUpPIN")}`}
                </Button>
              </div>
            </div>
          </PeopleFlex>
          <Row>
            <Col span={8}>
              <Link
                to={"/deposit"}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: "5px",
                  flexDirection: "column",
                }}
              >
                <div style={{ width: "30px" }}>
                  <ArrowLeftBottom color={theme.color} />
                </div>
                <p
                  style={{
                    lineHeight: "1.5rem",
                    fontSize: "16px",
                    color: theme.color,
                  }}
                >
                  {i18next.t("profileWallet.receive")}
                </p>
              </Link>
            </Col>
            <Col span={8}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: "5px",
                  flexDirection: "column",
                }}
                onClick={() => {
                  !user.isPinSet &&
                    toast(`${i18next.t("setUpPINBeforeTransfer")}`, {
                      type: "error",
                      autoClose: 2000,
                      closeOnClick: true,
                    });
                  setIsModalOpen(user.isPinSet);
                }}
              >
                <div style={{ width: "30px" }}>
                  <ArrowRight color={theme.color} />
                </div>
                <p
                  style={{
                    lineHeight: "1.5rem",
                    fontSize: "16px",
                    color: theme.color,
                  }}
                >
                  {i18next.t("profileWallet.transfer")}
                </p>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: "5px",
                  flexDirection: "column",
                }}
                onClick={() => setIsModalOpenHistory(true)}
              >
                <div style={{ width: "30px" }}>
                  <Clock color={theme.color} />
                </div>
                <p
                  style={{
                    lineHeight: "1.5rem",
                    fontSize: "16px",
                    color: theme.color,
                  }}
                >
                  {i18next.t("profileWallet.history")}
                </p>
              </div>
            </Col>
          </Row>
          <div style={{ padding: "24px 16px" }}>
            <CryptoTokens />
          </div>
          <div
            style={{
              padding: "0px 10px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div>
                <CheckIcon />
              </div>
              <span style={{ color: `${theme.color}`, fontSize: "16px" }}>
                <b>{i18next.t("profileWallet.earnAsPeopleTradeTitle")}</b>: {i18next.t("profileWallet.earnAsPeopleTradeContent")}
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div>
                <CheckIcon />
              </div>
              <span style={{ color: `${theme.color}`, fontSize: "16px" }}>
                <b>{i18next.t("profileWallet.earnAsYourConnectionTradeTitle")}</b>: {i18next.t("profileWallet.earnAsYourConnectionTradeTitle")}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "96%",
            margin: "20px auto 0px auto",
            border: "2px solid #E6ECF0",
          }}
        />
        <ExportPrivateKey />
      </ProfileCorner>
    </React.Fragment>
  );
};

export default ProfileWallet;

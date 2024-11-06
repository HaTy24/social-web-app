import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { ERR_CODE, TRANSACTION_ACTIONS, getStaticURL } from "../../constants";
import { transactionService } from "../../services/TransactionService";
import { voteService } from "../../services/VoteService";
import { customFormat } from "../../utils/Number";
import Icon from "../icon";
import { InfoIcon } from "../icons/InfoIcon";
import { PriceIcon } from "../icons/PriceIcon";
import Loading from "../loading";
import EnterPinModal from "../profile-wallet/EnterPinModal";
import { Header, NavbarUserBalance, ProfileCorner } from "../styles/common";
import { BackBtn, UserImage } from "../styles/profile";
import { VoteItem } from "./voteItem";
import { userService } from "../../services/UserService";
import { ButtonValidatePIN } from "../buy-sell/ButtonValidatePIN";
import { SET_UPDATE } from "../../redux/actions";
import i18next from "i18next";

function VoteDetail() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const [voteInfo, setVoteInfo] = useState(null);
  const [voteEarned, setVoteEarned] = useState(null);
  const [isBuyDisabled, setIsBuyDisabled] = useState(false);
  const [isSellDisabled, setIsSellDisabled] = useState(false);
  const user = useSelector((state) => state.profile.user);
  const { userId } = useParams();
  const history = useHistory();
  const [votesCount, setVotesCount] = useState(0);
  const [isShowModalEnterPin, setIsShowModalEnterPin] = useState(false);
  const [transactionAction, setTransactionAction] = useState("");

  const backIconPaths = [
    "M20 11H7.414l4.293-4.293c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0l-6 6c-.39.39-.39 1.023 0 1.414l6 6c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L7.414 13H20c.553 0 1-.447 1-1s-.447-1-1-1z",
  ];
  const [liveBNBBalance, setLiveBNBBalance] = useState({});

  const getLiveBNB = async () => {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=BTC,USD,EUR"
    );
    setLiveBNBBalance(response.data);
  };

  const handleBuySubmitPin = async (pin) => {
    setIsShowModalEnterPin(false);
    if (transactionAction === TRANSACTION_ACTIONS.BUY_SHARES) {
      await handleBuyVote(pin);
    }
    if (transactionAction === TRANSACTION_ACTIONS.SELL_SHARES) {
      await handleSellVote(pin);
    }
  };

  const getVoteInfo = async () => {
    try {
      const response = await voteService.getVoteInfo(userId);
      if (response.success) {
        setVoteInfo(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getVoteEarned = async () => {
    try {
      const response = await voteService.getVoteEarned(userId);
      if (response.success) {
        setVoteEarned(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRelationships = async () => {
    const response = await userService.getRelationships(user.id);
    if (response.success) {
      setVotesCount(
        response.data.holdingAddresses.find((holding) => holding.id === userId)
          ?.sharesCount || 0
      );
    }
  };

  useEffect(() => {
    getVoteInfo();
    getLiveBNB();
    getVoteEarned();
    getRelationships();
  }, []);

  if (!user || !voteInfo || !voteEarned)
    return (
      <div style={{ height: "100vh", backgroundColor: theme.bg }}>
        <Loading />
      </div>
    );

  const handleBuyVote = async (pin) => {
    setIsBuyDisabled(true);
    const result = await Swal.fire({
      background: theme.tweetHov,
      title: `<h3 style='color:${theme.color}'>` + `${i18next.t('votes.areYouSure')}` + "</h3>",
      html: `
        <span>${i18next.t("votes.youWillBuy")} </span> <span style="font-weight: bold; font-size: 20px">${
          voteInfo.fullname
        }</span> ${i18next.t("votes.vote")}
        <div style="margin-top: 20px">
          <span>${i18next.t('votes.withPrice')} </span>
          <span style="color: green; font-size: 20px">${customFormat(
            voteInfo?.share?.buyPrice,
            8
          )} BNB</span>
        </div>`,
      icon: "warning",
      color: theme.color,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: i18next.t("buy"),
      cancelButtonText: i18next.t("cancel"),
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      const response = await transactionService.buy(voteInfo.id, pin);
      if (response.success) {
        Swal.fire({
          color: theme.color,
          title: i18next.t("votes.buyVoteSuccessful"),
          text: i18next.t("votes.yourTransactionWillBeCompletedInAFewMinutes"),
          icon: "success",
          background: theme.tweetHov,
        });
        setVotesCount((prev) => prev + 1);
        dispatch({ type: SET_UPDATE });
      } else {
        Swal.fire({
          color: theme.color,
          title: i18next.t("votes.buyVoteFailed"),
          text:
            response.code === ERR_CODE.INVALID_PIN
              ? `${i18next.t("votes.oopsYouveEnteredAnIncorrectPinNumberYouHave")} ${response.data.attemptsLeft} ${i18next.t("votes.attemptsLeftToRetry")}`
              : "",
          icon: "error",
          background: theme.tweetHov,
          confirmButtonColor: "#3085d6",
        });
        if (response.code === ERR_CODE.INVALID_PIN)
          setIsShowModalEnterPin(true);
      }
    }
    setIsBuyDisabled(false);
  };

  const handleSellVote = async (pin) => {
    setIsSellDisabled(true);
    const result = await Swal.fire({
      background: theme.tweetHov,
      title: `<h3 style='color:${theme.color}'>` + i18next.t("votes.areYouSure") + "</h3>",
      html: `
        <span>You will sell </span> <span style="font-weight: bold; font-size: 20px">${
          voteInfo.fullname
        }</span> vote
        <div style="margin-top: 20px">
          <span>${i18next.t('votes.withPrice')} </span>
          <span style="color: red; font-size: 20px">${customFormat(
            voteInfo?.share?.sellPrice,
            8
          )} BNB</span>
        </div>`,
      icon: "warning",
      color: theme.color,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `${i18next.t("votes.sell")}`,
      cancelButtonText: i18next.t("votes.cancel"),
      reverseButtons: true,
      focusCancel: true,
    });
    if (result.isConfirmed) {
      const response = await transactionService.sell(voteInfo.id, pin);
      if (response.success) {
        Swal.fire({
          color: theme.color,
          title: i18next.t("votes.sellVoteSuccessful"),
          text:i18next.t("votes.yourTransactionWillBeCompletedInAFewMinutes"),
          icon: "success",
          background: theme.tweetHov,
        });
        setVotesCount((prev) => prev - 1);
        dispatch({ type: SET_UPDATE });
      } else {
        Swal.fire({
          color: theme.color,
          title:i18next.t("votes.sellVoteFailed"),
          text:
            response.code === ERR_CODE.INVALID_PIN
              ?  `${i18next.t("votes.oopsYouveEnteredAnIncorrectPinNumberYouHave")} ${response.data.attemptsLeft} ${i18next.t("votes.attemptsLeftToRetry")}`
              : "",
          icon: "error",
          background: theme.tweetHov,
          confirmButtonColor: "#3085d6",
        });
        if (response.code === ERR_CODE.INVALID_PIN)
          setIsShowModalEnterPin(true);
      }
    }
    setIsSellDisabled(false);
  };

  return (
    <ProfileCorner border={theme.border}>
      <Header border={theme.border} bg={theme.bg} color={theme.color}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BackBtn onClick={history.goBack}>
              <Icon
                d={backIconPaths}
                width="22.5px"
                height="22.5px"
                fill="rgb(29, 161, 242)"
              />
            </BackBtn>
            <h2>${i18next.t('votes.title')}</h2>
          </div>
          <NavbarUserBalance style={{ paddingRight: "0px" }}>
            <Link
              to="/profile-wallet"
              style={{ display: "flex", alignItems: "center" }}
            >
              <span style={{ fontWeight: "bold", color: "black" }}>
                {customFormat(user.balance, 7)}
                &nbsp;BNB
              </span>
              <UserImage
                style={{ width: "20px", height: "20px", margin: "5px" }}
                src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
              />
            </Link>
          </NavbarUserBalance>
        </div>
      </Header>
      <div
        style={{
          marginTop: "20px",
          padding: "0 20px",
        }}
      >
        <VoteItem
          imageUrl={voteInfo?.profile_image_url}
          fullname={voteInfo.fullname}
          userName={voteInfo.twitterScreenName}
          holders={voteInfo.shared}
          amount={voteInfo.amount}
          realAmount={voteInfo.realAmount}
          hidePrice
        />
      </div>
      <div>
        <div
          style={{
            color: `${theme.color}`,
            display: "flex",
            justifyContent: "space-between",
            border: `1px solid ${theme.border}`,
            margin: "20px",
            padding: "18px",
            borderRadius: "10px",
          }}
        >
          <div style={{ fontSize: "18px" }}>{i18next.t("votes.unclaimedValue")}</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                {customFormat(voteEarned?.subjectFee, 8)}
              </span>
              <PriceIcon color={theme.color} />
            </div>
            <div
              style={{ color: "#999", textAlign: "right", fontSize: "14px" }}
            >
              ${customFormat(liveBNBBalance?.USD * voteEarned?.subjectFee, 8)}
            </div>
          </div>
        </div>
        <div
          style={{
            color: `${theme.color}`,
            border: `1px solid ${theme.border}`,
            margin: "20px",
            padding: "18px",
            borderRadius: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "18px" }}>{i18next.t("votes.buyVote")}</div>
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "7px" }}
              >
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                  {customFormat(voteInfo?.share?.buyPrice, 8)} BNB
                </span>
                <PriceIcon color={theme.color} />
              </div>
              <div
                style={{ color: "#999", textAlign: "right", fontSize: "14px" }}
              >
                $
                {customFormat(
                  liveBNBBalance.USD * voteInfo?.share?.buyPrice,
                  8
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <div style={{ fontSize: "18px" }}>{i18next.t("votes.sellVote")}</div>
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "7px" }}
              >
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                  {customFormat(voteInfo?.share?.sellPrice, 8)} BNB
                </span>
                <PriceIcon color={theme.color} />
              </div>
              <div
                style={{ color: "#999", textAlign: "right", fontSize: "14px" }}
              >
                $
                {customFormat(
                  liveBNBBalance.USD * voteInfo?.share?.sellPrice,
                  8
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: "1.5rem",
              color: "#3B81F6",
              fontWeight: 600,
              padding: "5px 10px",
              backgroundColor: "#EFEFEF",
              borderRadius: "10px",
            }}
          >
            {i18next.t("votes.youOwn")} {votesCount} {votesCount > 1 ? i18next.t("votes.title") : i18next.t('votes.vote')}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <ButtonValidatePIN
              handleTradeShare={() => {
                setIsShowModalEnterPin(true);
                setTransactionAction(TRANSACTION_ACTIONS.BUY_SHARES);
              }}
              text={i18next.t("votes.buyVote")}
              rotateColor="#000"
              isDisable={isBuyDisabled || !user?.isPinSet}
              isLoading={isBuyDisabled}
              style={{
                borderRadius: "8px",
                width: "50%",
                padding: "10px 0",
                color: `${theme.bg}`,
                backgroundColor: `${theme.color}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
                gap: "5px",
              }}
            />
            <ButtonValidatePIN
              handleTradeShare={() => {
                setIsShowModalEnterPin(true);
                setTransactionAction(TRANSACTION_ACTIONS.SELL_SHARES);
              }}
              text={i18next.t("votes.sellVote")}
              isDisable={isSellDisabled || !user?.isPinSet || votesCount <= 0}
              isLoading={isSellDisabled}
              style={{
                borderRadius: "8px",
                width: "50%",
                padding: "10px 0",
                color: `${theme.color}`,
                backgroundColor: `${theme.bg}`,
                border: `1px solid ${theme.color}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
                gap: "5px",
              }}
            />
          </div>
        </div>
        <div
          style={{
            color: `${theme.color}`,
            border: `1px solid ${theme.border}`,
            margin: "20px",
            padding: "18px",
            borderRadius: "10px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <div style={{ width: "24px" }}>
            <InfoIcon />
          </div>
          <div style={{ color: "#999" }}>
           {i18next.t("votes.beforeACreatorJoinsWeknotIo")}
          </div>
        </div>
      </div>
      <EnterPinModal
        isOpen={isShowModalEnterPin}
        setIsOpen={setIsShowModalEnterPin}
        onSubmit={handleBuySubmitPin}
      />
    </ProfileCorner>
  );
}

export default VoteDetail;

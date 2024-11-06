import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import {
  ERR_CODE,
  TRANSACTION_ACTIONS,
  getStaticURL,
  ACCOUNT_TYPE,
} from "../../constants/index";
import { authService } from "../../services/AuthService";
import { transactionService } from "../../services/TransactionService";
import { customFormat, removeTrailingZeros } from "../../utils/Number";
import { CheckIcon } from "../icons/CheckIcon";
import Loading from "../loading";
import EnterPinModal from "../profile-wallet/EnterPinModal.js";
import ProfileHeader from "../profileHeader";
import { ProfileCorner } from "../styles/common";
import { User, UserBalance, UserImage } from "../styles/profile";
import { userService } from "../../services/UserService";
import { ButtonValidatePIN } from "./ButtonValidatePIN";
import HeaderBalance from "../layouts/HeaderBalance.js";
import { YellowTick } from "../icons/YellowTick.js";

import { ModalBuyCustomQuantity } from "./ModalBuyCustomQuantity.js";
import { ModalSellCustomQuantity } from "./ModalSellCustomQuantity.js";
import { SET_UPDATE } from "../../redux/actions.js";
import { Link } from "react-router-dom/cjs/react-router-dom.js";
import i18next from "i18next";

const BuySell = () => {
  const dispatch = useDispatch();
  const [isBuyLoading, setIsBuyLoading] = useState(false);
  const [isSellLoading, setIsSellLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useSelector((state) => state.theme);
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const user = useSelector((state) => state.profile.user);
  const [sharesCount, setSharesCount] = useState(0);
  const [transactionAction, setTransactionAction] = useState("");
  const [isShowModalEnterPin, setIsShowModalEnterPin] = useState(false);
  const [isShowModalCustomQuantity, setIsShowModalCustomQuantity] =
    useState(false);
  const [quantityInput, setQuantityInput] = useState(1);
  const [liveBNBBalance, setLiveBNBBalance] = useState(null);

  const getUserInfo = async () => {
    setIsLoading(true);
    const response = await authService.getUserInfo(id);
    if (response.success) {
      setUserInfo(response.data);
    }
    setIsLoading(false);
  };

  const getRelationships = async () => {
    const response = await userService.getRelationships(user.id);
    if (response.success) {
      setSharesCount(
        response.data.holdingAddresses.find((holding) => holding.id === id)
          ?.sharesCount || 0
      );
    }
  };
  const getLiveBNB = async () => {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=BTC,USD,EUR"
    );
    setLiveBNBBalance(response.data);
  };

  useEffect(() => {
    getUserInfo();
    getRelationships();
    getLiveBNB();
  }, [id]);
  const handleConfirmBuyShare = async () => {
    const result = await Swal.fire({
      background: theme.tweetHov,
      title: `<h3 style='color:${theme.color}'>` + `${i18next.t("buyShare.areYouSure")}` + "</h3>",
      html: `
        <span>${i18next.t("buyShare.youWillBuy")} ${quantityInput} ${i18next.t("buyShare.shareOf")} </span> <span style="font-weight: bold; font-size: 20px">${
        userInfo.fullname
      }</span>
        <div style="margin-top: 20px">
          <span>${i18next.t("buyShare.withPrice")} </span>
          <span style="color: green; font-size: 20px">${removeTrailingZeros(
            customFormat(Number(userInfo?.share?.buyPrice) * quantityInput, 8)
          )} BNB</span>
        </div>`,
      icon: "warning",
      color: theme.color,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `${i18next.t("buyShare.buy")}`,
      cancelButtonText: `${i18next.t("buyShare.cancel")}`,
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      setIsShowModalEnterPin(true);
    }
  };

  const handleConfirmSellShare = async () => {
    const result = await Swal.fire({
      background: theme.tweetHov,
      title: `<h3 style='color:${theme.color} ; line-height:0.7'> ${i18next.t("buyShare.areYouSure")} </h3> `,
      html: `
      <span>${i18next.t("buyShare.youWillSell")} ${quantityInput} ${i18next.t("buyShare.shareOf")} </span> <span style="font-weight: bold; font-size: 20px">${
        userInfo.fullname
      }</span>
       ${
         quantityInput == sharesCount
           ? `<h6 style='color:red ; font-size:18px; margin-top:8px'>${i18next.t("buyShare.textSellAllShares")} ${userInfo.fullname} ${i18next.t("buyShare.willBePermanentlyDeleted")}</h6>`
           : ""
       }
        <div style="margin-top: 20px">
          <span>${i18next.t("buyShare.withPrice")} </span>
          <span style="color: red; font-size: 20px">${removeTrailingZeros(
            customFormat(userInfo?.share?.sellPrice, 8)
          )} BNB</span>
        </div>`,
      icon: "warning",
      color: theme.color,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `${i18next.t("buyShare.sell")}`,
      cancelButtonText: `${i18next.t("buyShare.cancel")}`,
      reverseButtons: true,
      focusCancel: true,
    });
    if (result.isConfirmed) {
      setIsShowModalEnterPin(true);
    }
  };

  const handleBuyShare = async (pin) => {
    setIsBuyLoading(true);
    try {
      const response = await transactionService.buy(
        id,
        pin,
        Number(quantityInput)
      );

      if (response.success) {
        Swal.fire({
          color: theme.color,
          title: `${i18next.t("buyShareSuccessful")}`,
          text: `${i18next.t("yourTransactionWillBeCompletedInAFewMinutes")}`,
          icon: "success",
          background: theme.tweetHov,
        });
        setSharesCount((prev) => prev + Number(quantityInput));
        dispatch({ type: SET_UPDATE });
      } else {
        Swal.fire({
          color: theme.color,
          title: `${i18next.t("buyShareFail")}`,
          text:
            response.code === ERR_CODE.INVALID_PIN
              ? `${i18next.t("incorrectPINError")} ${response.data.attemptsLeft} ${i18next.t("attemptsLeftToRetry")}`
              : "",
          icon: "error",
          background: theme.tweetHov,
          confirmButtonColor: "#3085d6",
        });
        if (response.code === ERR_CODE.INVALID_PIN)
          setIsShowModalEnterPin(true);
      }
    } catch (error) {
      setIsBuyLoading(false);
    }
    setQuantityInput(1);
    setIsBuyLoading(false);
  };

  const handleSellShare = async (pin) => {
    setIsSellLoading(true);
    try {
      const response = await transactionService.sell(
        id,
        pin,
        Number(quantityInput)
      );
      if (response.success) {
        Swal.fire({
          color: theme.color,
          title: `${i18next.t("sellShareSuccessful")}`,
          text: `${i18next.t("yourTransactionWillBeCompletedInAFewMinutes")}`,
          icon: "success",
          background: theme.tweetHov,
        });
        setSharesCount((prev) => prev - Number(quantityInput));
        dispatch({ type: SET_UPDATE });
      } else {
        Swal.fire({
          color: theme.color,
          title: `${i18next.t("sellShareFailed")}`,
          text:
            response.code === ERR_CODE.INVALID_PIN
              ? `${i18next.t("incorrectPINError")} ${response.data.attemptsLeft} ${i18next.t("attemptsLeftToRetry")}`
              : "",
          icon: "error",
          background: theme.tweetHov,
          confirmButtonColor: "#3085d6",
        });
        if (response.code === ERR_CODE.INVALID_PIN)
          setIsShowModalEnterPin(true);
      }
    } catch (error) {
      setIsSellLoading(false);
    }
    setQuantityInput(1);
    setIsSellLoading(false);
  };

  const handleSubmitPin = async (pin) => {
    setIsShowModalEnterPin(false);
    if (transactionAction === TRANSACTION_ACTIONS.BUY_SHARES) {
      await handleBuyShare(pin);
    }
    if (transactionAction === TRANSACTION_ACTIONS.SELL_SHARES) {
      await handleSellShare(pin);
    }
  };

  if (userInfo === null || isLoading)
    return (
      <div style={{ height: "100vh", backgroundColor: theme.bg }}>
        <Loading />
      </div>
    );

  return (
    <>
      <div>
        <ProfileCorner border={theme.border}>
          <HeaderBalance title={`${i18next.t("buyShare.buy")} ${userInfo.fullname}`} backButton />
          <div style={{ padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <User>
                <UserImage src={userInfo?.profile_image_url} />
                <UserBalance>
                  <span>{customFormat(userInfo?.share?.buyPrice ? userInfo?.share?.buyPrice : 0, 3)}</span>
                  <img
                    src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
                    alt="discord"
                  />
                </UserBalance>
              </User>
              <div>
                <div
                  style={{
                    color: `${theme.color}`,
                    fontSize: "20px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {userInfo.fullname}
                  {userInfo.accountType === ACCOUNT_TYPE.INVESTMENT && (
                    <YellowTick />
                  )}
                </div>
                {/* <div style={{ color: "#999" }}>
                {holders} holders {holdings} holdings
              </div> */}
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
              {i18next.t("buyShare.youOwn")} {sharesCount} {sharesCount > 1 ? `${i18next.t("buyShare.shares")}` : `${i18next.t("buyShare.share")}`}
            </div>
            <div
              style={{
                margin: "18px 0",
                fontSize: "16px",
                color: "#999",
              }}
            >
              {i18next.t("buyShare.whatYouWillGet")}
            </div>
            <div
              style={{
                borderRadius: "10px",
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
                {i18next.t("buyShare.benefits")}
              </div>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <div>
                  <CheckIcon />
                </div>
                <span style={{ color: `${theme.color}`, fontSize: "16px" }}>
                  <b>{i18next.t("buyShare.exclusiveAccessTitle")}</b>: {i18next.t("buyShare.exclusiveAccessContent")}
                </span>
              </div>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <div>
                  <CheckIcon />
                </div>
                <span style={{ color: `${theme.color}`, fontSize: "16px" }}>
                  <b>{i18next.t("buyShare.flexibleProfitRealisationTitle")}</b>: {i18next.t("buyShare.flexibleProfitRealisationContent")}
                </span>
              </div>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <div>
                  <CheckIcon />
                </div>
                <span style={{ color: `${theme.color}`, fontSize: "16px" }}>
                  {i18next.t("buyShare.earnRewardPoints")}
                </span>
              </div>
            </div>
            {userInfo.accountType === ACCOUNT_TYPE.INVESTMENT && (
              <div>
                <div
                  style={{
                    color: `${theme.color}`,
                    fontSize: "16px",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  {i18next.t("buyShare.policy")}
                </div>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <div>
                    <CheckIcon />
                  </div>
                  <span style={{ color: `${theme.color}`, fontSize: "16px" }}>
                    {i18next.t("buyShare.sharePriceIncludesAnAdditional")}{" "}
                    <b>{userInfo?.share?.txFee || 0.025} BNB</b>
                  </span>
                </div>
              </div>
            )}
            <div
              style={{
                margin: "18px 0",
                fontSize: "16px",
                color: "#999",
              }}
            >
              {i18next.t("buyShare.sharePrice")}
              {!user?.isPinSet && (
                <div
                  style={{
                    padding: "10px",
                    border: "1px solid  #444",
                    borderRadius: "10px",
                    color: theme.color,
                    marginTop: "10px",
                    textAlign: "center",
                  }}
                >
                  <small style={{ color: "red", fontSize: "18px" }}> * </small>
                  {i18next.t("buyShare.sharePrice")}
                  <Link to={"/profile-wallet"}>"{i18next.t("buyShare.here")}"</Link> 
                  {i18next.t("buyShare.toWalletSettings")}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                border: "1px solid #444",
                borderRadius: "10px",
              }}
            >
              <div style={{ borderRight: "1px solid #444", width: "50%" }}>
                <div
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      color: "#999",
                      fontWeight: 600,
                    }}
                  >
                    {i18next.t("buyShare.buyPrice")}
                  </span>
                  <h2
                    style={{ color: "#11B981", margin: 0, textAlign: "center" }}
                  >
                    {removeTrailingZeros(
                      customFormat(userInfo?.share?.buyPrice, 8)
                    )}{" "}
                    BNB
                  </h2>
                </div>
              </div>
              <div style={{ borderLeft: "1px solid #444", width: "50%" }}>
                <div
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      color: "#999",
                      fontWeight: 600,
                    }}
                  >
                    {i18next.t("buyShare.sellPrice")}
                  </span>
                  <h2
                    style={{ color: "#F43F5E", margin: 0, textAlign: "center" }}
                  >
                    {removeTrailingZeros(
                      customFormat(userInfo?.share?.sellPrice, 8)
                    )}{" "}
                    BNB
                  </h2>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
              <ButtonValidatePIN
                handleTradeShare={async () => {
                  if (
                    !userInfo.accountType ||
                    userInfo.accountType == ACCOUNT_TYPE.NORMAL
                  ) {
                    setTransactionAction(TRANSACTION_ACTIONS.BUY_SHARES);
                    await handleConfirmBuyShare();

                    return;
                  }
                  setTransactionAction(TRANSACTION_ACTIONS.BUY_SHARES);
                  setIsShowModalCustomQuantity(true);
                }}
                text={i18next.t("buy")}
                isDisable={isBuyLoading}
                isLoading={isBuyLoading}
                bgColor="#11B981"
                opacity
              />
              <ButtonValidatePIN
                handleTradeShare={async () => {
                  if (userInfo.accountType == ACCOUNT_TYPE.NORMAL) {
                    setTransactionAction(TRANSACTION_ACTIONS.SELL_SHARES);
                    await handleConfirmSellShare();

                    return;
                  }
                  setIsShowModalCustomQuantity(true);
                  setTransactionAction(TRANSACTION_ACTIONS.SELL_SHARES);
                }}
                text={i18next.t("sell")}
                isDisable={isSellLoading || sharesCount <= 0}
                isLoading={isSellLoading}
                bgColor="#F43F5E"
                opacity
              />
            </div>
          </div>
          {isShowModalCustomQuantity &&
            (transactionAction === TRANSACTION_ACTIONS.BUY_SHARES ? (
              <ModalBuyCustomQuantity
                userInfo={userInfo}
                quantityInput={quantityInput}
                setQuantityInput={setQuantityInput}
                liveBNBBalance={liveBNBBalance}
                isBuyLoading={isBuyLoading}
                onClose={() => {
                  setQuantityInput(1);
                  setIsShowModalCustomQuantity(false);
                }}
                handleSubmit={async () => {
                  setIsShowModalCustomQuantity(false);
                  setTransactionAction(TRANSACTION_ACTIONS.BUY_SHARES);
                  await handleConfirmBuyShare();
                }}
              />
            ) : (
              <ModalSellCustomQuantity
                userInfo={userInfo}
                quantityInput={quantityInput}
                setQuantityInput={setQuantityInput}
                liveBNBBalance={liveBNBBalance}
                isBuyLoading={isBuyLoading}
                max={sharesCount}
                onClose={() => {
                  setQuantityInput(1);
                  setIsShowModalCustomQuantity(false);
                }}
                handleSubmit={async () => {
                  setIsShowModalCustomQuantity(false);
                  setTransactionAction(TRANSACTION_ACTIONS.SELL_SHARES);
                  await handleConfirmSellShare();
                }}
              />
            ))}
        </ProfileCorner>
      </div>
      <EnterPinModal
        isOpen={isShowModalEnterPin}
        setIsOpen={setIsShowModalEnterPin}
        onSubmit={handleSubmitPin}
      />
    </>
  );
};

export default BuySell;

import { Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ERR_CODE,
  EVENT_TRANSFER,
  LIST_TOKEN,
  getStaticURL,
} from "../../constants";
import { SET_UPDATE } from "../../redux/actions";
import { transactionService } from "../../services/TransactionService";
import { userService } from "../../services/UserService";
import {
  convertBalanceDecimalToNumber,
  customFormat,
} from "../../utils/Number";
import { SwitchButton } from "../SwitchButton";
import { AsteriskIcon } from "../icons/AsteriskIcon";
import { EyeOffIcon } from "../icons/EyeOffIcon";
import { EyeOnIcon } from "../icons/EyeOnIcon";
import { SuccessIcon } from "../icons/SuccessIcon";
import Loading from "../loading";
import Modal from "../modal";
import SelectCustom from "../select";
import { PeopleDetails, PeopleFlex, UserImage } from "../styles/profile";
import {
  Button,
  ListPin,
  ModalTransfer,
  PinItem,
  PinItemAsterisk,
} from "../styles/profile-wallet";
import SearchUser from "./SearchUser";
import i18next from "i18next";

export default function TransferModal(props) {
  const { isOpen, setIsOpen, handleRefresh, userInfo } = props;
  const theme = useSelector((state) => state.theme);
  const refresh = useSelector((state) => state.update.refresh);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalPinTransferOpen, setIsModalPinTransferOpen] = useState(false);
  const [pinsTransfer, setPinsTransfer] = useState(["", "", "", "", "", ""]);
  const pinTransferRefs = useRef([]);
  const [showPinsTransfer, setShowPinsTransfer] = useState(false);
  const [isOpenModelSuccess, setIsOpenModelSuccess] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [payloadTransfer, setPayloadTransfer] = useState();
  const [currentBalance, setCurrentBalance] = useState(userInfo.balance);
  const [currentEventTransfer, setCurrentEventTransfer] = useState(
    EVENT_TRANSFER.WALLET_ADDRESS
  );
  const [currentSearchUser, setCurrentSearchUser] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [listToken, setListToken] = useState([
    {
      src: `${getStaticURL()}/assets/images/logo-bnb.svg`,
      label: "BNB",
      symbol: "BNB",
      value: userInfo.walletAddress,
      decimals: 18,
    },
  ]);
  const [currentToken, setCurrentToken] = useState({
    src: `${getStaticURL()}/assets/images/logo-bnb.svg`,
    label: "BNB",
    symbol: "BNB",
    value: userInfo.walletAddress,
    decimals: 18,
  });

  const transfer = async (e) => {
    e.preventDefault();
    let toAddress;
    if (currentEventTransfer === EVENT_TRANSFER.WALLET_ADDRESS) {
      toAddress = e.target["toAddress"].value.trim();
    } else {
      toAddress = currentSearchUser.walletAddress;
    }
    const amount = e.target["amount"].value;
    if (!toAddress || !amount) {
      toast(`${i18next.t("fillInAllFields")}`, {
        position: "bottom-center",
        autoClose: 1000,
        closeOnClick: true,
      });
      return;
    }
    if (amount > Number(currentBalance)) {
      toast(`${i18next.t("notEnoughBalance")}`, {
        type: "error",
        position: "bottom-center",
        autoClose: 1000,
        closeOnClick: true,
      });
      return;
    }
    setPayloadTransfer({ amount, toAddress });
    setIsModalPinTransferOpen(true);
    setIsOpen(false);
  };
  const confirmTransfer = async (e) => {
    e.preventDefault();
    try {
      const { amount, toAddress } = payloadTransfer;
      const isValid = validatePin(pinsTransfer);
      if (amount && toAddress && isValid === null) {
        setIsLoading(true);
        const pinNumber = pinsTransfer.join("");
        let response = null;
        if (currentToken.symbol === "BNB") {
          response = await transactionService.transfer(
            amount,
            toAddress,
            pinNumber,
            currentToken.value
          );
        } else {
          response = await transactionService.transferToken(
            amount,
            toAddress,
            pinNumber,
            currentToken.value,
            currentToken.symbol
          );
        }
        if (response.success) {
          setIsLoading(false);
          handleRefresh();
          setIsOpenModelSuccess(true);
          setIsModalPinTransferOpen(false);
          dispatch({ type: SET_UPDATE });
        } else {
          setIsLoading(false);
          setMessageError(null);
          toast(
            response.code === ERR_CODE.INVALID_PIN
              ? `${i18next.t("incorrectPINError")} ${response.data.attemptsLeft} ${i18next.t("attemptsLeftToRetry")}`
              : response.message,
            {
              type: "error",
              position: "bottom-center",
              autoClose: 1000,
              closeOnClick: true,
            }
          );
          handleReset();
        }
        return;
      }
      setMessageError(isValid);
    } catch (error) {
      console.log(error);
    }
  };

  const validatePin = (pinArray) => {
    if (pinArray.some((pin) => pin === "")) {
      return `${i18next.t("profileWallet.enter6DigitsForPIN")}`;
    }
    if (pinArray.some((pin) => isNaN(pin))) {
      return `${i18next.t("profileWallet.PINContainNumbers")}`;
    }
    return null;
  };
  const handlePinChange = (index, value) => {
    if (!isNaN(value) && value.trim().length === 1) {
      const newPins = [...pinsTransfer];
      newPins[index] = value.trim();
      setPinsTransfer(newPins);
      if (index < pinsTransfer.length - 1 && value !== "") {
        pinTransferRefs.current[index + 1].focus();
      }
    }
  };

  const handlePinKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      setPinsTransfer((prevPins) => {
        const newPins = [...prevPins];
        newPins[index] = "";
        return newPins;
      });
      if (index > 0) {
        pinTransferRefs.current[index - 1].focus();
      }
    }
  };
  const handleReset = () => {
    setPinsTransfer(["", "", "", "", "", ""]);
    setMessageError(null);
  };

  useEffect(() => {
    (async () => {
      try {
        const result = await userService.getTokens();
        if (result.success === true) {
          const newTokens = result.data.map((token) => {
            const logoURI = LIST_TOKEN.find(
              (item) => item.symbol == token.symbol
            ).logoURI;
            return {
              value: token.address,
              label: token.name,
              src: logoURI,
              symbol: token.symbol,
              decimals: token.decimals,
            };
          });
          setListToken((prev) => {
            return [...prev, ...newTokens];
          });
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (currentToken.symbol === "BNB") {
      setCurrentBalance(userInfo.balance);
      return;
    }
    (async () => {
      setLoadingBalance(true);
      const result = await userService.getBalanceOfToken(currentToken.value);
      if (result.success == true && result.data) {
        setCurrentBalance(
          convertBalanceDecimalToNumber(
            result.data[0].amount,
            currentToken.decimals
          )
        );
      }
      setLoadingBalance(false);
    })();
  }, [currentToken, refresh, userInfo]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleOpenPinTransfer = () => {
    handleReset();

    setIsModalPinTransferOpen(isModalPinTransferOpen);
  };

  const toggleOpenModalSuccess = () => {
    handleReset();

    setIsOpenModelSuccess(isOpenModelSuccess);
  };

  return (
    <div>
      {isOpen && (
        <Modal
          toggleOpen={toggleOpen}
          children={
            <ModalTransfer>
              <div style={{ padding: "10px 20px 10px 20px" }}>
                <SwitchButton
                  currentValue={currentEventTransfer}
                  setCurrentValue={setCurrentEventTransfer}
                  options={[
                    {
                      value: EVENT_TRANSFER.WALLET_ADDRESS,
                      label: `${i18next.t("profileWallet.toWalletAddress")}`,
                    },
                    {
                      value: EVENT_TRANSFER.ANOTHER_USER,
                      label: `${i18next.t("profileWallet.toAnotherUser")}`,
                    },
                  ]}
                />
              </div>
              <form
                onSubmit={transfer}
                style={{
                  padding: "10px 20px 30px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <p style={{ color: theme.color }}>
                  {i18next.t("profileWallet.transferBNBToAnotherWallet")}
                </p>
                {currentEventTransfer === EVENT_TRANSFER.WALLET_ADDRESS && (
                  <Input
                    id="toAddress"
                    name="toAddress"
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      color: theme.color,
                      padding: "10px",
                    }}
                    bordered={false}
                    placeholder={i18next.t("profileWallet.enterYourDestinationAddress")}
                  />
                )}
                {currentEventTransfer === EVENT_TRANSFER.ANOTHER_USER && (
                  <>
                    <SearchUser setCurrent={setCurrentSearchUser} />
                    {currentSearchUser && (
                      <div style={{ height: "110px" }}>
                        <h2
                          style={{
                            fontWeight: "bold",
                            fontSize: "medium",
                            color: theme.color,
                          }}
                        >
                          {i18next.t("profileWallet.transferTo")}
                        </h2>
                        <PeopleFlex
                          style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                          }}
                          tweetHov={theme.tweetHov}
                          bg={theme.bg}
                        >
                          <div>
                            <UserImage
                              src={currentSearchUser.profile_image_url}
                            />
                          </div>
                          <div style={{ width: "100%" }}>
                            <PeopleDetails>
                              <div>
                                <object>
                                  <h3 style={{ color: theme.color }}>
                                    {currentSearchUser.fullname}
                                  </h3>
                                </object>
                                <object>
                                  <p>@{currentSearchUser.twitterScreenName}</p>
                                </object>
                              </div>
                            </PeopleDetails>
                          </div>
                        </PeopleFlex>
                      </div>
                    )}
                  </>
                )}
                <div
                  style={{
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p
                      style={{
                        marginBottom: 0,
                        fontWeight: "bold",
                        color: theme.color,
                      }}
                    >
                      {i18next.t("profileWallet.amount")}
                    </p>
                    <div className="relative">
                      <SelectCustom
                        heightOption={"120px"}
                        width={"140px"}
                        listItem={listToken}
                        currentItem={currentToken}
                        onChange={(newItem) => {
                          setCurrentToken(newItem);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="input-transfer"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: theme.color,
                    }}
                  >
                    <Input
                      style={{ fontSize: "24px", color: theme.color }}
                      bordered={false}
                      id="amount"
                      name="amount"
                      type="number"
                      min={0}
                      step="0.000001"
                      placeholder="0.00"
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-"].includes(e.key) &&
                        e.preventDefault()
                      }
                    />
                    <span style={{ display: "flex" }}>
                      <p style={{ marginBottom: 0 , width: "fit-content", minWidth: "48px"}}>{i18next.t("profileWallet.balance")}:&nbsp;</p>
                      <p style={{ marginBottom: 0, fontWeight: "bold" }}>
                        {loadingBalance ? (
                          <Loading
                            style={{ padding: 0 }}
                            color={theme.color}
                            size={10}
                          />
                        ) : (
                          customFormat(currentBalance, 6)
                        )}
                      </p>
                    </span>
                  </div>
                </div>
                <Button
                  width="100%"
                  padding="12px 30px"
                  type="submit"
                  disabled={isLoading}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {i18next.t("profileWallet.continue")}{" "}
                  {isLoading && (
                    <Loading
                      style={{ padding: 0 }}
                      color={theme.color}
                      size={10}
                    />
                  )}
                </Button>
              </form>
            </ModalTransfer>
          }
          handleClose={() => setIsOpen(false)}
          padding="5px 20px"
          heading={i18next.t("profileWallet.transfer")}
          display="flex"
        />
      )}
      {isModalPinTransferOpen && (
        <Modal
          toggleOpen={toggleOpenPinTransfer}
          children={
            <ModalTransfer>
              <form
                onSubmit={confirmTransfer}
                style={{
                  padding: "20px 0px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  <span style={{ color: theme.color }}>
                  {i18next.t("enterYourPINToProceedTransaction")}
                  </span>
                </div>
                <ListPin>
                  {pinsTransfer.map((pin, index) => {
                    return (
                      <PinItem key={index}>
                        <Input
                          ref={(ref) => (pinTransferRefs.current[index] = ref)}
                          style={{
                            fontSize: "24px",
                            color: theme.color,
                            padding: "10px 8px",
                            textAlign: "center",
                          }}
                          bordered={false}
                          type="tel"
                          min={0}
                          step="1"
                          value={pin}
                          onChange={(e) =>
                            handlePinChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handlePinKeyDown(index, e)}
                        />
                        {!showPinsTransfer && pin.trim().length === 1 && (
                          <PinItemAsterisk
                            color={theme.color}
                            background={theme.bg}
                            onClick={() => {
                              pinTransferRefs.current[index].focus();
                            }}
                          >
                            <AsteriskIcon color={theme.color} />
                          </PinItemAsterisk>
                        )}
                      </PinItem>
                    );
                  })}
                </ListPin>
                {messageError && (
                  <div style={{ marginTop: "12px" }}>
                    <span style={{ color: "red", fontStyle: "italic" }}>
                      {messageError}
                    </span>
                  </div>
                )}
                <Button
                  width="100%"
                  padding="12px 30px"
                  type="submit"
                  disabled={isLoading}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px",
                    marginTop: "24px",
                  }}
                >
                  {i18next.t("profileWallet.confirm")}
                  {isLoading && (
                    <Loading style={{ padding: 0 }} color={"#fff"} size={10} />
                  )}
                </Button>
              </form>
            </ModalTransfer>
          }
          handleClose={() => {
            handleReset();
            setIsModalPinTransferOpen(false);
          }}
          padding="5px 20px"
          heading={
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {i18next.t("profileWallet.enterPIN")} {i18next.t("enterPIN")}
              {
                <div onClick={() => setShowPinsTransfer(!showPinsTransfer)}>
                  {showPinsTransfer ? (
                    <EyeOnIcon color={theme.color} />
                  ) : (
                    <EyeOffIcon color={theme.color} />
                  )}
                </div>
              }
            </div>
          }
          display="flex"
        />
      )}
      {isOpenModelSuccess && (
        <Modal
          toggleOpen={toggleOpenModalSuccess}
          children={
            <ModalTransfer>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  alignItems: "center",
                  padding: "20px 0px",
                }}
              >
                <SuccessIcon />
                <span style={{ color: theme.color }}>
                  {i18next.t("profileWallet.transactionConfirmed")}
                </span>
                <Button
                  width="100%"
                  padding="12px 30px"
                  type="submit"
                  disabled={isLoading}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px",
                  }}
                  onClick={() => {
                    handleReset();
                    setIsOpenModelSuccess(false);
                  }}
                >
                  {i18next.t("ok")}
                </Button>
              </div>
            </ModalTransfer>
          }
          handleClose={() => {
            handleReset();
            setIsOpenModelSuccess(false);
          }}
          padding="5px 20px"
          heading={i18next.t("profileWallet.PINConfirmation")}
          display="flex"
        />
      )}
    </div>
  );
}

import React, { useRef } from "react";
import Loading from "../loading";
import {
  Button,
  ListPin,
  ModalTransfer,
  PinItem,
  PinItemAsterisk,
} from "../styles/profile-wallet";
import { Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { EyeOffIcon } from "../icons/EyeOffIcon";
import Modal from "../modal";
import { useState } from "react";
import { SuccessIcon } from "../icons/SuccessIcon";
import { EyeOnIcon } from "../icons/EyeOnIcon";
import { AsteriskIcon } from "../icons/AsteriskIcon";
import { authService } from "../../services/AuthService";
import { toast } from "react-toastify";
import { SET_USER } from "../../redux/actions";
import i18next from "i18next";

export default function SetUpPinModal(props) {
  const { isOpen, setIsOpen, handleRefresh } = props;
  const [pins, setPins] = useState(["", "", "", "", "", ""]);
  const [pinsConfirm, setPinsConfirm] = useState(["", "", "", "", "", ""]);
  const [showPins, setShowPins] = useState(false);
  const [showPinsConfirm, setShowPinsConfirm] = useState(false);
  const [isOpenModelSuccess, setIsOpenModelSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);

  const theme = useSelector((state) => state.theme);
  const pinRefs = useRef([]);
  const pinConfirmRefs = useRef([]);

  const handleSetUpPin = async (e) => {
    e.preventDefault();
    const isAgreePolicy = e.target["checkAgreePolicy"].checked;
    const checkErrorValid = validatePin(pins, pinsConfirm);
    if (!checkErrorValid) {
      if (isAgreePolicy) {
        try {
          setIsLoading(true);
          const pinSetUp = pins.join("");
          const data = await authService.createPin({ pin: pinSetUp });
          if (data.success) {
            setIsOpenModelSuccess(true);
            setIsOpen(false);
          } else {
            setMessageError(null);
            toast(data.message, {
              type: "error",
              position: "bottom-center",
              autoClose: 1000,
              closeOnClick: true,
            });
          }
        } catch (error) {
          return error;
        } finally {
          setIsLoading(false);
        }
        return;
      }
      setMessageError(`${i18next.t("profileWallet.agreeWithOurPolicy")}`);
      return;
    }
    setMessageError(checkErrorValid);
  };
  const validatePin = (pinArray, pinConfirmArray) => {
    const isConsecutiveAscending = () =>
      [...pinArray].every((pin, index) =>
        index === pinArray.length - 1
          ? true
          : Number(pin) === Number(pinArray[index + 1]) - 1
      );
    const isConsecutiveDescending = () =>
      [...pinArray].every((pin, index) =>
        index === pinArray.length - 1
          ? true
          : Number(pin) == Number(pinArray[index + 1]) + 1
      );

    if (pinArray.some((pin) => pin === "")) {
      return `${i18next.t("profileWallet.enter6DigitsForPIN")}`;
    }
    if (pinArray.some((pin) => isNaN(pin))) {
      return `${i18next.t("profileWallet.PINContainNumbers")}`;
    }
    if (isConsecutiveAscending() || isConsecutiveDescending()) {
      return `${i18next.t("profileWallet.pinCannotAscendingorder")}`;
    }
    if (pinArray.join("") !== pinConfirmArray.join("")) {
      return `${i18next.t("profileWallet.confirmPINNotMatch")}`;
    }
    return null;
  };

  const handlePinChange = (index, value, casePin) => {
    if (!isNaN(value) && value.trim().length === 1) {
      const newPins =
        casePin == 1 ? [...pins] : casePin == 2 ? [...pinsConfirm] : [];
      newPins[index] = value.trim();
      casePin == 1 ? setPins(newPins) : setPinsConfirm(newPins);
      if (index < pins.length - 1 && value !== "") {
        casePin == 1
          ? pinRefs.current[index + 1].focus()
          : pinConfirmRefs.current[index + 1].focus();
      }
    }
  };

  const handlePinKeyDown = (index, e, casePin) => {
    if (e.key === "Backspace") {
      casePin == 1
        ? setPins((prevPins) => {
            const newPins = [...prevPins];
            newPins[index] = "";
            return newPins;
          })
        : setPinsConfirm((prevPins) => {
            const newPins = [...prevPins];
            newPins[index] = "";
            return newPins;
          });
      if (index > 0) {
        casePin == 1
          ? pinRefs.current[index - 1].focus()
          : pinConfirmRefs.current[index - 1].focus();
      }
    }
  };

  const handleReset = () => {
    setPins(["", "", "", "", "", ""]);
    setPinsConfirm(["", "", "", "", "", ""]);
    handleRefresh();
    setMessageError(null);
  };
  const toggleOpenModalSuccess = () => {
    handleReset();
    setIsOpenModelSuccess(isOpenModelSuccess);
  };

  const toggleOpenModal = () => {
    handleReset();
    setIsOpen(isOpen);
  };

  return (
    <>
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
                {i18next.t("profileWallet.setUpPINSuccessfully")}
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
                    dispatch({
                      type: SET_USER,
                      payload: { ...user, isPinSet: true },
                    });
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
            dispatch({
              type: SET_USER,
              payload: { ...user, isPinSet: true },
            });
          }}
          padding="5px 20px"
          heading={i18next.t("profileWallet.setUpPIN")}
          display="flex"
        />
      )}

      {isOpen && (
        <Modal
          toggleOpen={toggleOpenModal}
          children={
            <ModalTransfer>
              <form
                onSubmit={handleSetUpPin}
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
                    {i18next.t("profileWallet.setUpPINToSecureWallet")}
                  </span>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span style={{ fontWeight: 700, color: theme.color }}>
                        {i18next.t("profileWallet.createPIN")}
                      </span>
                      <div
                        style={{ marginTop: "8px" }}
                        onClick={() => setShowPins(!showPins)}
                      >
                        {showPins ? (
                          <EyeOnIcon color={theme.color} />
                        ) : (
                          <EyeOffIcon color={theme.color} />
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "12px",
                      }}
                    >
                      {pins.map((pin, index) => {
                        return (
                          <PinItem key={index}>
                            <Input
                              ref={(ref) => (pinRefs.current[index] = ref)}
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
                                handlePinChange(index, e.target.value, 1)
                              }
                              onKeyDown={(e) => handlePinKeyDown(index, e, 1)}
                            />
                            {!showPins && pin.trim().length === 1 && (
                              <PinItemAsterisk
                                color={theme.color}
                                background={theme.bg}
                                onClick={() => {
                                  pinRefs.current[index].focus();
                                }}
                              >
                                <AsteriskIcon color={theme.color} />
                              </PinItemAsterisk>
                            )}
                          </PinItem>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span style={{ fontWeight: 700, color: theme.color }}>
                        {i18next.t("profileWallet.confirmPIN")}
                      </span>
                      <div
                        style={{ marginTop: "8px" }}
                        onClick={() => setShowPinsConfirm(!showPinsConfirm)}
                      >
                        {showPinsConfirm ? (
                          <EyeOnIcon color={theme.color} />
                        ) : (
                          <EyeOffIcon color={theme.color} />
                        )}
                      </div>
                    </div>
                    <ListPin>
                      {pinsConfirm.map((pin, index) => {
                        return (
                          <PinItem key={index}>
                            <Input
                              ref={(ref) =>
                                (pinConfirmRefs.current[index] = ref)
                              }
                              style={{
                                fontSize: "24px",
                                color: theme.color,
                                borderRadius: "8px",
                                padding: "10px 8px",
                                textAlign: "center",
                              }}
                              bordered={false}
                              type="tel"
                              min={0}
                              step="1"
                              value={pin}
                              onChange={(e) =>
                                handlePinChange(index, e.target.value, 2)
                              }
                              onKeyDown={(e) => handlePinKeyDown(index, e, 2)}
                            />
                            {!showPinsConfirm && pin.trim().length === 1 && (
                              <PinItemAsterisk
                                color={theme.color}
                                background={theme.bg}
                                onClick={() => {
                                  pinConfirmRefs.current[index].focus();
                                }}
                              >
                                <AsteriskIcon color={theme.color} />
                              </PinItemAsterisk>
                            )}
                          </PinItem>
                        );
                      })}
                    </ListPin>
                  </div>
                  <span style={{ color: theme.color }}>
                    {i18next.t("profileWallet.pinCannotAscendingorderEg")}{" "}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <Input
                      name="checkAgreePolicy"
                      id="checkAgreePolicy"
                      style={{
                        width: "24px",
                        height: "24px",
                        background: "none",
                        border: "1px solid #94A3B8",
                      }}
                      type="checkbox"
                    />
                    <span style={{ color: theme.color }}>
                      {i18next.t("profileWallet.acknowledgeForgotPINCannotRecovered")}{" "}
                    </span>
                  </div>
                </div>
                {messageError && (
                  <div>
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
            setIsOpen(false);
          }}
          padding="5px 20px"
          heading={i18next.t("profileWallet.setUpPIN")}
          display="flex"
        />
      )}
    </>
  );
}

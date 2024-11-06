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
import { useSelector } from "react-redux";
import { EyeOffIcon } from "../icons/EyeOffIcon";
import Modal from "../modal";
import { useState } from "react";
import { SuccessIcon } from "../icons/SuccessIcon";
import { EyeOnIcon } from "../icons/EyeOnIcon";
import { AsteriskIcon } from "../icons/AsteriskIcon";
import { authService } from "../../services/AuthService";
import { toast } from "react-toastify";
import i18next from "i18next";
import { ERR_CODE } from "../../constants";

export default function ChangePinModal(props) {
  const { isOpen, setIsOpen } = props;
  const [pinsCurrent, setPinsCurrent] = useState(["", "", "", "", "", ""]);
  const [pins, setPins] = useState(["", "", "", "", "", ""]);
  const [pinsConfirm, setPinsConfirm] = useState(["", "", "", "", "", ""]);
  const [showPins, setShowPins] = useState(false);
  const [showPinsConfirm, setShowPinsConfirm] = useState(false);
  const [showPinsCurrent, setShowPinsCurrent] = useState(false);
  const [isOpenModelSuccess, setIsOpenModelSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);

  const theme = useSelector((state) => state.theme);
  const pinRefs = useRef([]);
  const pinConfirmRefs = useRef([]);
  const pinCurrentRefs = useRef([]);

  const handleSetUpPin = async (e) => {
    e.preventDefault();
    const isAgreePolicy = e.target["checkAgreePolicy"].checked;
    const isValid = validatePin(pins, pinsConfirm, pinsCurrent);
    if (isValid === null) {
      if (isAgreePolicy) {
        try {
          setIsLoading(true);
          const newPin = pins.join("");
          const oldPin = pinsCurrent.join("");
          const data = await authService.changePin({ oldPin, newPin });
          if (data.success === true) {
            setIsOpen(false);
            setIsOpenModelSuccess(true);
          } else if (data.success == false) {
            setMessageError(null);
            toast(
              data.code === ERR_CODE.INVALID_PIN
                ? `${i18next.t("incorrectPINError")}`
                : data.message,
              {
                type: "error",
                position: "bottom-center",
                autoClose: 1000,
                closeOnClick: true,
              }
            );
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
    setMessageError(isValid);
  };
  const validatePin = (pinArray, pinConfirmArray, pinCurrentArray) => {
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
    if (pinArray.join("") === pinCurrentArray.join("")) {
      return `${i18next.t("profileWallet.newPinNotOverlap")}`;
    }
    return null;
  };

  const handlePinChange = (index, value, casePin) => {
    if (!isNaN(value) && value.trim().length === 1) {
      const newPins =
        casePin == 1
          ? [...pinsCurrent]
          : casePin == 2
            ? [...pins]
            : [...pinsConfirm];
      newPins[index] = value.trim();
      casePin == 1
        ? setPinsCurrent(newPins)
        : casePin == 2
          ? setPins(newPins)
          : casePin == 3
            ? setPinsConfirm(newPins)
            : "";
      if (index < pins.length - 1 && value !== "") {
        casePin == 1
          ? pinCurrentRefs.current[index + 1].focus()
          : casePin == 2
            ? pinRefs.current[index + 1].focus()
            : casePin == 3
              ? pinConfirmRefs.current[index + 1].focus()
              : "";
      }
    }
  };

  const handlePinKeyDown = (index, e, casePin) => {
    if (e.key === "Backspace") {
      switch (casePin) {
        case 1:
          setPinsCurrent((prevPins) => {
            const newPins = [...prevPins];
            newPins[index] = "";
            return newPins;
          });
          break;
        case 2:
          setPins((prevPins) => {
            const newPins = [...prevPins];
            newPins[index] = "";
            return newPins;
          });
          break;
        case 3:
          setPinsConfirm((prevPins) => {
            const newPins = [...prevPins];
            newPins[index] = "";
            return newPins;
          });
          break;
        default:
          break;
      }

      if (index > 0) {
        casePin == 1
          ? pinCurrentRefs.current[index - 1].focus()
          : casePin == 2
            ? pinRefs.current[index - 1].focus()
            : casePin == 3
              ? pinConfirmRefs.current[index - 1].focus()
              : "";
      }
    }
  };
  const handleReset = () => {
    setPins(["", "", "", "", "", ""]);
    setPinsConfirm(["", "", "", "", "", ""]);
    setPinsCurrent(["", "", "", "", "", ""]);
    setMessageError(null);
  };

  const toggleOpenModalSuccess = () => {
    handleReset();
    setIsOpenModelSuccess(!isOpenModelSuccess);
  };

  const toggleOpenModal = () => {
    handleReset();
    setIsOpen(!isOpen);
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
                  {i18next.t("profileWallet.PINsuccessfullyChanged")}
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
                  {i18next.t("profileWallet.ok")}
                </Button>
              </div>
            </ModalTransfer>
          }
          handleClose={() => {
            handleReset();
            setIsOpenModelSuccess(false);
          }}
          padding="5px 20px"
          heading={i18next.t("profileWallet.changePIN")}
          display="flex"
        />
      )}
      {/* MODAAL CHANGE */}
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
                  {/* CURRENT PIN */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span style={{ fontWeight: 700, color: theme.color }}>
                        {i18next.t("profileWallet.currentPIN")}
                      </span>
                      <div onClick={() => setShowPinsCurrent(!showPinsCurrent)}>
                        {showPinsCurrent ? (
                          <EyeOnIcon color={theme.color} />
                        ) : (
                          <EyeOffIcon color={theme.color} />
                        )}
                      </div>
                    </div>
                    <ListPin>
                      {pinsCurrent.map((pin, index) => {
                        return (
                          <PinItem key={index}>
                            <Input
                              ref={(ref) =>
                                (pinCurrentRefs.current[index] = ref)
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
                                handlePinChange(index, e.target.value, 1)
                              }
                              onKeyDown={(e) => handlePinKeyDown(index, e, 1)}
                            />
                            {!showPinsCurrent && pin.trim().length === 1 && (
                              <PinItemAsterisk
                                color={theme.color}
                                background={theme.bg}
                                onClick={() => {
                                  pinCurrentRefs.current[index].focus();
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
                  {/* NEW PIN */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span style={{ fontWeight: 700, color: theme.color }}>
                        {i18next.t("profileWallet.newPIN")}
                      </span>
                      <div onClick={() => setShowPins(!showPins)}>
                        {showPins ? (
                          <EyeOnIcon color={theme.color} />
                        ) : (
                          <EyeOffIcon color={theme.color} />
                        )}
                      </div>
                    </div>
                    <ListPin>
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
                                handlePinChange(index, e.target.value, 2)
                              }
                              onKeyDown={(e) => handlePinKeyDown(index, e, 2)}
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
                    </ListPin>
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
                      <div onClick={() => setShowPinsConfirm(!showPinsConfirm)}>
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
                                handlePinChange(index, e.target.value, 3)
                              }
                              onKeyDown={(e) => handlePinKeyDown(index, e, 3)}
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
          heading={i18next.t("profileWallet.changePIN")}
          display="flex"
        />
      )}
    </>
  );
}

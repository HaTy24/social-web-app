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
import i18next from "i18next";

export default function EnterPinModal(props) {
  const { isOpen, setIsOpen, onSubmit, textConfirm } = props;
  const [pins, setPins] = useState(["", "", "", "", "", ""]);
  const [pinsConfirm, setPinsConfirm] = useState(["", "", "", "", "", ""]);
  const [showPins, setShowPins] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);

  const theme = useSelector((state) => state.theme);
  const pinRefs = useRef([]);
  const pinConfirmRefs = useRef([]);

  const handleSetUpPin = async (e) => {
    e.preventDefault();
    const isValid = validatePin(pins, pinsConfirm);
    if (isValid === null) {
      onSubmit(pins.join(""));
      handleReset();
      return;
    }
    setMessageError(isValid);
  };
  const validatePin = (pinArray) => {
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
    setMessageError(null);
  };
  const toggleOpen = () => {
    handleReset();
    setIsOpen(!isOpen);
  };
  return (
    <>
      {isOpen && (
        <Modal
          toggleOpen={toggleOpen}
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
                    {i18next.t("enterYourPINToProceedTransaction")}
                  </span>
                  <div>
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
                  {textConfirm ? textConfirm : `${i18next.t("profileWallet.continue")}`}
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
          heading={
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {i18next.t("enterPIN")}
              {
                <div onClick={() => setShowPins(!showPins)}>
                  {showPins ? (
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
    </>
  );
}

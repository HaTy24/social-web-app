import { Input } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { ERR_CODE } from "../constants";
import { authService } from "../services/AuthService";
import { capitalizeFirstWord } from "../utils/convertString";
import FormInput from "./controls/FormInput";
import { AsteriskIcon } from "./icons/AsteriskIcon";
import { EyeOffIcon } from "./icons/EyeOffIcon";
import { EyeOnIcon } from "./icons/EyeOnIcon";
import Loading from "./loading";
import Modal from "./modal";
import {
  Button,
  ListPin,
  ModalTransfer,
  PinItem,
  PinItemAsterisk,
} from "./styles/profile-wallet";
import { SET_USER } from "../redux/actions";
import i18next from "i18next";

export default function EmailRequireModal() {
  const userInfo = useSelector((state) => state.profile.user);
  const [isOpen, setIsOpen] = useState(false);
  const [pinsTransfer, setPinsTransfer] = useState(["", "", "", "", "", ""]);
  const dispatch = useDispatch();

  const pinTransferRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const theme = useSelector((state) => state.theme);
  const [isModalPinUpdateEmailOpen, setIsModalPinUpdateEmailOpen] =
    useState(false);
  const [currentEmail, setCurrentEmail] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [showPinsTransfer, setShowPinsTransfer] = useState(false);
  const history = useHistory();

  const updateEmailValidation = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email()
      .matches(/@[^.]*\./, `${i18next.t("invalidYourEmail")}` || "")
      .required(`${i18next.t("feedbackPage.emailIsRequired")}`),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: updateEmailValidation,
    onSubmit: async (values) => {
      setCurrentEmail(values.email);
      if (userInfo.isPinSet) {
        setIsModalPinUpdateEmailOpen(true);
        return;
      }

      try {
        setLoading(true);

        const response = await authService.updateProfileEmail({
          email: values.email,
        });

        if (response.success) {
          getUserProfile();
          formik.resetForm();
          setIsOpen(false);
          Swal.fire({
            color: theme.color,
            title: `${i18next.t("updateEmailSuccessfulTitle")}`,
            text: `${i18next.t("updateEmailSuccessfulContent")}`,
            icon: "success",
            background: theme.tweetHov,
          });
        } else {
          setMessageError(null);
          Swal.fire({
            color: theme.color,
            title: `${i18next.t("updateEmailFailed")}`,
            text:
              response.code === ERR_CODE.INVALID_PIN
                ? `${i18next.t("enteredAnIncorrectPIN")} ${response.data.attemptsLeft} ${i18next.t("attemptsLeftToRetry")}`
                : response.code === ERR_CODE.CONFLICT
                ? `${i18next.t("thisEmailAlreadyExists")}`
                : `${i18next.t("somethingWentWrong")}`,
            icon: "error",
            background: theme.tweetHov,
          });
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    },
  });

  const getUserProfile = async () => {
    const userProfile = await authService.getProfile();
    dispatch({
      type: SET_USER,
      payload: { ...userInfo, ...userProfile.data },
    });
  };

  const validatePin = (pinArray) => {
    if (pinArray.some((pin) => pin === "")) {
      return `${i18next.t("enter6DigitsForPIN")}`;
    }
    if (pinArray.some((pin) => isNaN(pin))) {
      return `${i18next.t("PINContainOnlyNumbers")}`;
    }
    return null;
  };

  const confirmUpdate = async (e) => {
    e.preventDefault();
    const isValid = validatePin(pinsTransfer);
    if (isValid && !currentEmail) {
      setMessageError(isValid);
      return;
    }
    try {
      setLoading(true);
      const pinNumber = pinsTransfer.join("");

      const response = await authService.updateProfileEmail({
        email: currentEmail,
        pinNumber,
      });

      if (response.success) {
        getUserProfile();
        formik.resetForm();
        setIsOpen(false);
        setIsModalPinUpdateEmailOpen(false);
        Swal.fire({
          color: theme.color,
          title: `${i18next.t("updateEmailSuccessfulTitle")}`,
          text: `${i18next.t("updateEmailSuccessfulContent")}`,
          icon: "success",
          background: theme.tweetHov,
        });
      } else {
        setMessageError(null);
        Swal.fire({
          color: theme.color,
          title: `${i18next.t("updateEmailFailed")}`,
          text:
            response.code === ERR_CODE.INVALID_PIN
              ? `${i18next.t("enteredAnIncorrectPIN")} ${response.data.attemptsLeft} ${i18next.t("attemptsLeftToRetry")}`
              : response.code === ERR_CODE.CONFLICT
              ? `${i18next.t("thisEmailAlreadyExists")}`
              : `${i18next.t("somethingWentWrong")}`,
          icon: "error",
          background: theme.tweetHov,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
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
    if (!userInfo.email) {
      setIsOpen(true);
    }
  }, [userInfo]);

  const isDisable = useMemo(() => {
    return (
      formik.isSubmitting ||
      loading ||
      Object.values(formik.errors).length !== 0
    );
  }, [formik.errors, loading, formik.isSubmitting]);

  const toggleOpenPinUpdateEmailOpen = () => {
    setIsModalPinUpdateEmailOpen(!isModalPinUpdateEmailOpen);
  };
  return (
    <div>
      {isOpen && (
        <Modal
          handleClose={() => history.push("/home")}
          toggleOpen={() => history.push("/home")}
          padding="5px 20px"
          heading={i18next.t("updateEmail")}
          display="flex"
          children={
            <ModalTransfer color={theme.color}>
              <p>
                {i18next.t("modalTranferTitle")}
              </p>
              <p>{i18next.t("modalTranferContent")}</p>
              <form
                onSubmit={formik.handleSubmit}
                style={{
                  padding: "10px 20px 30px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  label={i18next.t("email")}
                  placeholder="abc@gmail.com"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  isError={formik.touched.email && !!formik.errors.email}
                  error={formik.errors.email}
                />
                <Button
                  width="100%"
                  padding="12px 30px"
                  type="submit"
                  disabled={isDisable}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {userInfo.isPinSet ? `${i18next.t("continue")}` : `${i18next.t("update")}`}&nbsp;
                  {loading && (
                    <Loading style={{ padding: 0 }} color={"#fff"} size={10} />
                  )}
                </Button>
                {!userInfo.isPinSet && (
                  <p style={{ color: theme.color, textAlign: "center" }}>
                    {i18next.t("recommendSetupPIN")}&nbsp;
                    <span
                      className="text-link"
                      onClick={() => history.push("/profile-wallet")}
                    >
                      {i18next.t("here")}
                    </span>
                    &nbsp;{i18next.t("toProtectYourGameAccount")}
                  </p>
                )}
              </form>
            </ModalTransfer>
          }
        />
      )}
      {isModalPinUpdateEmailOpen && (
        <Modal
          toggleOpen={toggleOpenPinUpdateEmailOpen}
          children={
            <ModalTransfer>
              <form
                onSubmit={confirmUpdate}
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
                  disabled={loading}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5px",
                    marginTop: "24px",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {i18next.t("update")}&nbsp;
                  {loading && (
                    <Loading style={{ padding: 0 }} color={"#fff"} size={10} />
                  )}
                </Button>
              </form>
            </ModalTransfer>
          }
          handleClose={() => {
            setIsModalPinUpdateEmailOpen(false);
            handleReset();
          }}
          padding="5px 20px"
          heading={
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {i18next.t("enterPIN")}
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
    </div>
  );
}

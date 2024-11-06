import React, { useState } from "react";
import Modal from "../modal";
import { FormControl, FormSigIn } from "../styles/signin";
import { SuccessIcon } from "../icons/SuccessIcon";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CloseIcon } from "../icons/CloseIcon";
import { authService } from "../../services/AuthService";
import Loading from "../loading";
import { capitalizeFirstWord } from "../../utils/convertString";
import { toast } from "react-toastify";
import { handleCheckMsgError } from "../../constants";
import i18next from "i18next";

export const FormForgotPassword = ({ onClose }) => {
  const [showModalForgotPassword, setShowModalForgotPassword] = useState(true);
  const [showModalSendEmail, setShowModalSendEmail] = useState(false);
  const [showModalSendEmailSuccess, setShowModalSendEmailSuccess] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email is invalid")
      .matches(/@[^.]*\./, "Email is invalid")
      .required("Email is invalid"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setShowModalSendEmail(true);
      setShowModalForgotPassword(false);
    },
  });
  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authService.forgotPassword({
        email: formik.values.email,
      });
      setLoading(false);
      if (response.success) {
        setShowModalSendEmailSuccess(true);
        setShowModalSendEmail(false);
        return;
      }
      toast(i18next.t(handleCheckMsgError(response.message, "resendEmailUnsuccessful")), {
        type: "error",
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <>
      {showModalForgotPassword && (
        <Modal
          style={{
            background: "#1E293B",
            padding: "12px",
            paddingBottom: "0px",
            borderRadius: "8px",
          }}
          toggleOpen={() => {
            setShowModalForgotPassword(false);
            onClose();
          }}
          children={
            <FormSigIn onSubmit={formik.handleSubmit}>
              <span>
                {i18next.t("textChangePassword")}
              </span>
              <FormControl>
                <input
                  type="text"
                  name="email"
                  placeholder={i18next.t("yourEmail")}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div
                    style={{
                      color: "#FF4444",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <CloseIcon color={"#FF4444"} height={24} width={24} />
                    {formik.errors.email}
                  </div>
                ) : null}
              </FormControl>
              <button
                style={{
                  background: "#fff",
                  color: "#1E293B",
                  padding: "12px",
                  borderRadius: "12px",
                }}
              >
                {i18next.t("next")}
              </button>
            </FormSigIn>
          }
          handleClose={() => {
            setShowModalForgotPassword(false);
            onClose();
          }}
          padding=" 24px 12px"
          heading={<div style={{ color: "#fff" }}>{i18next.t("forgotPassword")}</div>}
          display="flex"
        />
      )}
      {showModalSendEmail && (
        <Modal
          style={{
            background: "#1E293B",
            padding: "12px",
            paddingBottom: "0px",
            borderRadius: "8px",
          }}
          toggleOpen={() => {
            setShowModalSendEmail(false);
            onClose();
          }}
          children={
            <FormSigIn onSubmit={handleSendEmail}>
              <span>{i18next.t("weWillSendLinkTo")}</span>
              <FormControl>
                <input
                  readOnly
                  value={formik.values.email}
                  type="text"
                  placeholder={i18next.t("yourEmail")}
                />
              </FormControl>
              <button
                style={{
                  background: "#fff",
                  color: "#1E293B",
                  padding: "12px",
                  borderRadius: "12px",
                }}
              >
                {i18next.t("next")}
                {loading && (
                  <Loading
                    style={{ padding: 0, marginTop: "3px" }}
                    size={10}
                    color={"#111"}
                  />
                )}
              </button>
            </FormSigIn>
          }
          handleClose={() => {
            setShowModalSendEmail(false);
            onClose();
          }}
          padding=" 24px 12px"
          heading={
            <div style={{ color: "#fff" }}>{i18next.t("sendResetPasswordLink")}</div>
          }
          display="flex"
        />
      )}
      {showModalSendEmailSuccess && (
        <Modal
          style={{
            background: "#1E293B",
            padding: "12px",
            paddingBottom: "0px",
            borderRadius: "8px",
          }}
          toggleOpen={() => {
            setShowModalSendEmailSuccess(false);
            onClose();
          }}
          children={
            <FormSigIn
              onSubmit={(e) => {
                e.preventDefault();
              }}
              style={{ alignItems: "center" }}
            >
              <SuccessIcon />
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  {i18next.t("checkEmail")}
                </div>
                <span>
                 {i18next.t("pleaseCheckEmail")}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowModalSendEmailSuccess(false);
                  onClose();
                }}
                style={{
                  background: "#fff",
                  color: "#1E293B",
                  padding: "12px",
                  borderRadius: "12px",
                }}
              >
                {i18next.t("okay")}
              </button>
            </FormSigIn>
          }
          handleClose={() => {
            setShowModalSendEmailSuccess(false);
            onClose();
          }}
          padding=" 24px 12px"
          heading=" "
          display="flex"
        />
      )}
    </>
  );
};

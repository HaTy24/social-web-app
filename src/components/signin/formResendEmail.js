import { useFormik } from "formik";
import i18next from "i18next";
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { handleCheckMsgError } from "../../constants";
import { authService } from "../../services/AuthService";
import { CloseIcon } from "../icons/CloseIcon";
import Modal from "../modal";
import VerifyEmail from "../signup/verifyEmail";
import { FormControl, FormSigIn } from "../styles/signin";

export const FormResendEmail = ({ onClose }) => {
  const [showModalForgotPassword, setShowModalForgotPassword] = useState(true);
  const [showModalSendEmail, setShowModalSendEmail] = useState(false);
  const [showModalSendEmailSuccess, setShowModalSendEmailSuccess] =
    useState(false);
  const [isStartCountDown, setIsStartCountDown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingResendEmail, setLoadingReSendEmail] = useState(false);

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
  const handleResendEmail = async () => {
    try {
      setLoadingReSendEmail(true);
      const result = await authService.reSendEmail({
        email: formik.values.email,
        type: "verify_email",
      });
      setLoadingReSendEmail(false);
      if (result.success) {
        setIsStartCountDown(true);
        return;
      }
      toast(i18next.t(handleCheckMsgError(result.message, "resendEmailUnsuccessful")), {
        type: "error",
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
      });
    } catch (error) {
      setLoadingReSendEmail(false);
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
                onClick={handleResendEmail}
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
          heading={<div style={{ color: "#fff" }}>{i18next.t("resendEmail")}</div>}
          display="flex"
        />
      )}
      {showModalSendEmail && (
        <VerifyEmail
          handleResend={handleResendEmail}
          onBack={() => {
            setShowModalSendEmail(false);
            setShowModalForgotPassword(true);
          }}
          isLoading={loading}
          isStartCountDown={isStartCountDown}
          setIsStartCountDown={setIsStartCountDown}
          email={formik.values.email}
        />
      )}
    </>
  );
};

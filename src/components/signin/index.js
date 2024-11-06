import { Col, Row } from "antd";
import { useFormik } from "formik";
import i18next from "i18next";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  checkEnableGoogleLogin,
  getStaticURL,
  handleCheckMsgError,
} from "../../constants";
import { authService } from "../../services/AuthService";
import { GoogleLoginButton } from "../auth-buttons/GoogleLoginButton";
import { TwitterOauthButton } from "../auth-buttons/TwitterLoginButton";
import { CloseIcon } from "../icons/CloseIcon";
import { EyeOffIcon } from "../icons/EyeOffIcon";
import { EyeOnIcon } from "../icons/EyeOnIcon";
import Loading from "../loading";
import {
  BackgroundContent,
  FormControl,
  FormGroup,
  FormSigIn,
  LinkWrapper,
} from "../styles/signin";
import { FormForgotPassword } from "./formForgotPassword";
import { LanguageIcon } from "../icons/LanguageIcon";
import { FormResendEmail } from "./formResendEmail";

const SignIn = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showModalForgotPassword, setShowModalForgotPassword] = useState(false);
  const [showModalResendEmail, setShowModalResendEmail] = useState(false);
  const history = useHistory();
  const user = useSelector((state) => state.profile.user);
  const [loadingSingIn, setLoadingSignIn] = useState(false);
  const [lang, setLang] = useState(i18next.language);

  const isEnableLoginGoogle = checkEnableGoogleLogin();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(i18next.t("emailInvalid"))
      .matches(/@[^.]*\./, i18next.t("emailInvalid"))
      .required(i18next.t("emailInvalid"))
      .max(255, i18next.t("emailTooLong")),
    password: Yup.string().required(i18next.t("passwordRequired")),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoadingSignIn(true);
        const response = await authService.loginWithEmail(values);
        setLoadingSignIn(false);
        if (response.success) {
          localStorage.setItem("jwt", response.data.access_token);
          history.push("/home");
          return;
        }
        toast(
          i18next.t(
            handleCheckMsgError(
              response.message,
              i18next.t("signInUnsuccessful")
            )
          ),
          {
            type: "error",
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
          }
        );
      } catch (error) {
        setLoadingSignIn(false);
        console.log(error);
      }
    },
  });

  return (
    <React.Fragment>
      <BackgroundContent
        style={{
          minHeight: "100vh",
          overflow: "hidden",
          backgroundColor: "#18181B",
        }}
      >
        <div
          style={{
            backgroundColor: window.matchMedia("(max-width: 768px)").matches
              ? "#18181B"
              : "transparent",
            width: "100%",
            position: "fixed",
            zIndex: 999,
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <button
            style={{
              margin: window.matchMedia("(max-width: 768px)").matches
                ? "10px"
                : "40px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              borderRadius: "10px",
              border: "none",
              outline: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              i18next.changeLanguage(lang === "cn" ? "en" : "cn");
              setLang(lang === "cn" ? "en" : "cn");
            }}
          >
            <LanguageIcon />
            {lang === "en" ? "English" : "简体中文"}
          </button>
        </div>
        <Row
          style={{
            paddingTop: window.matchMedia("(max-width: 768px)").matches
              ? "20px"
              : "0px",
          }}
        >
          <Col span={24}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              <Link to="/">
                <img
                  src={`${getStaticURL()}/assets/images/weknot_logo_c.svg`}
                  alt="Weknot"
                  width={200}
                  height={200}
                />
              </Link>
              <h2
                style={{
                  fontSize: "1.5rem",
                  marginTop: "1rem",
                  color: "white",
                }}
              >
                {user.id && !user.twitterId
                  ? "Please link with Twitter!"
                  : i18next.t("joinWeknot")}
              </h2>
              <FormGroup>
                <FormSigIn onSubmit={formik.handleSubmit} autoComplete="off">
                  <FormControl>
                    <label>{i18next.t("email")}</label>
                    <input
                      type="text"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      placeholder={i18next.t("yourEmail")}
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
                  <FormControl>
                    <label>{i18next.t("password")}</label>
                    <div style={{ position: "relative", width: "100%" }}>
                      <input
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        autoComplete="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder={i18next.t("yourPassword")}
                      />
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "12px",
                          transform: "translateY(-50%)",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                        }}
                      >
                        {showPassword ? <EyeOnIcon /> : <EyeOffIcon />}
                      </div>
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                      <div
                        style={{
                          color: "#FF4444",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <CloseIcon color={"#FF4444"} height={24} width={24} />
                        {formik.errors.password}
                      </div>
                    ) : null}
                  </FormControl>
                  <button>
                    {i18next.t("signIn")}
                    {loadingSingIn && (
                      <Loading
                        style={{ padding: 0, marginTop: "3px" }}
                        size={10}
                        color={"#fff"}
                      />
                    )}
                  </button>
                  <div style={{ color: "#fff", textAlign: "center" }}>
                    <span style={{ color: "#94A3B8" }}>
                      {i18next.t("dontHaveAccount")}&nbsp;
                      <Link to="/sign-up">&nbsp;{i18next.t("signUp")}</Link>
                    </span>
                  </div>
                  <div
                    onClick={() => setShowModalForgotPassword(true)}
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <span>{i18next.t("forgotPassword")}</span>
                  </div>
                  <div
                    onClick={() => setShowModalResendEmail(true)}
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <span>{i18next.t("resendEmail")}</span>
                  </div>
                </FormSigIn>
                {isEnableLoginGoogle && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "1px",
                          background: "#393939",
                        }}
                      />
                      <span style={{ color: "#94A3B8", whiteSpace: "nowrap" }}>
                        {i18next.t("or")}
                      </span>
                      <div
                        style={{
                          width: "100%",
                          height: "1px",
                          background: "#393939",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <span style={{ color: "#fff" }}>
                        {i18next.t("signInWith")}
                      </span>
                      <div style={{ display: "flex", gap: "16px" }}>
                        <GoogleLoginButton />
                        <TwitterOauthButton />
                      </div>
                    </div>
                  </>
                )}
              </FormGroup>
              <LinkWrapper>
                <div>
                  <Link to="/privacy-policy" target="_blank">
                    {i18next.t("privacyPolicy")}
                  </Link>
                </div>
                <div>
                  <Link to="/term-of-service" target="_blank">
                    {i18next.t("termsOfService")}
                  </Link>
                </div>
                <div>
                  <Link to="/feedback" target="_blank">
                    {i18next.t("feedback")}
                  </Link>
                </div>
              </LinkWrapper>
            </div>
          </Col>
        </Row>
      </BackgroundContent>
      {showModalForgotPassword && (
        <FormForgotPassword onClose={() => setShowModalForgotPassword(false)} />
      )}
      {showModalResendEmail && (
        <FormResendEmail onClose={() => setShowModalResendEmail(false)} />
      )}
    </React.Fragment>
  );
};

export default SignIn;

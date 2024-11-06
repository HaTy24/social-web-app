import { Col, Row } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useHistory } from "react-router-dom";
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
import VerifyEmail from "./verifyEmail";
import i18next from "i18next";
import { LanguageIcon } from "../icons/LanguageIcon";

const SignUp = (props) => {
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [showModalVerifyEmail, setShowModalVerifyEmail] = useState(false);
  const user = useSelector((state) => state.profile.user);
  const [emailVerify, setEmailVerify] = useState("");
  const [loadingSingUp, setLoadingSignUp] = useState(false);
  const [loadingResendEmail, setLoadingReSendEmail] = useState(false);
  const [isStartCountDown, setIsStartCountDown] = useState(false);
  const isEnableLoginGoogle = checkEnableGoogleLogin();
  const [lang, setLang] = useState(i18next.language);

  const email = new URLSearchParams(useLocation().search).get("email");
  const referenceid = new URLSearchParams(useLocation().search).get(
    "referenceid"
  );
  const signature = new URLSearchParams(useLocation().search).get("signature");

  useEffect(() => {
    if (email) {
      formik.setFieldValue("email", email);
    }
  }, [email]);

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required(i18next.t("fullNameInvalid"))
      .max(255, i18next.t("fullNameTooLong")),
    userName: Yup.string()
      .required(i18next.t("usernameInvalid"))
      .max(255, i18next.t("usernameTooLong"))
      .matches(/^[a-zA-Z0-9]*$/, i18next.t("allowLettersAndNumbers")),
    email: Yup.string()
      .email(i18next.t("emailInvalid"))
      .matches(/@[^.]*\./, i18next.t("emailInvalid"))
      .required(i18next.t("emailInvalid"))
      .max(255, i18next.t("emailTooLong")),
    password: Yup.string()
      .min(8, i18next.t("passwordLengthRequirement"))
      .matches(/[a-z]/, i18next.t("passwordLowercase"))
      .matches(/[A-Z]/, i18next.t("passwordUppercase"))
      .matches(/[0-9]/, i18next.t("passwordNumber"))
      .matches(/[^a-zA-Z0-9.]/, i18next.t("passwordSpecialChar"))
      .required(i18next.t("passwordInvalid")),
    website: Yup.string()
      .url(i18next.t("websiteInvalid"))
      .max(255, i18next.t("websiteTooLong")),
    description: Yup.string().max(500, i18next.t("descriptionTooLong")),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      userName: "",
      website: "",
      description: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const data = values;
        !data.website && delete data.website;
        !data.description && delete data.description;
        if (referenceid || signature) {
          data.metadata = JSON.stringify({
            referenceid,
            signature,
            type: "augmentlabs",
          });
        }
        if (email) {
          data.originalEmail = email;
        }

        setLoadingSignUp(true);
        const response = await authService.registerWithEmail(data);
        setLoadingSignUp(false);
        if (response.success) {
          if (referenceid) {
            toast(i18next.t("registrationSuccessful"));

            history.push("/");

            return;
          }

          setEmailVerify(values.email);
          setShowModalVerifyEmail(true);
          formik.handleReset();
          return;
        }
        toast(
          i18next.t(
            handleCheckMsgError(
              response.message,
              i18next.t("signUpUnsuccessful")
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
        setLoadingSignUp(false);
        console.log(error);
      }
    },
  });
  const handleResendEmail = async () => {
    try {
      setLoadingReSendEmail(true);
      const result = await authService.reSendEmail({
        email: emailVerify,
        type: "verify_email",
      });
      setLoadingReSendEmail(false);
      if (result.success) {
        setIsStartCountDown(true);
        return;
      }
      toast(handleCheckMsgError(result.message, `${i18next.t("resendEmailUnsuccessful")}`), {
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
                  width={160}
                  height={160}
                />
              </Link>
              <h2
                style={{
                  fontSize: "1.5rem",
                  margin: 0,
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
                    <label>{i18next.t("fullName")}</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      placeholder={i18next.t("yourFullName")}
                    />
                    {formik.touched.fullName && formik.errors.fullName ? (
                      <div
                        style={{
                          color: "#FF4444",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <CloseIcon color={"#FF4444"} height={24} width={24} />
                        {formik.errors.fullName}
                      </div>
                    ) : null}
                  </FormControl>
                  <FormControl>
                    <label>{i18next.t("userName")}</label>
                    <input
                      type="text"
                      name="userName"
                      value={formik.values.userName}
                      onChange={formik.handleChange}
                      placeholder={i18next.t("yourUserName")}
                    />
                    {formik.touched.userName && formik.errors.userName ? (
                      <div
                        style={{
                          color: "#FF4444",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <CloseIcon color={"#FF4444"} height={24} width={24} />
                        {formik.errors.userName}
                      </div>
                    ) : null}
                  </FormControl>
                  <FormControl>
                    <label>{i18next.t("email")}</label>
                    <input
                      type="text"
                      name="email"
                      readOnly={referenceid?.length}
                      style={
                        referenceid
                          ? {
                              cursor: "not-allowed",
                              opacity: 0.5,
                            }
                          : {}
                      }
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
                  <FormControl>
                    <label>{i18next.t("website")}</label>
                    <input
                      type="text"
                      name="website"
                      value={formik.values.website}
                      onChange={formik.handleChange}
                      placeholder={i18next.t("yourWebsite")}
                    />
                    {formik.touched.website && formik.errors.website ? (
                      <div
                        style={{
                          color: "#FF4444",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <CloseIcon color={"#FF4444"} height={24} width={24} />
                        {formik.errors.website}
                      </div>
                    ) : null}
                  </FormControl>
                  <FormControl>
                    <label>{i18next.t("bio")}</label>
                    <input
                      type="text"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      placeholder={i18next.t("yourDescription")}
                    />
                    {formik.touched.description && formik.errors.description ? (
                      <div
                        style={{
                          color: "#FF4444",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <CloseIcon color={"#FF4444"} height={24} width={24} />
                        {formik.errors.description}
                      </div>
                    ) : null}
                  </FormControl>
                  <button
                  // style={{
                  //   opacity: isDisable ? 0.5 : 1,
                  // }}
                  // disabled={isDisable}
                  >
                    {i18next.t("signUp")}
                    {loadingSingUp && (
                      <Loading
                        style={{ padding: 0, marginTop: "3px" }}
                        size={10}
                        color={"#fff"}
                      />
                    )}
                  </button>
                  <div style={{ color: "#fff", textAlign: "center" }}>
                    <span style={{ color: "#94A3B8" }}>
                      {i18next.t("alreadyHaveAccount")}
                      &nbsp;<Link to="/">{i18next.t("signIn")}</Link>
                    </span>
                  </div>
                </FormSigIn>
                {isEnableLoginGoogle && !referenceid && (
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
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
      {showModalVerifyEmail && (
        <VerifyEmail
          handleResend={handleResendEmail}
          onBack={() => setShowModalVerifyEmail(false)}
          isLoading={loadingResendEmail}
          isStartCountDown={isStartCountDown}
          setIsStartCountDown={setIsStartCountDown}
          email={emailVerify}
        />
      )}
    </React.Fragment>
  );
};

export default SignUp;

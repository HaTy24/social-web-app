import { Col, Row } from "antd";
import { useFormik } from "formik";
import i18next from "i18next";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getStaticURL } from "../../constants";
import { authService } from "../../services/AuthService";
import { capitalizeFirstWord } from "../../utils/convertString";
import { CloseIcon } from "../icons/CloseIcon";
import { EyeOffIcon } from "../icons/EyeOffIcon";
import { EyeOnIcon } from "../icons/EyeOnIcon";
import Loading from "../loading";
import {
  BackgroundContent,
  FormControl,
  FormGroup,
  FormSigIn,
} from "../styles/signin";

const ResetPassword = () => {
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = new URLSearchParams(useLocation().search).get("token");

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, `${i18next.t("passwordLengthRequirement")}`)
      .matches(/[a-z]/, `${i18next.t("passwordLowercase")}`)
      .matches(/[A-Z]/, `${i18next.t("passwordUppercase")}`)
      .matches(/[0-9]/, `${i18next.t("passwordNumber")}`)
      .matches(
        /[^a-zA-Z0-9.]/,
        `${i18next.t("passwordSpecialChar")}`
      )
      .required(`${i18next.t("passwordInvalid")}`),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], `${i18next.t("passwordsMatch")}`)
      .required(`${i18next.t("confirmPasswordRequired")}`),
  });
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await authService.resetPassword({
          token: token,
          password: values.password,
        });
        setLoading(false);
        if (response.success) {
          history.push("/");
          formik.handleReset();
          return;
        }
        toast(capitalizeFirstWord(response.message) || `${i18next.t("signUpUnsuccessful")}`, {
          type: "error",
          position: "top-right",
          autoClose: 3000,
          closeOnClick: true,
        });
      } catch (error) {
        setLoading(false);
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
        <Row>
          <Col span={24}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                {i18next.t("resetPassword")}
              </h2>
              <FormGroup>
                <FormSigIn onSubmit={formik.handleSubmit} autoComplete="off">
                  <FormControl>
                    <label>{i18next.t("newPassword")}</label>
                    <div style={{ position: "relative", width: "100%" }}>
                      <input
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        autoComplete="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password"
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
                    <label>{i18next.t("confirmPassword")}</label>
                    <div style={{ position: "relative", width: "100%" }}>
                      <input
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        autoComplete="new-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Your confirmPassword"
                      />
                      <div
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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
                        {showConfirmPassword ? <EyeOnIcon /> : <EyeOffIcon />}
                      </div>
                    </div>
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword ? (
                      <div
                        style={{
                          color: "#FF4444",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <CloseIcon color={"#FF4444"} height={24} width={24} />
                        {formik.errors.confirmPassword}
                      </div>
                    ) : null}
                  </FormControl>
                  <button>
                    {i18next.t("submit")}
                    {loading && (
                      <Loading
                        style={{ padding: 0, marginTop: "3px" }}
                        size={10}
                        color={"#fff"}
                      />
                    )}
                  </button>
                </FormSigIn>
              </FormGroup>
            </div>
          </Col>
        </Row>
      </BackgroundContent>
    </React.Fragment>
  );
};

export default ResetPassword;

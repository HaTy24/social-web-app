import React, { useState } from "react";

import { Link } from "react-router-dom";
import { getStaticURL } from "../constants";
import { PolicyBox } from "./styles/common";
import { BackgroundContent } from "./styles/signin";
import i18next from "i18next";
import { LanguageIcon } from "./icons/LanguageIcon";

const TermOfService = () => {
  const [lang, setLang] = useState(i18next.language);

  return (
    <React.Fragment>
      <BackgroundContent
        style={{
          minHeight: "100vh",
          overflow: "hidden",
          backgroundColor: "#18181B",
        }}
      >
        <div>
          <div
            style={{
              backgroundColor: window.matchMedia("(max-width: 768px)").matches
                ? "#18181B"
                : "transparent",
              width: "100%",
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
                width={150}
                height={150}
              />
            </Link>
            <PolicyBox>
              <div>
                {i18next.t("termsOfServices.welcomeToWeknot")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("termsOfServices.userAuthenticationAndProfileInformationTitle")}
              </h3>
              <div>
                {i18next.t("termsOfServices.userAuthenticationAndProfileInformationContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("termsOfServices.prohibitedActivitiesTitle")}
              </h3>
              <div>
                {i18next.t("termsOfServices.prohibitedActivitiesContent")}
              </div>
              <div>
                {i18next.t("termsOfServices.prohibitedActivitiesSubContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("termsOfServices.respectfulCommunicationTitle")}
              </h3>
              <div>
                {i18next.t("termsOfServices.respectfulCommunicationContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("termsOfServices.intellectualPropertyTitle")}
              </h3>
              <div>
                {i18next.t("termsOfServices.intellectualPropertyContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("termsOfServices.accountSecurityTitle")}
              </h3>
              <div>
                {i18next.t("termsOfServices.accountSecurityContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("termsOfServices.reportingViolationsTitle")}
              </h3>
              <div>
                {i18next.t("termsOfServices.reportingViolationsContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("termsOfServices.terminationOfAccountsTitle")}
              </h3>
              <div>
                {i18next.t("termsOfServices.terminationOfAccountsContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("termsOfServices.changesToTermsTitle")}
              </h3>
              <div>
                {i18next.t("termsOfServices.changesToTermsContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("termsOfServices.noGuaranteeOfContentAccuracyTitle")}
              </h3>
              <div>
                {i18next.t("termsOfServices.noGuaranteeOfContentAccuracyContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("termsOfServices.liabilityTitle")}
              </h3>
              <div>
                {i18next.t("termsOfServices.liabilityContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("termsOfServices.governingLawTitle")}
              </h3>
              <div>
                {i18next.t("termsOfServices.governingLawContent")}
              </div>
              <div>
                {i18next.t("termsOfServices.governingLawSubContent")}
              </div>
            </PolicyBox>
          </div>
        </div>
      </BackgroundContent>
    </React.Fragment>
  );
};

export default TermOfService;

import React, { useState } from "react";

import { Link } from "react-router-dom";
import { getStaticURL } from "../constants";
import { PolicyBox } from "./styles/common";
import { BackgroundContent } from "./styles/signin";
import i18next from "i18next";
import { LanguageIcon } from "./icons/LanguageIcon";

const PrivacyPolicy = () => {
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
                {i18next.t("privacyAndSafety.welcomeToWeknot")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("privacyAndSafety.informationWeCollectTitle")}
              </h3>
              <div>
                {i18next.t("privacyAndSafety.informationWeCollectContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("privacyAndSafety.dataSharingTitle")}
              </h3>
              <div>
                {i18next.t("privacyAndSafety.dataSharingContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("privacyAndSafety.cookiesTitle")}
              </h3>
              <div>
                {i18next.t("privacyAndSafety.cookiesContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("privacyAndSafety.securityPracticesTitle")}
              </h3>
              <div>
                {i18next.t("privacyAndSafety.securityPracticesContent")}
              </div>
              <div>
                {i18next.t("privacyAndSafety.securityPracticesSubContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("privacyAndSafety.changesToPrivacyPolicyTitle")}
              </h3>
              <div>
                {i18next.t("privacyAndSafety.changesToPrivacyPolicyContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("privacyAndSafety.userResponsibilitiesTitle")}
              </h3>
              <div>
                {i18next.t("privacyAndSafety.userResponsibilitiesContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("privacyAndSafety.notLiableForLossOrDamageTitle")}
              </h3>
              <div>
                {i18next.t("privacyAndSafety.notLiableForLossOrDamageContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("privacyAndSafety.thirdPartyLinksTitle")}
              </h3>
              <div>
                {i18next.t("privacyAndSafety.thirdPartyLinksContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("privacyAndSafety.childrenPrivacyTitle")}
              </h3>
              <div>
                {i18next.t("privacyAndSafety.childrenPrivacyContent")}
              </div>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  margin: "30px 0 6px 0",
                }}
              >
                {i18next.t("privacyAndSafety.contactInformationTitle")}
              </h3>
              <div>
                {i18next.t("privacyAndSafety.contactInformationContent")}
              </div>
            </PolicyBox>
          </div>
        </div>
      </BackgroundContent>
    </React.Fragment>
  );
};

export default PrivacyPolicy;

import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getStaticURL } from "../../constants";
import { customFormat } from "../../utils/Number";
import { Header, NavbarUserBalance } from "../styles/common";
import i18next from "i18next";
import { UserImage } from "../styles/profile";
import HeaderBalance from "../layouts/HeaderBalance";

const PrivacyAndSafety = () => {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);

  return (
    <>
      <HeaderBalance title="Privacy And Safety" />
      <div
        style={{
          padding: "24px 16px",
          color: theme.color,
          fontSize: "16px",
        }}
      >
        <div>
          {i18next.t("privacyAndSafety.welcomeToWeknot")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("privacyAndSafety.informationWeCollectTitle")}
        </h3>
        <div>
          {i18next.t("privacyAndSafety.informationWeCollectContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("privacyAndSafety.dataSharingTitle")}
        </h3>
        <div>
          {i18next.t("privacyAndSafety.dataSharingContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("privacyAndSafety.cookiesTitle")}
        </h3>
        <div>
          {i18next.t("privacyAndSafety.cookiesContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
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
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("privacyAndSafety.changesToPrivacyPolicyTitle")}
        </h3>
        <div>
          {i18next.t("privacyAndSafety.changesToPrivacyPolicyContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("privacyAndSafety.userResponsibilitiesTitle")}
        </h3>
        <div>
          {i18next.t("privacyAndSafety.userResponsibilitiesContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("privacyAndSafety.notLiableForLossOrDamageTitle")}
        </h3>
        <div>
          {i18next.t("privacyAndSafety.notLiableForLossOrDamageContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("privacyAndSafety.thirdPartyLinksTitle")}
        </h3>
        <div>
          {i18next.t("privacyAndSafety.thirdPartyLinksContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("privacyAndSafety.childrenPrivacyTitle")}
        </h3>
        <div>
          {i18next.t("privacyAndSafety.childrenPrivacyContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("privacyAndSafety.contactInformationTitle")}
        </h3>
        <div>
          {i18next.t("privacyAndSafety.contactInformationContent")}
        </div>

      </div>
    </>
  );
};

export default PrivacyAndSafety;

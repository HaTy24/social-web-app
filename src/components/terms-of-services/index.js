import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getStaticURL } from "../../constants";
import { customFormat } from "../../utils/Number";
import { Header, NavbarUserBalance } from "../styles/common";
import { UserImage } from "../styles/profile";
import i18next from "i18next";
import HeaderBalance from "../layouts/HeaderBalance";

const TermsOfServices = () => {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);

  return (
    <>
      <HeaderBalance title="Terms of Services" />
      <div
        style={{
          padding: "24px 16px",
          color: theme.color,
          fontSize: "16px",
        }}
      >
        <div>
          {i18next.t("termsOfServices.welcomeToWeknot")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("termsOfServices.userAuthenticationAndProfileInformationTitle")}
        </h3>
        <div>
          {i18next.t("termsOfServices.userAuthenticationAndProfileInformationContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
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
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("termsOfServices.respectfulCommunicationTitle")}
        </h3>
        <div>
          {i18next.t("termsOfServices.respectfulCommunicationContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("termsOfServices.intellectualPropertyTitle")}
        </h3>
        <div>
          {i18next.t("termsOfServices.intellectualPropertyContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("termsOfServices.accountSecurityTitle")}
        </h3>
        <div>
          {i18next.t("termsOfServices.accountSecurityContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("termsOfServices.reportingViolationsTitle")}
        </h3>
        <div>
          {i18next.t("termsOfServices.reportingViolationsContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("termsOfServices.terminationOfAccountsTitle")}
        </h3>
        <div>
          {i18next.t("termsOfServices.terminationOfAccountsContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("termsOfServices.changesToTermsTitle")}
        </h3>
        <div>
          {i18next.t("termsOfServices.changesToTermsContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("termsOfServices.noGuaranteeOfContentAccuracyTitle")}
        </h3>
        <div>
          {i18next.t("termsOfServices.noGuaranteeOfContentAccuracyContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
          }}
        >
          {i18next.t("termsOfServices.liabilityTitle")}
        </h3>
        <div>
          {i18next.t("termsOfServices.liabilityContent")}
        </div>
        <h3
          style={{
            color: theme.color,
            fontWeight: "bold",
            margin: "20px 0 6px 0",
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
      </div>
    </>
  );
};

export default TermsOfServices;

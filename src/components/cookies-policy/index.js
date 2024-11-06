import React from "react";

import { Link } from "react-router-dom";
import { getStaticURL } from "../../constants";
import { BackgroundContent } from "../styles/signin";
import { OrdersList } from "../styles/cookie-policy";
import { PolicyBox } from "../styles/common";

const CookiesPolicy = () => {
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
            <Link to="/">
              <img
                src={`${getStaticURL()}/assets/images/weknot_logo_c.svg`}
                alt="Weknot"
                width={150}
                height={150}
              />
            </Link>
            <PolicyBox>
              <h2
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Cookies Policy
              </h2>
              <OrdersList>
                <li>
                  <h3 className="title">Introduction</h3>
                </li>
                <ul>
                  <li className="subTitle">
                    This Cookie Policy explains how we use cookies and similar
                    technologies to store information about you and your
                    preferences. Our primary aim is to enhance your experience
                    with our product.
                  </li>
                </ul>
                <li>
                  <h3 className="title">What are Cookies?</h3>
                </li>
                <ul>
                  <li className="subTitle">
                    Cookies are small data files stored on your device when you
                    visit a website. They enable the site to remember your
                    actions and preferences over a period.
                  </li>
                </ul>
                <li>
                  <h3 className="title">How We Use Cookies</h3>
                </li>
                <ul>
                  <li className="subTitle">
                    We use cookies to: Store information you share with us.
                    Improve and personalize your experience. Analyze how you
                    interact with our product to make improvements.
                  </li>
                </ul>
                <li>
                  <h3 className="title">Types of Cookies We Use</h3>
                </li>
                <ul>
                  <li className="subTitle">
                    Essential Cookies: Necessary for the website to function.
                    Performance Cookies: Collect data about your use of our
                    product. Functionality Cookies: Remember your preferences
                    and various settings. Targeting Cookies: Track your browsing
                    habits to deliver tailored advertising.
                  </li>
                </ul>
                <li>
                  <h3 className="title">Your Consent</h3>
                </li>
                <ul>
                  <li className="subTitle">
                    By using our product, you consent to the use of cookies as
                    described in this policy.
                  </li>
                </ul>
                <li>
                  <h3 className="title">Managing Cookies</h3>
                </li>
                <ul>
                  <li className="subTitle">
                    You can control and manage cookies through your browser
                    settings. However, disabling cookies may affect the
                    functionality of our product.
                  </li>
                </ul>
                <li>
                  <h3 className="title">Data Security</h3>
                </li>
                <ul>
                  <li className="subTitle">
                    We are committed to protecting your data. However, we cannot
                    guarantee the security of data transmitted to our site.
                  </li>
                </ul>
                <li>
                  <h3 className="title">Limitation of Liability</h3>
                </li>
                <ul>
                  <li className="subTitle">
                    We will not be responsible for any loss or damage arising
                    from your use of our product, including but not limited to
                    data loss or breach.
                  </li>
                </ul>
                <li>
                  <h3 className="title">Changes to This Policy</h3>
                </li>
                <ul>
                  <li className="subTitle">
                    We reserve the right to modify this policy at any time. Any
                    changes will be effective immediately upon posting.
                  </li>
                </ul>
                <li>
                  <h3 className="title">Contact Us</h3>
                </li>
                <ul>
                  <li className="subTitle">
                    If you have any questions about this policy, please contact
                    us.
                  </li>
                </ul>
              </OrdersList>
            </PolicyBox>
          </div>
        </div>
      </BackgroundContent>
    </React.Fragment>
  );
};

export default CookiesPolicy;

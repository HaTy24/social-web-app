import { Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import { userService } from "../../services/UserService";
import { customFormat } from "../../utils/Number";
import Loading from "../loading";
import { SET_USER } from "../../redux/actions";
import {
  Button,
  Header,
  NavbarUserBalance,
  ProfileCorner,
} from "../styles/common";
import { UserImage } from "../styles/profile";
import { getStaticURL } from "../../constants";
import HeaderBalance from "../layouts/HeaderBalance";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import i18next from "i18next";

function Games() {
  const query = new URLSearchParams(useLocation().search).get("refCode");
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);
  const [refCode, setRefCode] = useState();
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Referral / Weknot.io";
  }, []);

  const handleReferral = async (e) => {
    setDisabled(true);
    e.preventDefault();
    const refCode = e.target["refCode"].value;
    const response = await userService.referral(refCode);
    if (response.success) {
      toast(`${i18next.t("referralSuccessfullyUpdated")}`);
      dispatch({
        type: SET_USER,
        payload: {
          ...user,
          referral: refCode,
        },
      });
    } else {
      toast.error(`${i18next.t("referralUpdateUnsuccessfully")}`);
    }
    setDisabled(false);
  };
  useEffect(() => {
    query && setRefCode(query);
  }, [query]);

  return (
    <ProfileCorner border={theme.border}>
      <HeaderBalance title={i18next.t("referral.title")} />
      <form
        onSubmit={handleReferral}
        style={{
          padding: "10px 20px 30px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ color: `${theme.color}`, fontSize: "16px" }}>
          {i18next.t("referral.yourReferrerCode")}:
        </div>
        <Input
          id="refCode"
          name="refCode"
          style={{
            padding: "10px",
            marginTop: "10px",
            borderRadius: "10px",
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bg,
            fontSize: "16px",
            color: theme.color,
          }}
          value={user.referral || refCode}
          bordered={false}
          placeholder={i18next.t("referral.yourReferrerCode")}
          onChange={(e) => setRefCode(e.target.value)}
          disabled={user.referral}
        />
        {!user.referral && (
          <Button
            style={{
              borderRadius: "8px",
              width: "100%",
              padding: "10px 0",
              color: `${theme.color}`,
              marginTop: "50px",
              backgroundColor: `${theme.bg}`,
              border: `1px solid ${theme.color}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "start",
              gap: "5px",
            }}
            type="submit"
            disabled={disabled || user.referral}
          >
            {i18next.t("referral.submit")}
            {disabled && (
              <Loading style={{ padding: 0 }} color={theme.color} size={10} />
            )}
          </Button>
        )}
      </form>
    </ProfileCorner>
  );
}

export default Games;

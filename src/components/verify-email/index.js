import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { authService } from "../../services/AuthService";
import Loading from "../loading";

const VerifyEmail = () => {
  const history = useHistory();
  const token = new URLSearchParams(useLocation().search).get("token");
  const handleVerifyEmail = async () => {
    try {
      const response = await authService.verifyEmail({ token });
      if (response.success) {
        localStorage.setItem("jwt", response.data.access_token);
        history.push("/home");

        return;
      }
      history.push("/sign-up");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleVerifyEmail();
  }, [token]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#18181B",
      }}
    >
      <Loading style={{ padding: 0 }} />
    </div>
  );
};
export default VerifyEmail;

import { Button } from "antd";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { ERR_CODE, getStaticURL } from "../../constants";
import { userService } from "../../services/UserService";
import { ButtonValidatePIN } from "../buy-sell/ButtonValidatePIN";
import Modal from "../modal";
import { ExportKey } from "../styles/profile-wallet";
import EnterPinModal from "./EnterPinModal";
import { authService } from "../../services/AuthService";
import i18next from "i18next";

export const ExportPrivateKey = () => {
  const [isShowModalEnterPin, setIsShowModalEnterPin] = useState(false);
  const [pin, setPin] = useState("");
  const [privateKey, setPrivateKey] = useState();
  const [isShowModalCopyPrivateKey, setIsShowModalCopyPrivateKey] =
    useState(false);
  const user = useSelector((state) => state.profile.user);
  const theme = useSelector((state) => state.theme);
  const hashWalletAddress = useMemo(() => {
    if (user.walletAddress) {
      return (
        user.walletAddress.slice(0, 4) + "..." + user.walletAddress.slice(-6)
      );
    }
    return "";
  }, [user]);

  const handleSubmitPIN = async (pin) => {
    if (!pin) {
      return;
    }
    try {
      setIsShowModalEnterPin(true);
      const response = await authService.getPrivateKey(pin);
      if (response.success) {
        setPrivateKey(response.data);
        setIsShowModalEnterPin(false);
        setIsShowModalCopyPrivateKey(true);
      } else {
        Swal.fire({
          color: theme.color,
          title: response.message || `${i18next.t("profileWallet.exportPrivateKeyFailed")}`,
          icon: "error",
          text:
            response.code === ERR_CODE.INVALID_PIN
              ? `${i18next.t("incorrectPINError")} ${response.data.attemptsLeft} ${i18next.t("attemptsLeftToRetry")}`
              : "",
          background: theme.tweetHov,
          confirmButtonColor: "#3085d6",
        }).then(() => {
          setIsShowModalCopyPrivateKey(false);
          setIsShowModalEnterPin(true);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleExportPrivateKey = async () => {
    if (!!privateKey) {
      navigator.clipboard
        .writeText(privateKey)
        .then(() => toast(`${i18next.t("copiedToClipboard")}`), {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      return;
    } else {
      setIsShowModalCopyPrivateKey(false);
      setIsShowModalEnterPin(true);
    }
  };

  const toggleOpen = () => {
    setIsShowModalCopyPrivateKey(!isShowModalCopyPrivateKey);
  };

  return (
    <div style={{ width: "100%", padding: "10px 20px" }}>
      <ButtonValidatePIN
        handleTradeShare={() => {
          setIsShowModalCopyPrivateKey(true);
        }}
        text={i18next.t("profileWallet.exportPrivateKey")}
        style={{
          borderRadius: "8px",
          width: "100%",
          padding: "10px 0",
          color: `${theme.color}`,
          backgroundColor: `${theme.bg}`,
          border: `1px solid ${theme.color}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          gap: "5px",
        }}
      />
      <EnterPinModal
        isOpen={isShowModalEnterPin}
        setIsOpen={setIsShowModalEnterPin}
        onSubmit={handleSubmitPIN}
        textConfirm="Confirm"
      />
      {isShowModalCopyPrivateKey && (
        <Modal
          toggleOpen={toggleOpen}
          children={
            <ExportKey>
              <img
                src={`${getStaticURL()}/assets/images/export-key.svg`}
                alt="Weknot"
                width={150}
                height={150}
              />
              <p className="hash-address" style={{ color: theme.color }}>
                {hashWalletAddress}
              </p>
              <p className="description" style={{ color: theme.color }}>
                {i18next.t("profileWallet.exportPrivateKeyTitle")}
              </p>
              <div style={{ width: "100%" }}>
                <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      border: `1px solid #00A8FF`,
                      color: "#00A8FF",
                    }}
                  >
                    1
                  </div>
                  <p
                    className="description"
                    style={{ color: theme.color, maxWidth: "80%" }}
                  >
                    {i18next.t("profileWallet.exportPrivateKeyCopyContent")}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      border: `1px solid #00A8FF`,
                      color: "#00A8FF",
                    }}
                  >
                    2
                  </span>
                  <p
                    className="description"
                    style={{ color: theme.color, maxWidth: "80%" }}
                  >
                    {i18next.t("profileWallet.exportPrivateKeyImportContent")}
                  </p>
                </div>
              </div>
              <div style={{ width: "100%", gap: "10px", width: "100%" }}>
                <Button
                  onClick={() => handleExportPrivateKey()}
                  bg="rgb(29, 161, 242)"
                  hoverBg="rgb(202,32,85)"
                  color="rgb(255,255,255)"
                  style={{
                    borderRadius: "5px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "20px",
                    height: "50px",
                  }}
                >
                  {privateKey ? `${i18next.t("profileWallet.copyKey")}` : `${i18next.t("profileWallet.exportKey")}`}
                </Button>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <img
                  src={`${getStaticURL()}/assets/images/alert-triangle.svg`}
                  alt="Weknot"
                  width={24}
                  height={24}
                />
                <p
                  className="description"
                  style={{
                    color: theme.color,
                    marginBottom: "0px",
                    color: "#D97706",
                  }}
                >
                  {i18next.t("profileWallet.neverSharePrivateKey")}
                </p>
              </div>
            </ExportKey>
          }
          handleClose={() => {
            setIsShowModalCopyPrivateKey(false);
          }}
          padding="5px 20px"
          heading={i18next.t("profileWallet.exportPrivateKey")}
          display="flex"
          style={{
            overflow: "auto",
          }}
        />
      )}
    </div>
  );
};

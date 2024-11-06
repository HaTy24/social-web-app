import React from "react";
import Modal from "../modal";
import { ModalTransfer } from "../styles/profile-wallet";
import {
  ApproxText,
  InfoSharePice,
  QuantityInput,
  QuantityInputContainer,
  QuantityInputLabel,
  StyledBuyInfo,
  StyledContainer,
  StyledTextPrimary,
} from "../styles/buy-sell";
import { customFormat, removeTrailingZeros } from "../../utils/Number";
import { ButtonValidatePIN } from "./ButtonValidatePIN";
import { useSelector } from "react-redux";
import i18next from "i18next";

export const ModalBuyCustomQuantity = (props) => {
  const {
    userInfo,
    setQuantityInput,
    quantityInput,
    liveBNBBalance,
    handleSubmit,
    onClose,
    isBuyLoading,
  } = props;
  const theme = useSelector((state) => state.theme);
  return (
    <Modal
      toggleOpen={() => setIsShowModalCustomQuantity(false)}
      children={
        <ModalTransfer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              padding: "24px",
              paddingBottom: "36px",
            }}
          >
            <StyledContainer>
              <StyledTextPrimary style={{ color: theme.color }}>
                {`${i18next.t("buyShare.buy")} ${userInfo.fullname}${i18next.t("buyShare.sShares")}`}
              </StyledTextPrimary>
              <StyledBuyInfo style={{ marginBottom: "10px" }}>
                <InfoSharePice style={{ color: theme.color }}>
                  {i18next.t("buyShare.1Share")}{" "}
                  <div>
                    {removeTrailingZeros(
                      customFormat(userInfo?.share?.buyPrice, 6)
                    )}{" "}
                    BNB
                  </div>
                </InfoSharePice>
                <QuantityInputContainer>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <QuantityInput
                      style={{ color: theme.color }}
                      type="number"
                      min={0}
                      value={quantityInput}
                      onChange={(e) => setQuantityInput(e.target.value)}
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-", ".", ","].includes(e.key) &&
                        e.preventDefault()
                      }
                    />
                    <QuantityInputLabel style={{ color: theme.color }}>
                      {i18next.t("buyShare.shares")}
                    </QuantityInputLabel>
                  </div>
                  <ApproxText color="#4a4a4a" style={{ fontFamily: "Inter" }}>
                    {i18next.t("buyShare.approx")}
                    {removeTrailingZeros(
                      customFormat(
                        liveBNBBalance?.USD *
                          userInfo?.share?.buyPrice *
                          Number(quantityInput),
                        6
                      )
                    )}
                    (
                    {removeTrailingZeros(
                      customFormat(
                        userInfo?.share?.buyPrice * Number(quantityInput),
                        6
                      )
                    )}{" "}
                    BNB)
                  </ApproxText>
                </QuantityInputContainer>
              </StyledBuyInfo>
            </StyledContainer>
            <StyledContainer>
              <StyledTextPrimary
                style={{
                  color: theme.color,
                  fontSize: "16px",
                  fontWeight: "900",
                }}
              >
                <span style={{ color: "red", fontSize: "20px" }}>*</span>&nbsp;
                {`${i18next.t("buyShare.sharePriceIncludesAnAdditional")} ${removeTrailingZeros(
                  customFormat(userInfo?.share?.txFee, 6)
                )} BNB ${i18next.t("buyShare.ofTransactionFee")}`}
              </StyledTextPrimary>
            </StyledContainer>
            <span
              style={{
                fontSize: "16px",
                color: theme.color,
                fontWeight: 400,
                textAlign: "center",
              }}
            >
              {i18next.t("buyShare.youHaveToPay")}{" "}
              {removeTrailingZeros(
                customFormat(
                  userInfo?.share?.buyPrice * Number(quantityInput) +
                    Number(userInfo?.share?.txFee),
                  6
                )
              )}{" "}
              BNB {i18next.t("buyShare.feeIncluded")}
            </span>
            <ButtonValidatePIN
              style={{ width: "100%" }}
              handleTradeShare={handleSubmit}
              text={"Buy"}
              isDisable={isBuyLoading || quantityInput <= 0}
              isLoading={isBuyLoading}
              bgColor={"#11B981"}
              opacity
            />
          </div>
        </ModalTransfer>
      }
      handleClose={onClose}
      padding="5px 20px"
      heading=" "
      display="flex"
    />
  );
};

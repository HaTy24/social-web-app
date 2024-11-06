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

export const ModalSellCustomQuantity = (props) => {
  const theme = useSelector((state) => state.theme);

  const {
    userInfo,
    setQuantityInput,
    quantityInput,
    liveBNBBalance,
    handleSubmit,
    onClose,
    isBuyLoading,
    max,
  } = props;
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
                {`${i18next.t("buyShare.sell")} ${userInfo.fullname}${i18next.t("buyShare.sShares")}`}
              </StyledTextPrimary>
              <StyledBuyInfo>
                <InfoSharePice style={{ color: theme.color }}>
                  {i18next.t("buyShare.1Share")}{" "}
                  <div>
                    {removeTrailingZeros(
                      customFormat(userInfo?.share?.sellPrice, 6)
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
                  {max && quantityInput > max && (
                    <span style={{ color: "red" }}>
                      {i18next.t("buyShare.youHaveToPay")} {max} {i18next.t("buyShare.shares")}
                    </span>
                  )}
                  <ApproxText>
                    {i18next.t("buyShare.approx")}
                    {removeTrailingZeros(
                      customFormat(
                        liveBNBBalance?.USD *
                          userInfo?.share?.sellPrice *
                          Number(quantityInput),
                        6
                      )
                    )}
                    (
                    {removeTrailingZeros(
                      customFormat(
                        userInfo?.share?.sellPrice * Number(quantityInput),
                        6
                      )
                    )}{" "}
                    BNB)
                  </ApproxText>
                </QuantityInputContainer>
              </StyledBuyInfo>
            </StyledContainer>
            <ButtonValidatePIN
              style={{ width: "100%" }}
              handleTradeShare={handleSubmit}
              text={"Sell"}
              isDisable={
                isBuyLoading ||
                quantityInput <= 0 ||
                (max && quantityInput > max)
              }
              isLoading={isBuyLoading}
              bgColor={"#F43F5E"}
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

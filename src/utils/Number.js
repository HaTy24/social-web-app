import BigNumber from "bignumber.js";
import React from "react";

export function removeTrailingZeros(number) {
  const numberString = number.toString();
  return numberString.replace(/(\.[0-9]*[1-9])0+$/, "$1");
}

export function roundUp(num, precision) {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}

export function customFormat(balance, number) {
  if (Number(balance) === 0) {
    return 0;
  } else if (
    Number(balance) < 1 / Math.pow(10, number) &&
    Number(balance) > 0
  ) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1px",
        }}
      >
        <span style={{ paddingBottom: "1.5px" }}>&lt;</span>
        <span>{1 / Math.pow(10, number)}</span>
      </div>
    );
  } else {
    return removeTrailingZeros(
      Math.floor(balance * Math.pow(10, number)) / Math.pow(10, number)
    );
  }
}

export const BIG_TEN = new BigNumber(10);
export const convertBalanceDecimalToNumber = (balance, decimals) => {
  return new BigNumber(balance).div(BIG_TEN.pow(decimals)).toString();
};

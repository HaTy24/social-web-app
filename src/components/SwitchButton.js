import React from "react";
import { useSelector } from "react-redux";
import { Button } from "./styles/modal";

export const SwitchButton = (props) => {
  const { options = [], currentValue, setCurrentValue } = props;
  const theme = useSelector((state) => state.theme);

  return (
    <div
      style={{
        width: "100%",
        display: "grid",
        borderRadius: "50px",
        border: "1px solid #ccc",
        overflow: "hidden",
        gridTemplateColumns: "auto auto",
      }}
    >
      {options.map((item, index) => {
        return (
          <Button
            key={index}
            onClick={() => {
              setCurrentValue(item.value);
            }}
            style={{
              borderRadius: "unset",
              backgroundColor:
                currentValue === item.value ? theme.color : theme.bg,
              color: currentValue === item.value ? theme.bg : theme.color,
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
};

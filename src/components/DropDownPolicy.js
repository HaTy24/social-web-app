import React, { useRef, useState } from "react";

import { useSelector } from "react-redux";
import { ClickOutside } from "../utils/triggerClickOutside";
import {
  AutoComplete,
  AutoCompleteWrapper,
  Select,
  SelectItem,
  SelectWrapper,
} from "./styles/menubar";
import { ArrowTopLightIcon } from "./icons/ArrowTopLightIon";
import { ArrowBottomLightIcon } from "./icons/ArrowBottomLightIcon";
import { CheckIcon } from "./icons/CheckIcon";
import Loading from "./loading";

export default function DropDownPolicy(props) {
  const { listItem, currentItem, isShowValue, onChange, isLoading } = props;
  const theme = useSelector((state) => state.theme);
  const [isSelect, setIsSelect] = useState(false);
  const selectRef = useRef(null);

  const handleSetOption = (e, value) => {
    e.stopPropagation();

    if (onChange) onChange(value);
    setIsSelect(false);
  };

  ClickOutside(selectRef, () => {
    setIsSelect(false);
  });
  return (
    <SelectWrapper ref={selectRef}>
      <Select
        bg={theme.bg}
        border={theme.border}
        color={theme.color}
        tweetHov={theme.tweetHov}
        onClick={() => setIsSelect(!isSelect)}
      >
        <SelectItem style={{ marginRight: "0px", padding: 0 }}>
          {isLoading ? (
            <Loading style={{ padding: 0 }} color={theme.color} size={8} />
          ) : (
            <>
              {currentItem.icon && currentItem.icon}
              <span
                style={{
                  color: "#1D9BF0",
                  fontWeight: 700,
                  fontSize: "16px",
                  marginLeft: "8px",
                }}
              >
                {currentItem?.label}
              </span>
            </>
          )}
        </SelectItem>
        {isSelect ? (
          <ArrowTopLightIcon color={theme.color} />
        ) : (
          <ArrowBottomLightIcon color={theme.color} />
        )}
      </Select>
      {isSelect && (
        <AutoCompleteWrapper boxShadow={theme.boxShadow} bg={theme.bg}>
          <AutoComplete
            boxShadow={theme.boxShadow}
            bg={theme.bg}
            style={{ marginRight: 0 }}
          >
            {listItem?.map((item, index) => (
              <SelectItem
                key={index}
                bgHov={theme.tweetHov}
                onClick={(e) => handleSetOption(e, item)}
                style={{ marginRight: 0 }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {item.icon && item.icon}
                  <span
                    style={{
                      color: theme.color,
                      fontWeight: 700,
                      fontSize: "16px",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                {currentItem.value === item.value && <CheckIcon />}
              </SelectItem>
            ))}
          </AutoComplete>
        </AutoCompleteWrapper>
      )}
    </SelectWrapper>
  );
}

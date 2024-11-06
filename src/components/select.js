import React, { useRef, useState } from "react";

import { useSelector } from "react-redux";
import { ClickOutside } from "../utils/triggerClickOutside";
import { ArrowBottom } from "./icons/ArrowBottom";
import {
  AutoComplete,
  AutoCompleteWrapper,
  Select,
  SelectItem,
  SelectWrapper,
} from "./styles/game";
import { UserImage } from "./styles/profile";
import { ArrowDown } from "./icons/ArrowDown";
import { ArrowUp } from "./icons/ArrowUp";
import Loading from "./loading";

export default function SelectCustom(props) {
  const {
    listItem,
    currentItem,
    onChange,
    width,
    isShowValue,
    heightOption,
    isLoading,
  } = props;
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
    <SelectWrapper style={{ width: width || "auto" }} ref={selectRef}>
      <Select
        bg={theme.bg}
        border={theme.border}
        color={theme.color}
        tweetHov={theme.tweetHov}
        onClick={() => setIsSelect(!isSelect)}
      >
        <SelectItem style={{ padding: 0, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {isLoading ? (
              <Loading style={{ padding: 0 }} color={theme.color} size={8} />
            ) : (
              <>
                {currentItem.src && (
                  <UserImage
                    style={{ width: "16px", height: "16px" }}
                    src={currentItem.src}
                  />
                )}
                {currentItem.icon && currentItem.icon}
                <span style={{ color: theme.color }}>
                  {isShowValue ? currentItem?.value : currentItem?.label}
                </span>
              </>
            )}
          </div>
          {isShowValue && (
            <span style={{ color: theme.color }}>{currentItem?.label}</span>
          )}
        </SelectItem>
        {isSelect ? (
          <ArrowUp color={theme.color} />
        ) : (
          <ArrowDown color={theme.color} />
        )}
      </Select>
      {isSelect && (
        <AutoCompleteWrapper boxShadow={theme.boxShadow} bg={theme.bg}>
          <AutoComplete
            style={{ maxHeight: heightOption || "100%" }}
            boxShadow={theme.boxShadow}
            bg={theme.bg}
          >
            {listItem?.map((item, index) => (
              <SelectItem
                key={index}
                bgHov={theme.tweetHov}
                onClick={(e) => handleSetOption(e, item)}
              >
                {item.src && (
                  <UserImage
                    style={{ width: "16px", height: "16px" }}
                    src={item.src}
                  />
                )}
                {item.icon && item.icon}
                <span style={{ color: theme.color }}>{item.label}</span>
              </SelectItem>
            ))}
          </AutoComplete>
        </AutoCompleteWrapper>
      )}
    </SelectWrapper>
  );
}

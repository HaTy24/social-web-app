import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { ClickOutside } from "../../utils/triggerClickOutside";
import Icon from "../icon";
import { CopyLinkIcon } from "../icons/CopyLinkIcon";
import { ActivityBox, ActivityIcon, CopyLinkBox } from "../styles/common";
import i18next from "i18next";

const ShareComponent = (props) => {
  const ref = useRef(null);
  const [bookmarkDisabled, setBookmarkDisabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const theme = useSelector((state) => state.theme);
  const [isShowDes, setIsShowDes] = useState(false);
  const { tweet, disabled } = props;

  const bookmarkPath = [
    "M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z",
    "M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z",
  ];

  const handleBookmark = async (e) => {
    setBookmarkDisabled(true);
    navigator.clipboard.writeText(
      `${window.location.origin}/tweet/${tweet.slug}`
    );
    toggleModal(e);
    toast(`${i18next.t("copiedToClipboard")}`);
    setBookmarkDisabled(false);
  };

  const toggleDescription = () => {
    if (!window.matchMedia("(max-width: 768px)").matches) {
      setIsShowDes(!isShowDes);
    }
  };

  const toggleModal = (e) => {
    e.preventDefault();
    setIsModalOpen(!isModalOpen);
  };

  ClickOutside(ref, () => {
    setIsModalOpen(false);
  });

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <ActivityBox
        hoverColor={!disabled && "rgb(29,161,242)"}
        hoverBg={!disabled && "rgba(29,161,242,0.1)"}
        disabled={disabled}
        style={{ position: "relative" }}
        onMouseOver={!disabled && toggleDescription}
        onMouseOut={!disabled && toggleDescription}
      >
        <ActivityIcon onClick={toggleModal}>
          <Icon
            d={bookmarkPath}
            width="18.75px"
            height="18.75px"
            fill="rgb(101, 119, 134)"
          />
        </ActivityIcon>
      </ActivityBox>
      {isModalOpen && (
        <CopyLinkBox onClick={handleBookmark}>
          <CopyLinkIcon />
          <span style={{ fontSize: "16px", color: "black" }}>
            {i18next.t("profile.copyLink")}
          </span>
        </CopyLinkBox>
      )}
      {isShowDes && (
        <div
          style={{
            color: theme.color,
            position: "absolute",
            bottom: "-35px",
            padding: "5px 10px",
            borderRadius: "3px",
            backgroundColor: theme.border,
            width: "fit-content",
            minWidth: "48px",
            zIndex: 99,
          }}
        >
          {i18next.t("profile.shares")}
        </div>
      )}
    </div>
  );
};

export default ShareComponent;

import React from "react";
import { useSelector } from "react-redux";
import Icon from "./icon";
import {
  CloseButton,
  ModalBody,
  ModalContentCenter,
  ModalCorner,
  ModalHeader,
  ModalWrapper,
} from "./styles/modal";

const ModalCenter = (props) => {
  const theme = useSelector((state) => state.theme);
  const { children, handleClose, padding, heading, display } = props;
  const closeButtonPath = [
    "M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z",
  ];

  return (
    <>
      <ModalCorner />
      <ModalWrapper
        modalBg={theme.modalBg}
        style={{ display: display, paddingTop: !display ? "4vh" : "0px" }}
      >
        <ModalContentCenter bg={theme.bg}>
          <ModalHeader
            color={theme.color}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {heading && <h2>{heading}</h2>}
            <CloseButton onClick={handleClose}>
              <Icon
                d={closeButtonPath}
                width="22.5px"
                height="22.5px"
                fill="rgb(29, 161, 242)"
              />
            </CloseButton>
          </ModalHeader>
          <ModalBody padding={padding}>{children}</ModalBody>
        </ModalContentCenter>
      </ModalWrapper>
    </>
  );
};

export default ModalCenter;

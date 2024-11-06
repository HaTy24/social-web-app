import React from "react";
import { Link } from "react-router-dom";

import {
  Container,
  Content,
  ButtonWrapper,
  Button,
} from "./styles/modal-cookies";
import { ModalCorner, ModalWrapper } from "./styles/modal";
import { useSelector } from "react-redux";

const ModalCookies = ({ onClickAccept, onClickDecline, onClickPolicy }) => {
  const theme = useSelector((state) => state.theme);

  return (
    <>
      <ModalCorner />
      <ModalWrapper modalBg={theme.modalBg}>
        <Container boxShadow={theme.boxShadow} bg={theme.bg}>
          <Content color={theme.color}>
            This site uses cookies to you a better user experience. Informatiton
            about the cookies we use can be fount in our Privacy Policy under
            <Link
              to="/cookies-policy"
              style={{ color: "rgba(29, 161, 242, 1)" }}
              target="_blank"
            >
              {" "}
              "Cookies Policy"
            </Link>
            . You can reject all non-essential cookies by choosing "Decline"
          </Content>
          <ButtonWrapper>
            <Button
              border="rgba(29, 161, 242, 1)"
              color="#fff"
              bg="rgba(29, 161, 242, 1)"
              hover="rgb(26, 145, 218)"
              onClick={onClickAccept}
            >
              Accept
            </Button>
            <Button
              border="rgba(29, 161, 242, 1)"
              color="rgba(29, 161, 242, 1)"
              className="decline"
              onClick={onClickDecline}
            >
              Decline
            </Button>
          </ButtonWrapper>
        </Container>
      </ModalWrapper>
    </>
  );
};

export default ModalCookies;

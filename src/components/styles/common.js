import styled from "styled-components";

export const ProfileCorner = styled.div`
  border-left: ${(props) => `1px solid ${props.border}`};
  border-right: ${(props) => `1px solid ${props.border}`};
  min-height: 100vh;
  // padding-bottom: 20%;

  .chat-box {
    height: 100%;
    width: 100vw;
    position: relative;

    @media (max-width: 767px) {
      position: fixed;
      top: 0;
      z-index: 20;
    }
  }
  .msg-list {
    height: calc(100vh - 175px);
    position: sticky;
    bottom: 60px;

    @media (max-width: 767px) {
      height: calc(100vh - 258px);
    }
  }

  .my-profile {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px 16px;
  }

  .date-picker {
    background-color: transparent;
    color: ${(props) => props.color};
    font-size: 14px;
    border: ${(props) => `1px solid ${props.border}`};
    border-radius: 28px;
    padding: 0 15px;
    min-height: 30px;
    text-align: center;
    width: 90px;
    cursor: pointer;
  }

  .react-datepicker {
    background-color: ${(props) => props.bg};
    box-shadow: ${(props) => props.boxShadow};

    .react-datepicker-popper[data-placement^="bottom"]
      .react-datepicker__triangle::after {
      top: 0;
    }

    .react-datepicker-popper[data-placement^="bottom"]
      .react-datepicker__triangle::before,
    .react-datepicker-popper[data-placement^="bottom"]
      .react-datepicker__triangle::after {
      border-top: none;
      border-bottom-color: red;
    }

    .react-datepicker__header {
      background-color: ${(props) => props.bg};
    }

    .react-datepicker-year-header {
      color: ${(props) => props.color};
    }

    .react-datepicker__month-text {
      span {
        color: ${(props) => props.color};
      }
      &:hover {
        background-color: ${(props) => props.tweetHov};
      }
    }

    .react-datepicker__month-text--keyboard-selected {
      background-color: ${(props) => props.tweetHov};
    }

    button {
      span::before {
        top: 14px;
      }
    }
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;

  img {
    width: 48px;
    height: 48px;
    border-radius: 100%;
    background-color: #ced6dd;
  }

  .info {
    display: flex;
    flex-direction: column;

    .user-name {
      color: ${(props) => props.color};
      font-size: 16px;
      font-weight: 700;
    }

    .shares {
      font-size: 16px;
      color: rgb(101, 119, 134);
    }
  }
`;

export const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 200;
  background: ${(props) => props.bg};
  padding: 10px 15px;
  border-bottom: ${(props) => `1px solid ${props.border}`};
  h2 {
    font-weight: 800;
    color: ${(props) => props.color};
  }
  p {
    color: ${(props) => props.para};
    line-height: 13px;
  }
  * {
    margin-bottom: 0;
  }
  display: block;
  @media (max-width: 767px) {
    display: none;
  }
`;

export const ActivityBox = styled.button`
  display: flex;
  align-items: center;
  div {
    display: flex;
    padding: ${(props) => props.noPadding || "15%"};
  }
  &:hover {
    div {
      background-color: ${(props) => props.hoverBg};
    }
    svg {
      fill: ${(props) => props.hoverColor};
    }
    span {
      color: ${(props) => props.hoverColor};
    }
  }
`;

export const ActivityIcon = styled.div`
  border-radius: 50%;
`;

export const Row = styled.div`
  display: flex;
  flex-wrap wrap;
`;

export const Col = styled.div`
  display: block;
  ${(props) =>
    props.sm &&
    `  @media (min-width: 576px) {
      flex: 0 0 ${(props.sm / 24) * 100}%;
      max-width: ${(props.sm / 24) * 100}%;
    }`}

  ${(props) =>
    props.md &&
    `@media(min-width: 768px) {
    flex: 0 0 ${(props.md / 24) * 100}%;
    max-width: ${(props.md / 24) * 100}%;
  }`}

  ${(props) =>
    props.xs &&
    `@media (max-width: 576px) {
      flex: 0 0 ${(props.xs / 24) * 100}%;
      max-width: ${(props.xs / 24) * 100}%;
    }`}
`;

export const Button = styled.button`
  background: ${(props) => props.bg};
  border: ${(props) => props.border || "none"};
  border-radius: 50px;
  outline: none;
  font-size: 15px;
  font-weight: bold;
  color: ${(props) => props.color};
  text-align: center;
  cursor: pointer;
  padding: ${(props) => props.padding};
  &:hover {
    background: ${(props) => props.hoverBg};
  }
  &:disabled {
    cursor: not-allowed;
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  border: none;
  padding: 12px 0 4px 4px;
  border-bottom: 1px solid gray;
  background: transparent;
  caret-color: ${(props) => props.color};
  color: ${(props) => props.color};
  ${(props) => props.margin && `margin: ${props.margin};`}
  outline: none;
  &:focus {
    border-bottom: 1px solid rgb(29, 161, 242);
  }
`;

export const FileInput = styled.div`
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  &:hover {
    background-color: ${(props) => props.opaqueBg};
  }
`;

export const MenuOption = styled.div`
  color: #fff;
  font-size: 30px;
  line-height: 30px;
  top: 0;
  right: 20px;
  z-index: 10;
  cursor: pointer;
  height: 30px;
  width: 30px;
`;

export const NavbarContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${(props) => props.bg};
  padding: 10px 15px;
  border-bottom: ${(props) => `1px solid ${props.border}`};
  justify-content: space-between;
  align-items: center;
  width: 100%;
  display: none;
  @media (max-width: 767px) {
    display: flex;
  }
`;

export const NavbarUserBalance = styled.div`
  background-color: #eeeeee;
  padding: 6px 15px;
  border-radius: 28px;
`;

export const NavigationBarContainer = styled.div`
  position: sticky;
  bottom: -1px;
  width: 100%;
  z-index: 100;
  background: ${(props) => props.bg};
  display: none;
  border-top: ${(props) => `1px solid ${props.borderColor}`};
  @media (max-width: 767px) {
    display: block;
  }
`;

export const Menu = styled.div`
  opacity: 0;
  transition: all 0.1s ease-in-out;
  display: flex;
  position: relative;
  align-items: center;
  gap: 10px;
  z-index: 10;
  padding: 2px 4px;
  border-radius: 6px;
`;

export const MessagBox = styled.div`
  &:hover ${Menu} {
    opacity: 1;
  }
`;

export const DeleteMessages = styled.div`
  position: absolute;
  bottom: -30px;
  right: 0;
  padding: 5px 10px;
  background-color: white;
  box-shadow: 1px 2px 5px 0 #ccc;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  z-index: 100;
  &:hover {
    background-color: #eee;
  }
`;

export const TimeMessages = styled.div`
  position: absolute;
  bottom: -10px;

  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  z-index: 10;
`;

export const EditPost = styled.div`
  position: absolute;
  right: 0;
  top: 38px;
  background-color: ${(props) => props.backgroundColor};
  box-shadow: ${(props) => props.boxShadow};
  width: 229px;
  border-radius: 12px;
  z-index: 30;
  overflow: hidden;

  .edit-item {
    padding: 16px 12px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.hover};
    }
  }
`;

export const EditPrivateModal = styled.div`
  position: absolute;
  right: 0;
  top: 38px;
  background-color: ${(props) => props.backgroundColor};
  box-shadow: ${(props) => props.boxShadow};
  width: 229px;
  border-radius: 12px;
  z-index: 30;

  .content {
    color: #94a3b8;
    padding: 12px;
    margin-bottom: 0px;
  }

  .edit-item {
    padding: 12px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  &:hover {
    background-color: ${(props) => props.hover};
  }
`;

export const CopyLinkBox = styled.div`
  position: absolute;
  right: 0;
  top: 35px;
  padding: 10px 20px;
  background: #ddd;
  border-radius: 5px;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  z-index: 10;
  &:hover {
    background-color: #eee;
  }
`;

export const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 70px;
  cursor: pointer;
  margin-bottom: 30px;
  position: relative;
  &:hover {
    background-color: ${(props) => props.tweetHov};
  }
`;

export const LogoutPopup = styled.div`
  position: absolute;
  left: 0;
  bottom: 110%;
  background: #ddd;
  border-radius: 5px;
  cursor: pointer;
  z-index: 10;
  background-color: ${(props) => props.bg};
  color: ${(props) => props.color};
  box-shadow: ${(props) => props.boxShadow};
`;

export const LogoutItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  gap: 5px;
  &:hover {
    background-color: ${(props) => props.tweetHov};
  }
`;

export const MoreItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  &:hover {
    background-color: ${(props) => props.tweetHov};
  }
`;

export const UserName = styled.div`
  font-weight: 700;
  transition: all 1s linear;
  display: inline-block;
  color: ${(props) => props.color};
  &:hover {
    text-decoration: underline;
  }
`;

export const VoteBox = styled.div`
  padding: 20px 30px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.voteHov};
  }
`;

export const GameBox = styled.div`
  color: ${(props) => props.color};
  padding: 6px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.tweetHov};
  }
`;

export const GameImage = styled.img`
  border-radius: 10px;
  width: 50%;
  margin: 10px 0;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const RelationshipBox = styled.div`
  &:hover {
    text-decoration: underline;
  }
`;

export const PolicyBox = styled.div`
  color: #ccc;
  margin: 0 50px 50px 50px;
  padding: 20px;
  font-size: 16px;
  max-width: 70vw;
  @media (max-width: 600px) {
    margin: 0 10px 10px 10px;
    max-width: 100%;
  }
`;
export const TitleErrorPage = styled.h2`
  font-size: 80px;
  font-weight: 700;
  margin: 0;
  color: ${(props) => props.color};
  line-height: 1;
  @media (max-width: 767px) {
    font-size: 40px;
  }
`;

export const DescriptionErrorPage = styled.p`
  font-size: 20px;
  padding: 0 20px;
  text-align: center;
  color: ${(props) => props.color};
  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

export const NotifyModal = styled.div`
  span {
    color: ${(props) => props.color};
  }

  .info-item {
    display: flex;
    flex-direction: column;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
  }

  .content {
    padding: 12px 22px;
  }

  button {
    width: 100%;
    padding: 12px 0;
    margin: 12px 0;
    background-color: #1da1f2;
    border-radius: 50px;
    outline: none;
    border: none;
    font-size: 15px;
    font-weight: 700;
    color: ${(props) => props.color};
    cursor: pointer;
  }
`;

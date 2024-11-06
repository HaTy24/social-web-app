import styled from "styled-components";

export const SideBarBox = styled.div`
  top: 5%;
  background: ${(props) => props.tweetHov};
  margin-top: 5%;
  border-radius: 15px;
  overflow: hidden;
  width: 100%;
`;

export const Header = styled.div`
  padding: 10px 15px;
  margin-bottom: 15px;
  border-bottom: ${(props) => `1px solid ${props.border}`};
  h2 {
    color: ${(props) => props.color};
    font-size: 19px;
    font-weight: 800;
    margin: 0;
  }
`;

export const Users = styled.div`
  a:last-child div {
    border: none;
  }
`;

export const UserFlex = styled.div`
  display: flex;
  padding: 10px 15px 22px 15px;
  margin: 10px 0;
  border-bottom: ${(props) => `1px solid ${props.border}`};
  img {
    border-radius: 50%;
  }
  h3,
  p {
    margin: 0;
  }
  h3 {
    color: ${(props) => props.color};
    font-size: 15px;
    font-weight: 700;
    line-height: 19.68px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 1054px) {
      max-width: 100px;
    }
  }
  h3:hover {
    text-decoration: underline;
  }
  p {
    line-height: 19.68px;
    color: rgb(101, 119, 134);
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

export const Button = styled.button`
  background-color: "#EFF3F4";
  border: none;
  border-radius: 5px;
  padding: 8px 0;
  cursor: pointer;
  outline: none;
  font-weight: 700;
  min-width: 80px;
  &:hover {
    background-color: "#EFF3F4";
  }
  &:disabled {
    cursor: not-allowed;
  }

  @media (max-width: 1110px) {
    padding: 8px 15px;
  }
`;

export const ShowMoreButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 20px 0;
  cursor: pointer;
  outline: none;
  font-weight: 700;
  color: #1c9bef;
  width: 100%;
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
  &:disabled {
    cursor: not-allowed;
  }
`;

export const RecentTradesBox = styled.div`
  display: flex;
  padding: 10px 15px;
  gap: 1.25rem;
  h3,
  h4,
  p {
    margin: 0;
  }
  h3,
  h4 {
    color: ${(props) => props.color};
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
  cursor: pointer;
`;

export const TradesList = styled.div`
  overflow-y: auto;
  position: relative;
  height: 400px;
`;

export const SideBarContainer = styled.div`
  width: 80%;
  padding: 1% 1% 5% 5%;
  height: ${(props) => props.height};
  overflow: scroll;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 1280px) {
    width: 90%;
  }
`;

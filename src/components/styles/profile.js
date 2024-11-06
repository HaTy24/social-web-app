import styled from "styled-components";

export const HeaderWrapper = styled.div`
  position: sticky;
  z-index: 10;
  background-color: white;
  top: 0;
  border-bottom: ${(props) => `1px solid ${props.border}`};
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: ${(props) => props.bg};
  div {
    margin-right: 10px;
  }
  h2 {
    color: ${(props) => props.color};
    line-height: 1.3;
    margin-bottom: 0;
    font-size: 19px;
    font-weight: 800;
  }
  p {
    color: rgb(101, 119, 134);
    font-size: 13px;
    margin-bottom: 0;
  }
`;

export const BackBtn = styled.div`
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: rgba(29, 161, 242, 0.1);
  }
`;

export const Info = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 20px;
  h2 {
    color: ${(props) => props.color};
    line-height: 1.3;
    margin-bottom: 0;
    font-size: 19px;
    font-weight: 800;
  }
  p,
  span {
    font-size: 15px;
    font-weight: 400;
    color: rgb(101, 119, 134);
  }
  p {
    margin-bottom: 0;
  }
`;

export const Dates = styled.div`
  display: flex;
  margin: 10px 0;
  flex-wrap: wrap;
  div {
    margin-right: 10px;
  }
`;

export const ReferralBox = styled.div`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #94a3b8;
`;
export const ReferralSpan = styled.div`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => props.color};
`;
export const FollowFlex = styled.div`
  display: flex;
  div {
    margin-right: 20px;
  }
  div p:hover {
    text-decoration: underline;
  }
  div span:first-child {
    color: rgb(0, 0, 0);
    font-weight: 700;
  }
  div span:last-child {
    color: rgb(101, 119, 134);
    font-weight: 400;
  }
`;

export const Tab = styled.nav`
  display: flex;
  text-align: center;
  border-bottom: ${(props) => `1.8px solid ${props.border}`};
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  div {
    padding: 15px;
  }
  a {
    flex-basis: 50%;
    color: rgb(101, 119, 134);
    font-weight: 700;
    border-bottom: 2px solid transparent;
  }
  a:hover {
    background-color: rgba(29, 161, 242, 0.1);
    color: rgb(29, 161, 242);
  }
`;

export const Cover = styled.div`
  width: 100%;
  padding-top: 56.25%;
  background: ${(props) => props.bg};
  img {
    position: absolute;
    width: 100%;
    height: inherit;
  }
`;

export const Avatar = styled.div`
  width: 30%;
  height: 30%;
  width: 116.85px;
  height: 116.85px;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  border: ${(props) => `4px solid ${props.bg}`};
  border-radius: 50%;
  margin-top: -13%;
  @media (max-width: 768px) {
    margin-top: -10%;
  }
  @media (max-width: 576px) {
    margin-top: -18%;
  }
`;

export const ImgFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 15px;
  padding-right: 15px;
  @media (max-width: 425px) {
    display: block;
  }
`;

export const MyProfile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 8px 16px 16px;

  .input-item {
    display: flex;
    flex-direction: column;

    .label {
      color: ${(props) => props.color};
      font-weight: 600;
    }
  }
`;

export const Button = styled.button`
  background: ${(props) => props.bg};
  border: 1px solid rgb(29, 161, 242);
  border-radius: 50px;
  font-size: 15px;
  font-weight: bold;
  color: rgb(29, 161, 242);
  text-align: center;
  padding: 1% 3%;
  outline: none;
  cursor: pointer;
  white-space: nowrap;
  padding: 5px 10px;
  &:hover {
    background: rgba(26, 145, 218, 0.1);
  }
`;

export const PeopleFlex = styled.div`
  position: relative;
  cursor: pointer;
  // z-index:99;
  display: flex;
  padding: ${(props) => (props.padding ? props.padding : "10px")};
  color: rgb(0, 0, 0);
  background-color: ${(props) => props.bg};
  border-bottom: ${(props) => `1px solid ${props.border}`};
  &:hover {
    background-color: ${(props) => props.tweetHov};
  }
`;

export const TweetContentText = styled.div`
  // margin-left: 50px;
  // @media (max-width: 1024px) {
  //   margin-left: 40px;
  // }
  // @media (max-width: 768px) {
  //   margin-left: 20px;
  // }
  // @media (max-width: 576px) {
  //   margin-left: 0px;
  // }
`;

export const User = styled.div`
  position: relative;
  width: 11%;
  @media (max-width: 1024px) {
    width: 15%;
  }
  @media (max-width: 768px) {
    width: 11%;
  }
  @media (max-width: 576px) {
    width: 19%;
  }
`;

export const UserImage = styled.img`
  width: 49px;
  height: 49px;
  border-radius: 50%;
  background-color: white;
  margin-right: 10px;
`;

export const CoverImage = styled.img`
  width: 288px;
  height: 82px;
  object-fit: cover;
  position: absolute;
  z-index: -10;
  border: none;
  background-color: #efefef;
`;

export const UserBalance = styled.div`
  position: absolute;
  top: 2.7rem;
  background: #8793a2;
  color: white;
  width: 49px;
  height: 15px;
  font-size: 0.65rem;
  border-radius: 15px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  p {
    margin: 0;
    padding-top: 2px;
  }
`;

export const CountMessage = styled.div`
  position: absolute;
  word-break: break-word;
  top: 0;
  right: 0;
  background: red;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CardTooltipContainer = styled.div`
  .container {
    width: 288px;
    minheight: 200px;
    border-radius: 15px;
    position: relative;
    z-index: 10;
  }

  .flex-container {
    padding: 15px;
    padding-top: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 10;
    gap: 10px;
  }
  .avatar-item {
    position: absolute;
    top: -20px;
    left: 0;
  }
  .user-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .user-name {
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.75rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 170px;
  }
`;

export const PeopleDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    font-size: 15px;
    font-weight: 700;
  }
  h3:hover {
    text-decoration: underline;
  }
  p {
    color: rgb(101, 119, 134);
    font-weight: 400;
    font-size: 15px;
  }
  h3,
  p {
    margin: 0;
    line-height: 1.23;
  }
`;

export const TweetDetails = styled.div`
  display: flex;
  align-items: center;

  h3 {
    color: ${(props) => props.color};
    font-size: 15px;
    font-weight: 700;
    margin: 0;
    margin-right: 2px;
  }
  p {
    margin: 0;
    margin-right: 8px;
    color: rgb(101, 119, 134);
    font-weight: 400;
    font-size: 15px;
  }
  span {
    color: rgb(101, 119, 134);
  }
  h3:hover {
    text-decoration: underline;
  }
  button {
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
  }
  button:disabled {
    cursor: not-allowed;
  }
  .link-hover:hover {
    text-decoration: underline;
    color: rgb(29, 161, 242);
  }

  @media (max-width: 768px) {
    p {
      font-size: 12px;
    }
    align-items: self-start;
  }
`;

export const TweetAction = styled.div`
  display: flex;
  h3 {
    color: ${(props) => props.color};
    font-size: 15px;
    font-weight: 700;
    margin: 0;
    margin-right: 2px;
  }
  p {
    margin: 0;
    margin-right: 8px;
    color: rgb(101, 119, 134);
    font-weight: 400;
    font-size: 15px;
  }
  span {
    color: rgb(101, 119, 134);
  }
  h3:hover {
    text-decoration: underline;
  }
  button {
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
  }
  button:disabled {
    cursor: not-allowed;
  }
  .link-hover:hover {
    text-decoration: underline;
    color: rgb(29, 161, 242);
  }

  @media (max-width: 350px) {
    p {
      font-size: 12px;
    }
  }
`;

export const EmptyMsg = styled.div`
  text-align: center;
  color: rgb(101, 119, 134);
  margin-top: 4px;
`;

export const Text = styled.span`
  margin-left: 3px;
  font-weight: 400;
  font-size: 15px;
  color: ${(props) => props.color};
`;

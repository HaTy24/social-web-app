import styled from "styled-components";

export const Header = styled.header`
  padding-left: 10px;
  padding-right: 10px;
  width: 70%;
  height: 100vh;
  margin-left: auto;
  margin-right: auto;
  position: sticky;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  top: 0;
  .selected {
    .active {
      fill: rgba(29, 161, 242, 1);
      color: rgba(29, 161, 242, 1);
      border-radius: 50px;
    }
  }
  @media (max-width: 1024px) {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 768px) {
    align-items: center;
  }
`;
export const HeaderWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;
export const MenuWrapper = styled.div`
  overflow: auto;
  &:hover {
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #888; /* Color of the thumb */
    }
  }
  ::-webkit-scrollbar {
    width: 0;
  }
  ::-webkit-scrollbar-thumb {
    border: 4px solid transparent;
    border-radius: 8px;
  }
`;
export const SidebarMobile = styled.header`
  padding-left: 10px;
  padding-right: 10px;
  width: 70%;
  height: 100vh;
  margin-left: auto;
  margin-right: auto;
  position: fixed;
  z-index: 100;
  background-color: ${(props) => props.bg};
  flex-direction: column;
  top: 0;
  display: none;
  @media (max-width: 600px) {
    display: flex;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  z-index: 8;
  opacity: 0.6;
  background-color: ${(props) => props.bg};
`;

export const ModalMore = styled.div`
  margin: 0 5px;
  background-color: ${(props) => props.bg};
  color: ${(props) => props.color};
  box-shadow: ${(props) => props.boxShadow};
  position: absolute;
  bottom: 100%;
  z-index: 990;
  width: 253px;
  max-width: 96%;
  border-radius: 8px;
  display: ${(props) => props.display};
  flex-direction: column;
  .link {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    text-decoration: none;
    padding: 12px 16px;
  }
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const MenuItem = styled.div`
  ${(props) => props.logo && { display: "inline-block" }};
  margin-top: 10px;
  color: ${(props) => props.color};
  position: relative;
  div {
    display: flex;
    padding: 10px;
    align-items: center;
  }

  &:hover div {
    color: rgba(29, 161, 242, 1);
    fill: rgba(29, 161, 242, 1);
    background: rgba(29, 161, 242, 0.1);
    border-radius: 50px;
  }

  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

export const MenuTitle = styled.span`
  margin-left: 20px;
  font-size: 19px;
  font-weight: bold;
  line-height: 1.3;
  text-transform: capitalize;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Button = styled.button`
  width: ${(props) => props.width};
  ${(props) => props.height && `height: ${props.height}`};
  background: rgba(29, 161, 242, 1);
  border: none;
  border-radius: 50px;
  outline: none;
  font-size: 15px;
  font-weight: bold;
  color: rgb(255, 255, 255);
  text-align: center;
  cursor: pointer;
  padding: ${(props) => props.padding};
  &:hover {
    background: rgb(26, 145, 218);
  }
`;

export const ProfileTextUserName = styled.div`
  font-size: 18px;
  font-weight: bold;
  line-height: 1.3;
  text-transform: capitalize;
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const ProfileTextTweeterName = styled.div`
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  max-width: 150px;
`;

export const NotificationsCountBox = styled.span`
  padding: 0 6px;
  background-color: ${(props) => props.defaultBg};
  position: absolute;
  border-radius: 10px;
  color: white;
  font-size: 12px;
`;

export const SelectWrapper = styled.div`
  position: relative;
  width: 229px;
  margin-bottom: 8px;
`;
export const Select = styled.div`
  width: fit-content;
  padding: 4px 12px;
  display: flex;
  gap: 8px;
  align-items: center;
  background-color: transparent;
  border: 1px solid ${(props) => props.border};
  border-radius: 20px;
  cursor: pointer;
`;
export const SelectItem = styled.div`
  padding: 16px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.bgHov};
  }
`;

export const AutoCompleteWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: ${(props) => props.boxShadow};
  border-radius: 10px;
  margin-top: 8px;
  background: ${(props) => props.bg};
  position: absolute;
  width: 100%;
  top: 100%;
  left: 0;
  z-index: 99;
`;
export const AutoComplete = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 4px;
    padding: 12px 0;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }
`;

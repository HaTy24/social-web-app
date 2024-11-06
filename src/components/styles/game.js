import styled from "styled-components";
export const SelectWrapper = styled.div`
  position: relative;
`;
export const Select = styled.div`
  padding: 8px 12px;
  display: flex;
  gap: 8px;
  align-items: center;
  background-color: ${(props) => props.tweetHov};
  border: 1px solid ${(props) => props.border};
  border-radius: 8px;
  cursor: pointer;
  svg {
    fill: ${(props) => props.color};
  }
`;
export const SelectItem = styled.div`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.bgHov};
  }
`;

export const AutoCompleteWrapper = styled.div`
  padding: 6px;
  min-height: auto;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${(props) => props.boxShadow};
  border-radius: 10px;
  margin-top: 8px;
  background: ${(props) => props.bg};
  position: absolute;
  width: 100%;
  top: 100%;
  left: 0;
  z-index: 99;

  &::-webkit-scrollbar {
    width: 0;
    padding: 12px 0;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }
`;
export const AutoComplete = styled.div`
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
    padding: 12px 0;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }
`;
export const NetworkImage = styled.img`
  width: 49px;
  height: 49px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: white;
`;

export const PlayGameButton = styled.button`
  border: none;
  cursor: pointer;
  border-radius: 8px;
  width: 100%;
  padding: 10px 0;
  height: 46px;
  color: ${(props) => `${props.bg}`};
  background-color: ${(props) => `${props.color}`};
  display: flex;
  justify-content: center;
  align-items: start;
  gap: 5px;
  margin-top: 20px;
`;
export const UserTable = styled.div`
  display: flex;
  flex-direction: column;
  h3 {
    margin: 0;
  }
  h3 {
    color: ${(props) => props.color};
    font-size: 14px;
    font-weight: 700;
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
`;

import styled from "styled-components";

export const Search = styled.div`
  padding: 6px;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.tweetHov};
  border: 1px solid transparent;
  border-radius: 50px;
  position: relative;
  // z-index: 99;
  svg {
    fill: ${(props) => props.color};
  }
  input {
    width: 100%;
    background-color: rgba(204, 214, 221, 0);
    border: none;
    outline: none;
  }
  &:focus-within {
    background-color: ${(props) => props.bg};
    border: 1px solid rgb(29, 161, 242);
    svg {
      fill: rgb(29, 161, 242);
    }
  }
`;

export const AutoComplete = styled.div`
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
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const Scroll = styled.div`
  min-height: 200px;
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
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const ExploreTabs = styled.div`
  width: 100%;
  padding: 10px 0;
  display: flex;
  align-items: center;
`;
export const ExploreTabItem = styled.div`
  width:100%;
  padding:12px 0;
  display:flex,
  align-items:center;
  cursor:pointer;
  &.active {
    border-bottom: 1px solid rgb(29, 161, 242);
  }
`;
export const TopProfileWrapper = styled.div`
  overflow:'auto',
  ::-webkit-scrollbar {
    display:none
  }
`;

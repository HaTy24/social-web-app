import styled from "styled-components";

export const ModalWrapper = styled.div`
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  backdrop-filter: blur(4px);
  background: ${(props) => props.modalBg};
`;

export const ModalContent = styled.div`
  position: absolute;
  top: ${(props) => props.top};
  left: 50%;
  transform: translate(-50%, -${(props) => props.top});
  margin: auto;
  width: ${(props) => props.width};
  background: ${(props) => props.bg};
  border-radius: 15px;
  z-index: 10000;
  @media (max-width: 768px) {
    width: 96%;
  }
`;

export const ModalContentCenter = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: auto;
  width: 36%;
  background: ${(props) => props.bg};
  border-radius: 15px;
  @media (max-width: 768px) {
    width: 90%;
  }
`;

export const ModalCorner = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  filter: blur(8px);
  -webkit-filter: blur(8px);
`;

export const ModalHeader = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  padding: 13px 13px 0px 13px;
  border-bottom: ${(props) => `1px solid ${props.border}`};
  h2 {
    color: ${(props) => props.color};
    margin-bottom: 0;
    font-size: 19px;
    font-weight: 800;
  }
`;

export const CloseButton = styled.button`
  display: inline-flex;
  color: rgb(29, 161, 242);
  background-color: transparent;
  font-size: 33px;
  outline: none;
  border: none;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: rgba(29, 161, 242, 0.1);
  }
`;
export const Button = styled.button`
  background-color: ${(props) => props.defaultBg};
  color: rgb(255, 255, 255);
  border-radius: 50px;
  border: none;
  outline: none;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  padding: 8px 15px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.darkBg};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ModalBody = styled.div`
  padding: ${(props) => props.padding};
  overflow-y: auto;
  position: relative;
  max-height: 80vh;
  ::-webkit-scrollbar {
    width: 0;
  }
  ::-webkit-scrollbar-thumb {
    border: 4px solid transparent;
    border-radius: 8px;
  }
`;

export const Flex = styled.div`
  display: flex;
  div {
    // margin-right: 8px;
  }
  textarea {
    background: ${(props) => props.bg};
    caret-color: ${(props) => props.color};
    width: 100%;
    outline: none;
    border: none;
    resize: none;
    font-size: 16px;
    font-weight: 500;
    color: ${(props) => props.color};
  }
`;

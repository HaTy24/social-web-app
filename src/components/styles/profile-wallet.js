import styled from "styled-components";

export const HeaderWrapper = styled.div`
  position: sticky;
  z-index: 10;
  background-color: white;
  top: 0;
  border-bottom: ${(props) => `1px solid ${props.border}`};
`;

export const UserImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: white;
`;

export const ModalTransfer = styled.div`
  p {
    color: ${(props) => props.color};
  }
  .input-transfer {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type="number"] {
      -moz-appearance: textfield;
    }
  }
  .text-link {
    text-align: center;
    margin-bottom: 0;
    cursor: pointer;
    color: #1da1f2;
    &:hover {
      text-decoration: underline;
    }
  }
`;
export const Button = styled.button`
  width: ${(props) => props.width};
  ${(props) => props.height && `height: ${props.height}`};
  background: rgba(29, 161, 242, 1);
  border: none;
  border-radius: 10px;
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

export const TransactioHistory = styled.div`
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  p {
    margin-bottom: 0;
  }
`;
export const ListPin = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;
export const PinItem = styled.div`
  width: 100%;
  border: 1px solid #94a3b8;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

export const PinItemAsterisk = styled.div`
  color: ${(props) => props.color};
  position: absolute;
  top: 0;
  left: 0;
  background: ${(props) => props.background};
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ExportKey = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  width: 100%;
  overflow: auto;
  justify-content: center;
  margin-bottom: 20px;
  .hash-address {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 0;
  }
  .description {
    font-size: 18px;
  }
  @media (max-width: 768px) {
    .description {
      font-size: 16px;
    }
  }
`;

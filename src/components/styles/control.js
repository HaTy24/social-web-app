import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  gap: 8px;
  display: flex;
  flex-direction: column;
  flex: 1;

  .title {
    font-size: 16px;
    color: #f1f5f9;
  }

  .input {
    font-size: 16px;
    color: #fff;
    outline: none;
    border: none;
    border-bottom: 1px solid #393939;
    background-color: transparent;
  }

  .textarea {
    font-size: 16px;
    color: #fff;
    outline: none;
    border: none;
    border-bottom: 1px solid #393939;
    background-color: transparent;
    padding-top: 8px;
  }

  .error-message {
    color: #e53e3e;
  }
`;

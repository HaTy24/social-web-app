import styled from "styled-components";

export const Container = styled.div`
  width: 50%;
  background-color: ${(props) => props.bg};
  position: fixed;
  right: 25%;
  bottom: 30px;
  border-radius: 8px;
  box-shadow: ${(props) => props.boxShadow};
  padding: 16px 24px;

  @media (max-width: 768px) {
    width: 80%;
    right: 10%;
  }
`;

export const Content = styled.p`
  font-size: 15px;
  color: ${(props) => props.color};
  margin-bottom: 12px;
  letter-spacing: 1px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 24px;

  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

export const Button = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.color};
  text-decoration: none;
  padding: 12px 32px;
  background-color: ${(props) => props.bg};
  text-align: center;
  border: 1px solid ${(props) => props.border};
  border-radius: 50px;
  outline: none;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.hover};
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 15px;
  }
`;

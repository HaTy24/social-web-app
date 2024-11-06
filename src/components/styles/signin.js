import styled from "styled-components";

export const LogoWrapper = styled.div`
  background: rgb(29, 161, 242);
  height: 100vh;
  overflow: hidden;
`;

export const Motto = styled.div`
  margin-bottom: 40px;
  span {
    color: rgb(255, 255, 255);
    font-size: 19px;
    font-weight: bold;
    margin-left: 15px;
  }
`;

export const Button = styled.button`
  width: 100%;
  background: ${(props) => props.bg};
  color: ${(props) => props.color};
  border: 1px solid rgb(29, 161, 242);
  border-radius: 50px;
  font-size: 15px;
  font-weight: 500;
  padding: 5px 10px;
  outline: none;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.hovbg};
  }
  &:disabled {
    cursor: not-allowed;
  }
`;

export const Form = styled.div`
  display: flex;
  justify-content: ${(props) => (props.twoField ? "space-around" : "center")};
  flex-wrap: wrap;
  margin-bottom: ${(props) => (props.isLogin ? "100px" : "12px")};
  div {
    ${(props) => !props.twoField && "margin-right: 10px;"}
    height: 63px;
    ${(props) => props.single && "width: 100%;"}
    ${(props) => props.twoField && "width: 43%"}
  }
  input {
    width: 100%;
    border: none;
    height: 50px;
    border-bottom: 2px solid gray;
    background: rgba(29, 161, 242, 0.1);
    outline: none;
    &:focus {
      border-bottom: 2px solid rgb(29, 161, 242);
    }
  }
  @media (max-width: 768px) {
    margin-bottom: ${(props) => (props.isLogin ? "50px" : "12px")};
    div {
      width: 100%;
      margin-bottom: 20px;
    }
  }
`;

export const Flex = styled.div`
  display: flex;
  justify-content: center;
  div {
    width: 50%;
  }
  h1 {
    font-size: 30px;
    font-weight: bold;
  }
  p {
    font-size: 15px;
    font-weight: bold;
    color: black;
    margin-top: 15%;
  }
  @media (max-width: 768px) {
    div {
      width: 100%;
    }
  }
`;

export const Error = styled.p`
  font-size: 13px;
  color: rgb(255, 0, 0);
  margin: 0;
`;

export const BackgroundContent = styled.div`
  height: "100vh",
  overflow: "hidden",
  backgroundColor: "#18181B",
`;

export const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  font-size: 16px;
  margin-top: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

export const LoginText = styled.h1`
  font-size: 2.8rem;
  margin-top: 2rem;
  padding: 0 10px;
  color: white;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 450px;
  max-width: 100%;
  padding: 20px;
`;

export const FormSigIn = styled.form`
  color: #fff;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-size: 16px;
  button {
    display: flex;
    padding: 16px 0px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: 50px;
    background: #1d9bf0;
    color: #fff;
    font-weight: 700;
    border: none;
    outline: none;
    cursor: pointer;
  }
`;
export const FormControl = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #fff;
  label {
    font-size: 16px;
    font-weight: 700;
  }
  input {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border-radius: 12px;
    border: 1px solid #444;
    outline: none;
    background: transparent;
  }
`;

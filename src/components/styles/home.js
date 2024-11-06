import styled from "styled-components";

export const Tweet = styled.div`
  padding: 15px;
  border-bottom: ${(props) => `10px solid ${props.border}`};
`;

export const BackToTopArea = styled.div`
  position: sticky;
  bottom: 100px;
  width: 100%;
  height: 1px;
  z-index: 1000;
  padding-right: 10px;
  display: flex;
  justify-content: end;
`;

export const BackToTopButton = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(29, 161, 242, 1);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

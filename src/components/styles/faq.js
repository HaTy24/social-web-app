import styled from "styled-components";

export const Body = styled.div`
  display: flex;
  gap: 48px;
  padding: 24px 0;
  border-bottom: ${(props) => `1px solid ${props.border}`};
`;

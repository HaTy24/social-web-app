import styled from "styled-components";

export const PortfolioWrapper = styled.div`
  color: theme.color;
  padding: 24px 12px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
export const PortfolioBoxBorder = styled.div`
{
    padding: 16px 12px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    border: 1px solid ${(props) => props.border};
`;

export const SwitchWrapper = styled.div`
{
  display: flex;
  align-items: center;
  gap: 4px;
  width: max-content;
  padding: 4px;
  border-radius: 16px;
  background: ${(props) => props.bg};
`;
export const SwitchItem = styled.div`
{
  padding: 2px 10px;
  background:  ${(props) => props.bg};
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  color: ${(props) => props.color};
`;

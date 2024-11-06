import styled from "styled-components";

export const NotificationText = styled.div`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: ${(props) => props.color};
  fontSize: 16px,
  overflow: hidden,
  text-overflow: ellipsis,
  width: 200px,
  text-wrap: nowrap,
`;

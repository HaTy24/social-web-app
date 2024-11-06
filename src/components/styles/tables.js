import styled from "styled-components";

export const Pagination = styled.div`
  position: absolute;
  right: 50%;
  left: 50%;
  bottom: -10px;
  .pagination {
    list-style: none;
    display: flex;
    gap: 12px;
    justify-content: center;
    gap: 12px;
    margin-top: ${(props) => props.marginTop || "24px"};
    padding-left: 0;
    height: 40px;
    width: 100%;
  }
  .page-item {
    color: transparent;
    list-style: none;
    width: 25px;
    height: 27px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .page-active {
    background-color: ${(props) => props.activeBg};
    font-size: 16px;
    border-radius: 3px;
  }
  .page-link {
    color: ${(props) => props.color};
    text-align: center;
    padding: 0 10px;
  }
`;

export const WrapperTable = styled.div`
  &::-webkit-scrollbar {
    width: 0px;
    height: 4px;
    padding: 12px 0;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }
`;

export const Table = styled.table`
  width: 100%;

  @media only screen and (max-width: 768px) {
    .hide {
      display: none;
    }
  }
`;

export const RowTable = styled.tr`
  background-color: ${(props) => props.bg};
  border-radius: 4px;
  white-space: nowrap;
`;

export const ColTable = styled.td`
  font-size: 16px;
  font-weight: 400;
  padding: 8px 16px 8px;
  color: ${(props) => props.color};
  color: ${(props) => props.status};
`;

export const HeaderTable = styled.th`
  color: white;
  font-size: 16px;
  color: ${(props) => props.color};
  font-weight: 400;
  text-align: center;
  padding: 20px 0px;
  white-space: nowrap;
`;

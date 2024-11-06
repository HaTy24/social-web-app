import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { MoreInfoIcon } from "./icons/MoreInfoIcon";
import Loading from "./loading";
import { Pagination } from "./styles/tables";
import ReactPaginate from "react-paginate";
import { PreviousIcon } from "./icons/PreviousIcon";
import { NextIcon } from "./icons/NextIcon";
import i18next from "i18next";

export default function TableCustom(props) {
  const {
    columns,
    data,
    isLoading,
    isLoadingMore,
    isPagination,
    fetchData,
    totalCount,
  } = props;
  const theme = useSelector((state) => state.theme);
  const defaultTheme = theme.mode;
  const colorTable = defaultTheme == "default" ? "#000" : "#fff";
  const headerBg = defaultTheme == "default" ? "#fff" : "#000";
  const colorRowActive = defaultTheme == "default" ? "#b5b5b53b" : "#2A374D";
  const [{ offset, limit }, setPaginations] = useState({
    offset: 0,
    limit: 10,
  });
  useEffect(() => {
    fetchData &&
      fetchData({
        offset,
        limit,
      });
  }, []);

  const handlePageClick = async (selectedItem) => {
    const newOffset = selectedItem.selected * limit;
    fetchData &&
      (await fetchData({
        offset: newOffset,
        limit,
      }));
    setPaginations({
      offset: newOffset,
      limit: limit,
    });
  };

  return (
    <>
      <div style={{ overflowX: "auto", width: "100%", paddingBottom: "20px" }}>
        <table style={{ color: theme.color, minWidth: "100%" }}>
          <thead style={{ marginBottom: "14px" }}>
            <tr>
              {columns?.map((column, index) => (
                <th
                  style={{
                    padding: "0 12px 12px 0",
                    whiteSpace: "nowrap",
                    paddingRight: `${
                      index === columns.length - 1 ? "0px" : "12px"
                    }`,
                  }}
                  align={column.align || "left"}
                  key={column.key}
                >
                  <div
                    style={{
                      display: column.tooltip ? "flex" : "block",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}
                  >
                    {column.title}
                    {column.tooltip && (
                      <Tooltip
                        color={theme.color}
                        overlayInnerStyle={{
                          color: theme.bg,
                        }}
                        placement="top"
                        title={column.tooltipText}
                      >
                        <div
                          style={{ marginTop: "5px", display: "inline-block" }}
                        >
                          <MoreInfoIcon color={theme.color} />
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  align="center"
                  style={{ padding: "12px 0" }}
                  colSpan={columns.length}
                >
                  <Loading
                    style={{ padding: 0 }}
                    color={theme.color}
                    size={10}
                  />
                </td>
              </tr>
            ) : data.length > 0 ? (
              data?.map((item, index) => (
                <tr key={index + Math.random()}>
                  {columns.map((column, columnIndex) => (
                    <td
                      style={{
                        padding: "12px 12px 0 0",
                        minWidth: `${column.width || "100px"}`,
                        paddingRight: `${
                          columnIndex === columns.length - 1 ? "0px" : "12px"
                        }`,
                        whiteSpace: "nowrap",
                      }}
                      align={column.align || "left"}
                      key={`${column.key + columnIndex + Math.random()}`}
                    >
                      {item[column.dataIndex]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td align="center" colSpan={columns.length}>
                  {i18next.t("sideBar.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {isLoadingMore && (
          <Loading style={{ padding: 0 }} color={theme.color} size={10} />
        )}
      </div>
      {isPagination && totalCount > limit && (
        <Pagination
          style={{ position: "relative", right: 0, left: 0 }}
          marginTop={"0px"}
          color={colorTable}
          activeBg={colorRowActive}
        >
          <ReactPaginate
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            activeClassName={"page-active"}
            breakLabel="..."
            nextLabel={<NextIcon />}
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={Math.ceil(totalCount / limit)}
            previousLabel={<PreviousIcon />}
            renderOnZeroPageCount={true}
          />
        </Pagination>
      )}
    </>
  );
}

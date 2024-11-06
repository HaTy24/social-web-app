import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { getStaticScanUrl, getStaticURL } from "../../constants";
import { roundUp } from "../../utils/Number";
import { convertDate } from "../../utils/convertDate";
import { ExternalIcon } from "../core/icons/ExternalIcon";
import { ArrowDown } from "../icons/ArrowDown";
import { NextIcon } from "../icons/NextIcon";
import { PreviousIcon } from "../icons/PreviousIcon";
import Loading from "../loading";
import { UserImage } from "../styles/profile";
import {
  ColTable,
  HeaderTable,
  Pagination,
  RowTable,
  Table,
  WrapperTable,
} from "../styles/tables";
import i18next from "i18next";

export const HistoryTable = ({
  transferHistory,
  fetchTransferHistory,
  totalCount,
  isLoading,
}) => {
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
    fetchTransferHistory({
      offset,
      limit,
    });
  }, []);

  const handlePageClick = async (selectedItem) => {
    const newOffset = selectedItem.selected * limit;
    await fetchTransferHistory({
      offset: newOffset,
      limit,
    });
    setPaginations({
      offset: newOffset,
      limit: limit,
    });
  };

  return (
    <>
      <WrapperTable
        style={{
          overflow: "auto",
          height: "60vh",
          width: "100%",
          marginBottom: "50px",
        }}
      >
        {!isLoading ? (
          <Table style={{ width: "100%", overflow: "auto", height: "100px" }}>
            <RowTable
              style={{
                marginBottom: "24px",
                position: "sticky",
                top: "-1px",
                zIndex: 50,
                backgroundColor: headerBg,
              }}
            >
              <HeaderTable
                style={{ textAlign: "left", paddingLeft: "20px" }}
                color={colorTable}
              >
                {i18next.t("profileWallet.action")}
              </HeaderTable>
              <HeaderTable color={colorTable}>{i18next.t("profileWallet.user")}</HeaderTable>
              <HeaderTable style={{ textAlign: "center" }} color={colorTable}>
                {i18next.t("profileWallet.token")}
              </HeaderTable>
              <HeaderTable color={colorTable}>{i18next.t("profileWallet.amount")}</HeaderTable>
              <HeaderTable color={colorTable}>{i18next.t("profileWallet.transaction")}</HeaderTable>
              <HeaderTable
                color={colorTable}
                // style={{
                //   display: "flex",
                //   justifyContent: "end",
                //   paddingRight: "20px",
                // }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {i18next.t("profileWallet.time")}
                  <ArrowDown />
                </div>
              </HeaderTable>
            </RowTable>

            {transferHistory.length !== 0 ? (
              transferHistory.map((item, idx) => {
                const hashWalletAddress =
                  item.txHash.slice(0, 4) + "..." + item.txHash.slice(-4);
                return (
                  <RowTable key={idx} bg={idx % 2 != 0 ? colorRowActive : ""}>
                    <ColTable color={colorTable}>
                      {item.action == "buy_shares"
                        ? `${i18next.t("profileWallet.buyShares")}`
                        : `${i18next.t("profileWallet.sellShares")}`}
                    </ColTable>
                    <ColTable
                      color={colorTable}
                      style={{ textAlign: "center" }}
                    >
                      {item.owner && (
                        <Link
                          to={`/profile/${item.owner.id}`}
                          style={{ color: theme.color }}
                        >
                          {item.owner.fullname}
                        </Link>
                      )}
                    </ColTable>
                    <ColTable color={colorTable}>
                      <UserImage
                        style={{ width: "20px", height: "20px", margin: "5px" }}
                        src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
                      />
                    </ColTable>
                    <ColTable
                      style={{ display: "flex", justifyContent: "center" }}
                      color={colorTable}
                    >
                      {roundUp(item.amount, 5)} BNB
                    </ColTable>
                    <ColTable>
                      <a
                        href={`${getStaticScanUrl()}/${item.txHash}`}
                        style={{
                          display: "flex",
                          color: colorTable,
                          justifyContent: "center",
                        }}
                        target="_blank"
                      >
                        {hashWalletAddress}
                        <div
                          style={{
                            marginLeft: "5px",
                            alignItems: "center",
                            display: "flex",
                            alignContent: "center",
                          }}
                        >
                          <ExternalIcon color={colorTable} />
                        </div>
                      </a>
                    </ColTable>
                    <ColTable style={{ textAlign: "end" }} color={colorTable}>
                      {convertDate(item.createdAt)}
                    </ColTable>
                  </RowTable>
                );
              })
            ) : (
              <div
                style={{
                  position: "absolute",
                  fontSize: "20px",
                  fontWeight: "bold",
                  right: "50%",
                  transform: "translate(50%)",
                  color: "#bbb",
                }}
              >
                {i18next.t("profileWallet.noData")}
              </div>
            )}
          </Table>
        ) : (
          <Loading />
        )}
        {totalCount > 0 && (
          <Pagination color={colorTable} activeBg={colorRowActive}>
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
      </WrapperTable>
    </>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import { useHistory } from "react-router-dom";
import {
  getStaticURL,
  TRANSACTION_ACTIONS,
  ACCOUNT_TYPE,
} from "../../constants";
import { transactionService } from "../../services/TransactionService";
import { userService } from "../../services/UserService";
import { convertDate } from "../../utils/convertDate";
import { debounce } from "../../utils/debounce";
import { customFormat, roundUp } from "../../utils/Number";
import { ClickOutside } from "../../utils/triggerClickOutside";
import Icon from "../icon";
import Loading from "../loading";
import CardTooltip from "../profile/CardTooltip";
import { UserName } from "../styles/common";
import { AutoComplete, Search } from "../styles/explore";
import {
  PeopleDetails,
  PeopleFlex,
  User,
  UserBalance,
  UserImage,
} from "../styles/profile";
import {
  Button,
  Header,
  RecentTradesBox,
  ShowMoreButton,
  SideBarBox,
  SideBarContainer,
  TradesList,
  UserFlex,
  Users,
} from "../styles/sidebar";
import { YellowTick } from "../icons/YellowTick";
import i18next from "i18next";

const SideBar = () => {
  const [isFollowDisabled, setFollowDisabled] = useState(false);
  const [recentTrades, setRecentTrades] = useState([]);
  const [whoToBuyList, setWhoToBuyList] = useState([]);

  const userInfo = useSelector((state) => state.profile.user);
  const theme = useSelector((state) => state.theme);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [searchUser, setSearchUser] = useState();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isAfterFirstLoad, setIsAfterFirstLoad] = useState(false);
  const listTrades = document.getElementById("recentTrades");
  const [{ offset, limit }, setPaginations] = useState({
    offset: 0,
    limit: 5,
  });
  const [recentTradesLength, setRecentTradesLength] = useState(0);
  const ref = useRef();
  const history = useHistory();

  const handleScroll = async () => {
    const maxScrollPosition = listTrades.scrollHeight - listTrades.clientHeight;
    const scrollY = listTrades.scrollTop;
    const isScrolledToBottom = scrollY + 0.5 >= maxScrollPosition;
    const shouldLoadMore =
      isScrolledToBottom &&
      // !isLoading &&
      isAfterFirstLoad &&
      offset <= recentTradesLength;

    if (shouldLoadMore) {
      setIsLoading(true);
      setPaginations({
        limit,
        offset: offset + limit,
      });
      await getRecentTrades({ limit, offset: offset + 10 });
    }
  };

  const searchIcon = [
    "M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z",
  ];

  const getRecentTrades = async (pagination) => {
    const response = await transactionService.getRecentTrades(pagination);
    if (response.success) {
      setRecentTrades([...recentTrades, ...response.data.rows]);
      setRecentTradesLength(response.data.total);
    }
    setIsLoading(false);
  };

  const getWhoToBuy = async (pagination) => {
    const response = await transactionService.getWhoToBuy(pagination);
    if (response.success) {
      setWhoToBuyList(response.data.items);
    }
  };

  useEffect(() => {
    setIsAfterFirstLoad(true);
    getRecentTrades({ limit, offset });
    getWhoToBuy({ limit: 5, offset: 0 });
  }, []);

  useEffect(() => {
    listTrades?.addEventListener("scroll", handleScroll);

    return () => {
      listTrades?.removeEventListener("scroll", handleScroll);
    };
  }, [listTrades, recentTrades]);

  const handleBuy = async (e, id) => {
    e.preventDefault();
    history.push(`/buy-sell/${id}`);
  };

  function getTradeSummary(trade) {
    const quantity = trade.quantity;
    const item = [
      TRANSACTION_ACTIONS.SELL_SHARES,
      TRANSACTION_ACTIONS.BUY_SHARES,
    ].includes(trade.action)
      ? `${i18next.t("sideBar.share")}`
      : `${i18next.t("sideBar.vote")}`;
    const plural = trade.quantity > 1 ? "s" : "";

    return `${quantity} ${item}${plural}`;
  }

  if (!whoToBuyList || !recentTrades) return <Loading />;

  const handleSearch = async (value) => {
    if (!value) {
      setIsLoadingSearch(false);
      setSearchUser();
      return;
    }
    if (value.length >= 3) {
      try {
        setIsLoadingSearch(true);
        const response = await userService.searchUser(value);
        if (response.success) {
          setIsLoadingSearch(false);
          setSearchUser(response.data);
        } else {
          setIsLoadingSearch(false);
          setSearchUser();
        }
      } catch (error) {
        setIsLoadingSearch(false);
        console.log(error);
      }
    }
  };

  const debounceDropDown = debounce((value) => handleSearch(value), 500);

  ClickOutside(ref, () => {
    setIsOpenSearch(false);
  });

  return (
    <SideBarContainer
      height={location.pathname.includes("/messages") ? "100vh" : "auto"}
      style={{ position: "relative" }}
    >
      <div ref={ref}>
        <Search bg={theme.bg} color={theme.color} tweetHov={theme.tweetHov}>
          <Icon d={searchIcon} width="40px" height="18.75px" />
          <input
            placeholder={i18next.t("sideBar.searchForPeopleCompanies")}
            style={{ caretColor: theme.color, color: theme.color }}
            onChange={(e) => debounceDropDown(e.target.value)}
            onFocus={() => setIsOpenSearch(true)}
          />
        </Search>
        {isOpenSearch && (
          <div
            style={{
              position: "absolute",
              width: "91%",
              zIndex: 100,
              backgroundColor: theme.bg,
              marginTop: "8px",
              borderRadius: "8px",
              border: `1px solid ${theme.border}`,
              overflowY: "auto",
            }}
          >
            {searchUser ? (
              searchUser?.length > 0 ? (
                <div style={{ height: "60%" }}>
                  {isLoadingSearch ? (
                    <Loading />
                  ) : (
                    searchUser.map((item) => (
                      <Link key={item.id} to={`/profile/${item.id}`}>
                        <PeopleFlex key={item.id} tweetHov={theme.tweetHov}>
                          <div>
                            <UserImage src={item.profile_image_url} />
                          </div>
                          <div style={{ width: "100%" }}>
                            <PeopleDetails>
                              <div>
                                <object>
                                  <h3 style={{ color: theme.color }}>
                                    {item.fullname}
                                  </h3>
                                </object>
                                <object>
                                  <p>@{item.twitterScreenName}</p>
                                </object>
                              </div>
                            </PeopleDetails>
                          </div>
                        </PeopleFlex>
                      </Link>
                    ))
                  )}
                </div>
              ) : (
                <>
                  {isLoadingSearch ? (
                    <Loading />
                  ) : (
                    <h3
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        fontWeight: 700,
                        color: theme.color,
                      }}
                    >
                      {i18next.t("sideBar.noResult")}
                    </h3>
                  )}
                </>
              )
            ) : (
              <h3
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: 700,
                  color: theme.color,
                }}
              >
                {i18next.t("sideBar.trySearchingForPeople")}
              </h3>
            )}
          </div>
        )}
      </div>


      <SideBarBox tweetHov={theme.tweetHov}>
        <Header color={theme.color}>
          <h2>{i18next.t("sideBar.recentTrades")}</h2>
        </Header>
        <TradesList id="recentTrades">
          {!recentTrades?.length && (
            <p style={{ textAlign: "center", color: theme.color }}>{i18next.t("sideBar.noData")}</p>
          )}
          {recentTrades &&
            recentTrades.map((trade, idx) => (
              <RecentTradesBox color={theme.color} key={idx}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <UserImage
                    style={{ width: "40px", height: "40px" }}
                    src={
                      trade.owner?.profile_image_url ||
                      "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                    }
                  />
                  <UserImage
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "40%",
                      width: "40px",
                      height: "40px",
                    }}
                    src={
                      trade.user?.profile_image_url ||
                      "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                    }
                  />
                </div>
                <div>
                  <h3>
                    <Link to={`/profile/${trade.user?.id}`}>
                      <UserName color={theme.color}>
                        @{trade.user?.twitterScreenName}
                      </UserName>
                      &nbsp;
                    </Link>
                    <span
                      style={{
                        color: `${trade.action === TRANSACTION_ACTIONS.SELL_SHARES
                          ? "red"
                          : "green"
                          }`,
                      }}
                    >
                      {trade.action === TRANSACTION_ACTIONS.SELL_SHARES
                        ? `${i18next.t("sideBar.sold")}`
                        : `${i18next.t("sideBar.bought")}`}
                    </span>{" "}
                    {getTradeSummary(trade)} {i18next.t("sideBar.of")}
                    <Link to={`/profile/${trade.owner?.id}`}>
                      &nbsp;
                      <UserName color={theme.color}>
                        @{trade.owner?.twitterScreenName}
                      </UserName>
                    </Link>
                  </h3>
                  <h3>
                    {i18next.t("sideBar.value")}{" "}
                    <span
                      style={{
                        color: `${trade.action === TRANSACTION_ACTIONS.SELL_SHARES
                          ? "red"
                          : "green"
                          }`,
                        textDecoration: "underline",
                      }}
                    >
                      {roundUp(trade.amount, 8)} BNB
                    </span>
                  </h3>
                  <h4 style={{ color: "#888" }}>
                    {convertDate(trade.createdAt)}
                  </h4>
                </div>
              </RecentTradesBox>
            ))}
        </TradesList>
      </SideBarBox>
      <SideBarBox tweetHov={theme.tweetHov}>
        <Header color={theme.color}>
          <h2>{i18next.t("sideBar.whoToBuy")}</h2>
        </Header>
        <Users>
          {!whoToBuyList?.length && (
            <p style={{ textAlign: "center", color: theme.color }}>
              {i18next.t("sideBar.noMoreUsersLeftToFollow")}
            </p>
          )}
          {whoToBuyList.map((user, idx) => (
            <Link to={`/profile/${user.data.id}`} key={idx}>
              <UserFlex color={theme.color}>
                <CardTooltip
                  item={{
                    user: {
                      ...user.data,
                      imageUrl: user.data.profile_image_url,
                      fullname: user.data.fullname,
                      username: user.data.twitterScreenName,
                    },
                    coverImage: user.data.profile_banner_url,
                  }}
                  id={user.data.id}
                >
                  <User>
                    <UserImage src={user.data.profile_image_url} />
                    <UserBalance>
                      <span>{customFormat(user.data.share.buyPrice ? user.data.share.buyPrice : 0, 3)}</span>
                      <img
                        src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
                        alt="discord"
                      />
                    </UserBalance>
                  </User>
                </CardTooltip>
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                      maxWidth: "90%",
                    }}
                  >
                    <h3>{user.data.fullname}</h3>
                    {user.data.accountType === ACCOUNT_TYPE.INVESTMENT && (
                      <YellowTick />
                    )}
                  </div>
                  <p>@{user.data.twitterScreenName}</p>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <Button
                    onClick={(e) => handleBuy(e, user.data.id)}
                    disabled={isFollowDisabled}
                    style={{ color: "#000" }}
                  >
                    {i18next.t('trade')}
                  </Button>
                </div>
              </UserFlex>
            </Link>
          ))}
          <Link
            to="/explore"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <ShowMoreButton>{i18next.t("showMore")}</ShowMoreButton>
          </Link>
        </Users>
      </SideBarBox>
    </SideBarContainer>
  );
};

export default SideBar;

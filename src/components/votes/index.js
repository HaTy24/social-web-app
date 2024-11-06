import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import { authService } from "../../services/AuthService";
import { voteService } from "../../services/VoteService";
import { customFormat } from "../../utils/Number";
import { debounce } from "../../utils/debounce";
import Icon from "../icon";
import { PlusIcon } from "../icons/PlusIcon";
import Loading from "../loading";
import {
  Header,
  NavbarUserBalance,
  ProfileCorner,
  VoteBox,
} from "../styles/common";
import { Search } from "../styles/explore";
import { UserImage } from "../styles/profile";
import Tabs from "../tabs";
import { Rules } from "./rules";
import { VoteItem } from "./voteItem";
import { getStaticURL } from "../../constants";
import HeaderBalance from "../layouts/HeaderBalance";
import i18next from "i18next";

const searchIcon = [
  "M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z",
];

function Votes() {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);
  const [search, setSearch] = useState("");
  const [topVotes, setTopVotes] = useState([]);
  const [searchUser, setSearchUser] = useState();
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const query = new URLSearchParams(useLocation().search).get("tabs");
  const [liveBNBBalance, setLiveBNBBalance] = useState(null);
  const [topVotesLength, setTopVotesLength] = useState(0);
  const [{ offset, limit }, setPaginations] = useState({
    offset: 0,
    limit: 10,
  });
  const handleScroll = async () => {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - 1;
    const isScrolledToBottom = windowHeight + scrollY >= documentHeight;
    const shouldLoadMore = isScrolledToBottom && offset <= topVotesLength;

    if (shouldLoadMore) {
      setIsLoading(true);
      setPaginations({
        limit,
        offset: offset + limit,
      });
      await getTopVotes({ limit, offset: offset + 10 });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Votes / Weknot.io";
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [topVotes]);

  const getLiveBNB = async () => {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=BTC,USD,EUR"
    );
    setLiveBNBBalance(response.data);
  };

  const getTopVotes = async (pagination) => {
    try {
      const response = await voteService.getTopVotes(pagination);
      if (response.success) {
        setTopVotes([...topVotes, ...response.data.rows]);
        setTopVotesLength(response.data.total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (value) => {
    setSearch(value);
    if (!value) {
      setIsLoadingSearch(false);
      setSearchUser();
      return;
    }
    try {
      setIsLoadingSearch(true);
      const response = await voteService.getVoteInfo(value);
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
  };

  const debounceDropDown = debounce((value) => handleSearch(value), 700);

  useEffect(() => {
    getTopVotes({ limit: 10, offset: 0 });
    getLiveBNB();
  }, [user]);

  const tabList = [
    {
      name: "topVotes",
      title: i18next.t("votes.title"),
      path: "/votes",
    },
    {
      name: "rules",
      title: i18next.t("votes.rules"),
      path: "/votes?tabs=rules",
    },
  ];

  const renderTabVoteContent = () => {
    switch (query) {
      case "rules":
        return <Rules />;
      default:
        return (
          <div>
            <div style={{ padding: "0 30px" }}>
              <div
                style={{
                  color: `${theme.color}`,
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "30px 0",
                }}
              >
                <span>{i18next.t("votes.voteTrend")}</span>
                <span style={{ color: "#999" }}>{i18next.t("votes.price")}</span>
              </div>
            </div>
            {!!search ? (
              <>
                {isLoadingSearch ? (
                  <div
                    style={{
                      height: "100vh",
                      backgroundColor: theme.bg,
                    }}
                  >
                    <Loading />
                  </div>
                ) : (
                  searchUser && (
                    <Link to={`/votes/${searchUser.twitterScreenName}`}>
                      <VoteBox voteHov={theme.tweetHov}>
                        <VoteItem
                          imageUrl={searchUser?.profile_image_url}
                          fullname={searchUser.fullname}
                          userName={searchUser.twitterScreenName}
                          holders={searchUser.shared}
                          amount={0.090684}
                          realAmount={(liveBNBBalance.USD * 0.090684).toFixed(
                            6
                          )}
                        />
                      </VoteBox>
                    </Link>
                  )
                )}
              </>
            ) : (
              topVotes.map((topVote, index) => (
                <Link key={index} to={`/votes/${topVote.id}`}>
                  <VoteBox voteHov={theme.tweetHov}>
                    <VoteItem
                      top={index}
                      imageUrl={topVote?.profile_image_url}
                      fullname={topVote.fullname}
                      userName={topVote.twitterScreenName}
                      holders={topVote.shared}
                      amount={customFormat(topVote.share.buyPrice, 6)}
                      realAmount={customFormat(
                        liveBNBBalance.USD * topVote.share.buyPrice,
                        6
                      )}
                    />
                  </VoteBox>
                </Link>
              ))
            )}
          </div>
        );
    }
  };

  if (user === null) {
    return (
      <div style={{ height: "100vh", backgroundColor: theme.bg }}>
        <Loading />
      </div>
    );
  }

  return (
    <ProfileCorner border={theme.border}>
      <HeaderBalance title={i18next.t("votes.title")} />
      {liveBNBBalance === null ? (
        <div style={{ height: "100vh", backgroundColor: theme.bg }}>
          <Loading />
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "15px",
              gap: "15px",
            }}
          >
            <Search
              bg={theme.bg}
              color={theme.color}
              style={{ width: "100%" }}
              tweetHov={theme.tweetHov}
            >
              <Icon d={searchIcon} width="40px" height="18.75px" />
              <input
                placeholder={i18next.t("votes.search")}
                style={{ caretColor: theme.color, color: theme.color }}
                onChange={(e) => debounceDropDown(e.target.value)}
              />
            </Search>
            <Link to={"/votes/create"}>
              <PlusIcon color={theme.color} />
            </Link>
          </div>
          <Tabs tabList={tabList} pathDefault={"topVotes"} />
          {renderTabVoteContent()}
        </>
      )}
      <div style={{ position: "fixed", bottom: 0, right: "50%" }}>
        {isLoading && (
          <div>
            <Loading />
          </div>
        )}
      </div>
    </ProfileCorner>
  );
}

export default Votes;

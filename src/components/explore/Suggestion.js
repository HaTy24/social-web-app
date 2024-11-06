import React, { useEffect, useState } from "react";
import { Button, UserFlex } from "../styles/sidebar";
import CardTooltip from "../profile/CardTooltip";
import { User, UserBalance, UserImage } from "../styles/profile";
import { transactionService } from "../../services/TransactionService";
import { getStaticURL, ACCOUNT_TYPE } from "../../constants";
import { customFormat } from "../../utils/Number";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../loading";
import { YellowTick } from "../icons/YellowTick";
import i18next from "i18next";

const SuggestionExplore = () => {
  const [isAfterFirstLoad, setIsAfterFirstLoad] = useState(false);
  const [isLoadingScroll, setIsLoadingScroll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowDisabled, setFollowDisabled] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const userInfo = useSelector((state) => state.profile.user);
  const theme = useSelector((state) => state.theme);
  const [{ offset, limit }, setPaginations] = useState({
    offset: 0,
    limit: 10,
  });
  const [listSuggestionsLength, setListSuggestionsLength] = useState(0);
  const history = useHistory();
  const handleBuy = async (e, id) => {
    e.preventDefault();
    history.push(`/buy-sell/${id}`);
  };
  const getSuggestions = async (pagination) => {
    try {
      setIsLoading(true);
      const response = await transactionService.getWhoToBuy(pagination);
      if (response.success) {
        setSuggestions([...suggestions, ...response.data.items]);
        setListSuggestionsLength(response.data.total);
        setIsLoading(false);
      }
    } catch (error) {
      return error;
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setIsAfterFirstLoad(true);
    getSuggestions({ offset, limit });
  }, [isLoadingScroll]);
  const handleScroll = async () => {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - 1;

    const isScrolledToBottom = windowHeight + scrollY >= documentHeight;
    const shouldLoadMore =
      isScrolledToBottom && isAfterFirstLoad && offset <= listSuggestionsLength;
    if (shouldLoadMore) {
      setPaginations({
        limit,
        offset: offset + limit,
      });
      setIsLoadingScroll(!isLoadingScroll);
    }
  };
  useEffect(() => {
    if (suggestions.length > 0 && isAfterFirstLoad) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isAfterFirstLoad, suggestions]);
  window.removeEventListener("scroll", handleScroll);
  return (
    <div>
      {suggestions.map((user, idx) => {
        return (
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
                    <span>{customFormat(user?.data?.share?.buyPrice ? user?.data?.share?.buyPrice : 0, 3)}</span>
                    <img
                      src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
                      alt="discord"
                    />
                  </UserBalance>
                </User>
              </CardTooltip>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    {user.data.fullname}
                    {user.data.accountType === ACCOUNT_TYPE.INVESTMENT && (
                      <YellowTick />
                    )}
                  </h3>
                </div>
                <p>@{user.data.twitterScreenName}</p>
                {/* <p style={{ marginTop: "4px" }}>
                    Connect share and earn in the world of web3
                  </p> */}
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Button
                  onClick={(e) => handleBuy(e, user.data.id)}
                  disabled={isFollowDisabled}
                  style={{ color: "#000" }}
                >
                  {i18next.t("explorePage.trade")}
                </Button>
              </div>
            </UserFlex>
          </Link>
        );
      })}
      {isLoading && <Loading />}
    </div>
  );
};

export default SuggestionExplore;

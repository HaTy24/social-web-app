import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";

import { getStaticURL, ACCOUNT_TYPE } from "../../constants";
import { userService } from "../../services/UserService";
import { customFormat } from "../../utils/Number";
import Loading from "../loading";
import CardTooltip from "../profile/CardTooltip";
import { TopProfileWrapper } from "../styles/explore";
import { User, UserBalance, UserImage } from "../styles/profile";
import { Button, UserFlex } from "../styles/sidebar";
import { YellowTick } from "../icons/YellowTick";
import i18next from "i18next";

const TopProfilesExplore = ({ heightHeader = 300 }) => {
  const [isAfterFirstLoad, setIsAfterFirstLoad] = useState(false);
  const [isLoadingScroll, setIsLoadingScroll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowDisabled, setFollowDisabled] = useState(false);
  const [topProfiles, setTopProfiles] = useState([]);
  const userInfo = useSelector((state) => state.theme);
  const theme = useSelector((state) => state.theme);
  const [{ offset, limit }, setPaginations] = useState({
    offset: 0,
    limit: 10,
  });
  const [listProfileLength, setListProfileLength] = useState(0);
  const history = useHistory();
  const handleBuy = async (e, id) => {
    e.preventDefault();
    history.push(`/buy-sell/${id}`);
  };
  const getTopProfiles = async (pagination) => {
    try {
      setIsLoading(true);
      const response = await userService.getTopProfiles(pagination);
      if (response.success) {
        setTopProfiles([...topProfiles, ...response.data.items]);
        setListProfileLength(response.data.total);
      }
    } catch (error) {
      return error;
    } finally {
      setIsLoading(false);
    }
  };
  const handleScroll = async () => {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - 1;

    const isScrolledToBottom = windowHeight + scrollY >= documentHeight;
    const shouldLoadMore = isScrolledToBottom && offset <= listProfileLength;
    if (shouldLoadMore) {
      setIsLoading(true);
      setPaginations({
        limit,
        offset: offset + limit,
      });
      setIsLoadingScroll(!isLoadingScroll);
    }
  };

  useEffect(() => {
    setIsAfterFirstLoad(true);
    getTopProfiles({ limit, offset });
  }, [isLoadingScroll]);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAfterFirstLoad, topProfiles]);
  return (
    <TopProfileWrapper style={{ height: "100%", overflow: "auto" }}>
      {topProfiles.map((user, idx) => {
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
                  </h3>
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
                  {i18next.t("explorePage.trade")}
                </Button>
              </div>
            </UserFlex>
          </Link>
        );
      })}
      {isLoading && <Loading />}
    </TopProfileWrapper>
  );
};

export default TopProfilesExplore;

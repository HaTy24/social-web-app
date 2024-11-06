import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";

import { getStaticURL } from "../../constants";
import { postService } from "../../services/PostService";
import { customFormat } from "../../utils/Number";
import { convertDate } from "../../utils/convertDate";
import { debounce } from "../../utils/debounce";
import TweetDisplay from "../TweetDisplay";
import Icon from "../icon";
import Loading from "../loading";
import Modal from "../modal";
import CardTooltip from "../profile/CardTooltip";
import ShareComponent from "../profile/ShareComponent";
import Comment from "../profile/comment";
import Like from "../profile/like";
import Retweet from "../profile/retweet";
import { ProfileCorner } from "../styles/common";
import { Search } from "../styles/explore";
import {
  PeopleFlex,
  TweetDetails,
  User,
  UserBalance,
  UserImage,
} from "../styles/profile";
import CommentModal from "../tweet/commentModal";
import { imageRender } from "../../utils/imageRender";
const searchIcon = [
  "M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z",
];
const Hashtag = () => {
  const [tweets, setTweets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFocusSearch, setIsFocusSearch] = useState(false);
  const [tweetId, setTweetId] = useState(null);
  const [isAfterFirstLoad, setIsAfterFirstLoad] = useState(false);
  const history = useHistory();
  const { hashtagSlug } = useParams();
  const [searchHashtag, setSearchHashtag] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [{ offset, limit }, setPaginations] = useState({
    offset: 0,
    limit: 10,
  });
  const refresh = useSelector((state) => state.update.refresh);

  const theme = useSelector((state) => state.theme);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Hashtag / Weknot.io";
    if (
      !!hashtagSlug &&
      hashtagSlug !== searchHashtag &&
      !isFocusSearch &&
      isFirstLoading
    ) {
      setSearchHashtag(`${hashtagSlug}`);
      setIsAfterFirstLoad(true);
      getTweets({ limit, offset }, hashtagSlug);
      document.getElementById("search-hashtag").value = hashtagSlug;
      setIsFirstLoading(false);
    }
  }, [hashtagSlug, refresh, searchHashtag, isFocusSearch]);

  useEffect(() => {
    if (tweets.length > 0 && isAfterFirstLoad) {
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isAfterFirstLoad, tweets]);

  const getTweets = async (pagination, tag) => {
    try {
      setIsLoading(true);
      const response = await postService.getTweets(pagination, tag);

      if (response.success) {
        setIsLoading(false);
        setTweets(response.data.rows);
        history.push(`/hashtag/${tag}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("An error occurred while getting tweets:", error);
    }
  };

  const getWhenScrollTweets = async (pagination, tag) => {
    try {
      setIsLoading(true);
      const response = await postService.getTweets(pagination, tag);

      if (response.success) {
        setIsLoading(false);
        setTweets([...tweets, ...response.data.rows]);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("An error occurred while getting tweets:", error);
    }
  };

  const handleScroll = async () => {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - 1;

    const isScrolledToBottom = windowHeight + scrollY >= documentHeight;
    const shouldLoadMore = isScrolledToBottom && !isLoading && isAfterFirstLoad;

    if (shouldLoadMore) {
      setIsLoading(true);
      setPaginations({
        limit,
        offset: offset + limit,
      });
      await getWhenScrollTweets(
        { limit, offset: offset + limit },
        searchHashtag
      );
    }
  };

  const handleSearch = async (value) => {
    const tag = String(value).replace(/#/g, "");
    setSearchHashtag(tag);

    if (!tag) {
      return;
    }
    setIsAfterFirstLoad(true);
    await getTweets({ limit, offset }, tag);
  };

  const updateDetails = (idx, newState) => {
    setTweets([
      ...tweets.slice(0, idx),
      {
        ...tweets[idx],
        [newState[0][0]]: newState[0][1],
        [newState[1][0]]: newState[1][1],
      },
      ...tweets.slice(idx + 1),
    ]);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleClickHashtag = async (tag) => {
    setSearchHashtag(tag);
    document.getElementById("search-hashtag").value = tag;
    setIsAfterFirstLoad(true);
    await getTweets({ limit, offset }, tag);
  };

  const debounceSearch = debounce((value) => handleSearch(value), 700);

  if (!tweets) return <Loading />;
  const toggleOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <ProfileCorner border={theme.border}>
      <React.Fragment>
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
              id="search-hashtag"
              placeholder={searchHashtag || "Type the hastag to search"}
              // value={searchHashtag}
              onFocus={() => setIsFocusSearch(true)}
              onBlur={() => setIsFocusSearch(false)}
              style={{ caretColor: theme.color, color: theme.color }}
              onChange={(e) => {
                debounceSearch(e.target.value);
              }}
            />
          </Search>
        </div>
        <div style={{ borderBottom: `1px solid ${theme.border}` }} />
        {isModalOpen && (
          <Modal
            children={
              <CommentModal handleClose={handleClose} tweetId={tweetId} />
            }
            handleClose={handleClose}
            toggleOpen={toggleOpen}
            padding="15px"
          />
        )}
        {tweets.map((tweet, idx) => {
          return (
            <React.Fragment key={idx}>
              <PeopleFlex hover border={theme.border} tweetHov={theme.tweetHov}>
                <Link to={`/profile/${tweet.user.id}`}>
                  <User>
                    <CardTooltip
                      item={{
                        user: { ...tweet.user, fullname: tweet.user.fullname },
                        coverImage: tweet.user.profile_banner_url,
                      }}
                      id={tweet.user.id}
                    >
                      <UserImage src={tweet.user.imageUrl} />
                      <UserBalance>
                        {customFormat(tweet.user.balance, 3)}
                        <img
                          src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
                          alt="discord"
                        />
                      </UserBalance>
                    </CardTooltip>
                  </User>
                </Link>
                <div style={{ width: "80%" }}>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <Link to={`/profile/${tweet.user.id}`}>
                      <TweetDetails
                        color={theme.color}
                        style={{ display: "flex", flexWrap: "wrap" }}
                      >
                        {/* <object> to hide nested <a> warning */}
                        <CardTooltip
                          item={{
                            user: {
                              ...tweet.user,
                              fullname: tweet.user.fullname,
                            },
                            coverImage: tweet.user.profile_banner_url,
                          }}
                          id={tweet.user.id}
                        >
                          <object>
                            <h3>{tweet.user.fullname}</h3>
                          </object>
                        </CardTooltip>
                        <p
                          style={{
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "100%",
                            marginLeft: "3px",
                          }}
                        >
                          {tweet.user.username && (
                            <CardTooltip
                              item={{
                                user: {
                                  ...tweet.user,
                                  fullname: tweet.user.fullname,
                                },
                                coverImage: tweet.user.profile_banner_url,
                              }}
                              id={tweet.user.id}
                            >
                              @{tweet.user.username}
                            </CardTooltip>
                          )}
                        </p>
                      </TweetDetails>
                    </Link>
                    <span style={{ color: "#657786" }}>
                      {convertDate(tweet.createdAt)}
                    </span>
                  </div>
                  <Link to={`/tweet/${tweet.slug}`}>
                    <div
                      style={{
                        color: theme.color,
                        wordBreak: "break-word",
                        marginBottom: "20px",
                      }}
                    >
                      <TweetDisplay
                        tweetContent={tweet.text}
                        searchHashtag={searchHashtag}
                        handleClickHashtag={handleClickHashtag}
                      />
                    </div>
                    {tweet.media.map((media, index) => {
                      return (
                        <img
                          key={index}
                          src={imageRender(media)}
                          style={{ width: "100%", marginBottom: "10px" }}
                        />
                      );
                    })}
                    {/* {tweet.media && isVideo(tweet.media) && (
                    <video
                      src={tweet.media}
                      style={{ width: "100%" }}
                      controls
                    ></video>
                  )} */}
                    <TweetDetails style={{ justifyContent: "space-between" }}>
                      <Comment
                        tweet={tweet}
                        getTweets={getTweets}
                        onClick={(e) => {
                          e.preventDefault();
                          setTweetId(tweet.slug);
                          setIsModalOpen(true);
                        }}
                      />
                      <Retweet
                        tweet={tweet}
                        updateDetails={updateDetails}
                        getTweets={getTweets}
                      />
                      <Like
                        tweet={tweet}
                        updateDetails={updateDetails}
                        getTweets={getTweets}
                      />
                      <ShareComponent tweet={tweet} />
                    </TweetDetails>
                  </Link>
                </div>
              </PeopleFlex>
            </React.Fragment>
          );
        })}
        <div style={{ position: "fixed", bottom: 0, right: "50%" }}>
          {isLoading && <Loading />}
        </div>
        {!isLoading && !tweets.length && searchHashtag && (
          <div style={{ textAlign: "center", padding: "40px 0px" }}>
            <h3
              style={{ fontSize: "19px", fontWeight: 700, color: theme.color }}
            >
              No results for "#{String(searchHashtag).replace(/#/g, "")}"
            </h3>
          </div>
        )}
      </React.Fragment>
    </ProfileCorner>
  );
};

export default Hashtag;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { POLICY_OPTIONS } from "../../constants";
import { postService } from "../../services/PostService";
import { PostComponent } from "../PostComponent";
import Loading from "../loading";
import { EmptyMsg } from "../styles/profile";
import { SET_RELOADED } from "../../redux/actions";
import i18next from "i18next";

const Activity = (props) => {
  const [tweets, setTweets] = useState([]);
  const [isHolder, setIsHolder] = useState(false);
  const { id } = useParams();
  const user = useSelector((state) => state.profile.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNewPost, setIsLoadingNewPost] = useState(false);
  const refresh = useSelector((state) => state.updateNewPost.refresh);
  const { dataKey, feed, isBookmark, userInfo } = props;
  const [{ offset, limit }, setPaginations] = useState({
    offset: 0,
    limit: 5,
  });

  useEffect(() => {
    const isFirstLoad = true;
    getTweets({ limit, offset }, isFirstLoad);
  }, [id]);

  useEffect(() => {
    if (refresh) {
      dispatch({ type: SET_RELOADED });
      window.scrollTo({
        top: 100,
        left: 100,
        behavior: "smooth",
      });

      setPaginations({
        offset: 0,
        limit: 5,
      });
      fetchNewTweet({ limit: 5, offset: 0 });
    }
  }, [refresh]);

  useEffect(() => {
    if (tweets.length > 0 && !isLoadingNewPost) {
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [tweets, isLoadingNewPost]);

  const fetchNewTweet = async (pagination) => {
    try {
      setIsLoading(true);
      const { success, data } = await postService.getUserWall(id, pagination);
      if (success) {
        setIsHolder(data.isHolder);
        setIsLoading(false);
        setTweets(data.rows);
      } else {
        setIsLoading(false);
        toast.error(`${i18next.t("getTweetsFailed")}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(`${i18next.t("errorRetrievingTweets")}`, error);
    }
  };

  const getTweets = async (pagination, isFirstLoad) => {
    try {
      setIsLoading(true);
      const { success, data } = await postService.getUserWall(id, pagination);
      if (success) {
        setIsHolder(data.isHolder);
        setIsLoading(false);
        if (isFirstLoad) {
          setTweets(data.rows);
        } else {
          setTweets([...tweets, ...data.rows]);
        }
      } else {
        setIsLoading(false);
        toast.error(`${i18next.t("getTweetsFailed")}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(`${i18next.t("errorRetrievingTweets")}`, error);
    }
  };

  const handleScroll = async () => {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - 1;

    const isScrolledToBottom = windowHeight + scrollY >= documentHeight;
    const shouldLoadMore = isScrolledToBottom && !isLoading && !refresh;
    const isFirstLoad = false;

    if (shouldLoadMore) {
      setIsLoading(true);
      setPaginations({
        limit,
        offset: offset + limit,
      });
      await getTweets({ limit, offset: offset + 5 }, isFirstLoad);
    }
  };

  const handleDelete = async (slug) => {
    setTweets(tweets.filter((tweet) => tweet.slug !== slug));
    if (tweets.length === 1) {
      const isFirstLoad = false;
      setIsLoading(true);
      setPaginations({
        limit,
        offset: offset + limit,
      });
      await getTweets({ limit, offset: offset + 5 }, isFirstLoad);
    }
  };

  if (isBookmark && !tweets.length)
    return (
      <div style={{ textAlign: "center", padding: "40px 0px" }}>
        <h3 style={{ fontSize: "19px", fontWeight: 700, color: "white" }}>
          {i18next.t("noAddedTweetsToBookmarks")}
        </h3>
        <p>{i18next.t("whenYouDoTheyWillShowUpHere")}</p>
      </div>
    );

  if (!tweets.length)
    return (
      <EmptyMsg>
        {feed
          ? `${i18next.t("youAreAllCaughtUp")}`
          : `${userInfo.fullname} ${dataKey}`}
      </EmptyMsg>
    );

  return (
    <React.Fragment>
      {tweets.length !== 0 &&
        tweets.map((tweet, idx) => {
          return (
            <PostComponent
              tweet={{
                ...tweet,
                canView:
                  tweet.policy === POLICY_OPTIONS.PUBLIC_POLICY.value ||
                  isHolder,
                policy: tweet.policy ?? POLICY_OPTIONS.PUBLIC_POLICY.value,
              }}
              user={user}
              handleDelete={handleDelete}
              onFetchNewTweet={fetchNewTweet}
              key={idx}
            />
          );
        })}
      <div style={{ position: "fixed", bottom: 0, right: "50%" }}>
        {isLoading && <Loading />}
      </div>
    </React.Fragment>
  );
};

export default Activity;

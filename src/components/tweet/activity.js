import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { POLICY_OPTIONS } from "../../constants";
import { SET_RELOADED } from "../../redux/actions";
import { postService } from "../../services/PostService";
import { PostComponent } from "../PostComponent";
import Loading from "../loading";
import { EmptyMsg } from "../styles/profile";
import BackToTopPost from "./BackToTopArea";
import i18next from "i18next";

const Activity = (props) => {
  const [tweets, setTweets] = useState([]);
  const dispatch = useDispatch();
  const [isAfterFirstLoad, setIsAfterFirstLoad] = useState(false);
  const user = useSelector((state) => state.profile.user);
  const refresh = useSelector((state) => state.updateNewPost.refresh);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPost, setTotalPost] = useState(0);

  const [{ offset, limit }, setPaginations] = useState({
    offset: 0,
    limit: 10,
  });

  const { username } = useParams();
  const theme = useSelector((state) => state.theme);

  const { dataKey, feed, isBookmark } = props;

  useEffect(() => {
    setIsAfterFirstLoad(true);
    getTweets({ limit, offset });
  }, []);

  useEffect(() => {
    if (refresh) {
      handleRefreshPost();
    }
  }, [refresh]);

  useEffect(() => {
    if (tweets.length > 0) {
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [tweets]);

  const handleRefreshPost = async () => {
    dispatch({ type: SET_RELOADED });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    await getTweets({ limit: 10, offset: 0 });
    setIsAfterFirstLoad(true);
    setIsLoading(false);
    setPaginations({
      offset: 0,
      limit: 10,
    });
  };

  const getTweets = async (pagination) => {
    try {
      setIsLoading(true);
      const response = await postService.getTweets(pagination);

      if (response.success) {
        setIsLoading(false);
        setTweets(response.data.rows);
        setTotalPost(response.data.total);
      } else {
        setIsLoading(false);
        toast.error(`${i18next.t("getTweetsFailed")}`);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("An error occurred while getting tweets:", error);
    }
  };

  const getWhenScrollTweets = useCallback(
    async (pagination) => {
      try {
        setIsLoading(true);
        const response = await postService.getTweets(pagination);

        if (response.success) {
          setIsLoading(false);

          setTweets([...tweets, ...response.data.rows]);
        } else {
          setIsLoading(false);

          toast.error(`${i18next.t("getTweetsFailed")}`);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);

        console.error("An error occurred while getting tweets:", error);
      }
    },
    [tweets]
  );

  const handleScroll = async () => {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - 1;

    const isScrolledToBottom = windowHeight + scrollY >= documentHeight;
    const shouldLoadMore =
      isScrolledToBottom && isAfterFirstLoad && !refresh && !isLoading;

    if (shouldLoadMore) {
      setPaginations({
        limit,
        offset: offset + limit,
      });
      await getWhenScrollTweets({ limit, offset: offset + limit });
    }
  };

  if (!tweets) return <Loading />;

  if (isBookmark && !tweets.length)
    return (
      <div style={{ textAlign: "center", padding: "40px 0px" }}>
        <h3 style={{ fontSize: "19px", fontWeight: 700, color: theme.color }}>
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
          : `@${username} has no ${dataKey} yet!`}
      </EmptyMsg>
    );

  const handleDelete = (slug) => {
    setTweets(tweets.filter((tweet) => tweet.slug !== slug));
  };

  return (
    <div
      style={{
        paddingBottom: `${
          window.matchMedia("(min-width: 768px)").matches ? "50px" : "0px"
        }`,
      }}
    >
      {tweets.map((tweet, idx) => {
        return (
          <React.Fragment key={idx}>
            <PostComponent
              tweet={{
                ...tweet,
                canView: true,
                policy: POLICY_OPTIONS.PUBLIC_POLICY.value,
              }}
              user={user}
              handleDelete={handleDelete}
              isFeed={true}
            />
          </React.Fragment>
        );
      })}
      <div style={{ position: "fixed", bottom: 0, right: "50%" }}>
        {isLoading && <Loading />}
      </div>
      <BackToTopPost totalPost={totalPost} handleRefreshPost={handleRefreshPost} />
    </div>
  );
};

export default Activity;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import { toast } from "react-toastify";
import { POLICY_OPTIONS, TWEET_TYPE, getStaticURL } from "../constants";
import { postService } from "../services/PostService";
import { customFormat } from "../utils/Number";
import { convertDate } from "../utils/convertDate";
import { capitalizeFirstWord } from "../utils/convertString";
import { imageRender } from "../utils/imageRender";
import TweetDisplay from "./TweetDisplay";
import { PrivateIcon } from "./icons/PrivateIcon";
import { PublicIcon } from "./icons/PublicIcon";
import Loading from "./loading";
import CardTooltip from "./profile/CardTooltip";
import { OptionUpdateTweetButton } from "./profile/OptionsUpdateTweetButton";
import ShareComponent from "./profile/ShareComponent";
import Comment from "./profile/comment";
import Like from "./profile/like";
import Retweet from "./profile/retweet";
import { Button } from "./styles/common";
import {
  PeopleFlex,
  TweetAction,
  TweetContentText,
  TweetDetails,
  User,
  UserBalance,
  UserImage,
} from "./styles/profile";
import i18next from "i18next";

export const PostComponent = (props) => {
  const {
    tweet,
    user,
    handleDelete,
    isComment = false,
    isTweetDetail = false,
    isFeed = false,
    onFetchNewTweet = () => {},
  } = props;
  const [tweetCurrent, setTweetCurrent] = useState(null);
  const [currentPolicy, setCurrentPolicy] = useState(
    POLICY_OPTIONS.PUBLIC_POLICY.value
  );
  const theme = useSelector((state) => state.theme);
  const history = useHistory();
  const mode = theme.mode;

  useEffect(() => {
    setTweetCurrent(tweet);
    if (tweet && tweet.policy) {
      setCurrentPolicy(tweet.policy);
    }
  }, [tweet]);
  const updatePolicy = async (policy, slug) => {
    const response = await postService.updatePolicy(slug, policy);
    if (response.success) {
      setCurrentPolicy(policy);
      toast(`${i18next.t("updatePolicySuccessful")}`);
    } else {
      toast.error(`${i18next.t("updatePolicyFailed")}`);
    }
  };

  const handleSelectPolicy = (value, slug, policy) => {
    if (policy !== value) {
      updatePolicy(value, slug);
    }
  };

  if (!tweetCurrent)
    return (
      <div>
        <Loading />
      </div>
    );

  if (
    !isComment &&
    tweetCurrent &&
    (tweetCurrent.type === TWEET_TYPE.RETWEET ||
      tweetCurrent.type === TWEET_TYPE.REPLY) &&
    (!tweetCurrent.metadata.originalPost || !tweetCurrent.metadata.originalUser)
  ) {
    return <div />;
  }

  return (
    <>
      <div>
        <PeopleFlex style={{ display: "block" }} border={theme.border}>
          <Link to={`/tweet/${tweetCurrent.slug}`}>
            <PeopleFlex hover tweetHov={theme.tweetHov}>
              <Link>
                <User>
                  <CardTooltip
                    item={{
                      user: {
                        ...tweetCurrent.user,
                        fullname: tweetCurrent.user.fullname,
                      },
                      coverImage: tweetCurrent.user.profile_banner_url,
                    }}
                    id={tweetCurrent.user.id}
                  >
                    <UserImage src={tweetCurrent.user.imageUrl} />
                    <UserBalance>
                      <p>
                        {customFormat(
                          tweetCurrent?.user?.share?.buyPrice
                            ? tweetCurrent?.user?.share?.buyPrice
                            : 0,
                          3
                        )}
                      </p>
                      <img
                        src={`${getStaticURL()}/assets/images/logo-bnb.svg`}
                        alt="discord"
                      />
                    </UserBalance>
                  </CardTooltip>
                </User>
              </Link>
              <div style={{ width: "100%" }}>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <TweetDetails
                        color={theme.color}
                        style={{
                          width: "100%",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "1px",
                          }}
                        >
                          <CardTooltip
                            item={{
                              user: {
                                ...tweetCurrent.user,
                                fullname: tweetCurrent.user.fullname,
                              },
                              coverImage: tweetCurrent.user.profile_banner_url,
                            }}
                            id={tweetCurrent.user.id}
                          >
                            <object>
                              <Link to={`/profile/${tweetCurrent.user.id}`}>
                                <h3>{tweetCurrent.user.fullname}</h3>
                              </Link>
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
                            {tweetCurrent.user.username && (
                              <CardTooltip
                                item={{
                                  user: {
                                    ...tweetCurrent.user,
                                    fullname: tweetCurrent.user.fullname,
                                  },
                                  coverImage:
                                    tweetCurrent.user.profile_banner_url,
                                }}
                                id={tweetCurrent.user.id}
                              >
                                @{tweetCurrent.user.username}
                              </CardTooltip>
                            )}
                          </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              height: "2px",
                              width: "2px",
                              backgroundColor: theme.color,
                              margin: "0 5px",
                              borderRadius: "50%",
                            }}
                          />
                          <span style={{ color: "#657786", marginLeft: "6px" }}>
                            {convertDate(tweetCurrent.createdAt)}
                          </span>
                        </div>
                      </TweetDetails>
                      {!isComment && !isFeed && (
                        <div
                          style={{
                            display: "flex",
                            padding: "3px 10px 3px 4px",
                            gap: "8px",
                            backgroundColor:
                              mode === "dark" ? "#1E293B" : "#F5F8FA",
                            color: mode === "dark" ? "white" : "#3F9BEF",
                            width: "fit-content",
                            borderRadius: "20px",
                          }}
                        >
                          {currentPolicy && (
                            <>
                              {currentPolicy === "PRIVATE" ? (
                                <PrivateIcon />
                              ) : (
                                <PublicIcon />
                              )}
                            </>
                          )}
                          <span style={{ fontWeight: 700, marginTop: "1px" }}>
                            {currentPolicy === "PRIVATE"
                              ? i18next.t(`tweet.private`)
                              : i18next.t(`tweet.public`)}
                          </span>
                        </div>
                      )}
                    </div>
                    {!isComment &&
                      !isFeed &&
                      tweetCurrent.user.id === user.id && (
                        <OptionUpdateTweetButton
                          isComment={isComment}
                          isFeed={isFeed}
                          slug={tweetCurrent.slug}
                          policy={currentPolicy}
                          onDelete={handleDelete}
                          onClickPolicy={(value) => {
                            setCurrentPolicy(value);
                            handleSelectPolicy(
                              value,
                              tweetCurrent.slug,
                              currentPolicy
                            );
                          }}
                        />
                      )}
                  </div>
                </div>
                <TweetContentText>
                  {tweetCurrent.canView ? (
                    <>
                      {tweetCurrent.type === TWEET_TYPE.RETWEET && (
                        <>
                          <Link
                            style={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              maxWidth: "40%",
                              marginLeft: "3px",
                            }}
                            className="link-hover"
                            to={`/tweet/${tweetCurrent?.metadata?.originalPost?.slug}`}
                          >
                            {i18next.t("reweetFrom")} @
                            {tweetCurrent?.metadata?.originalUser?.username}
                          </Link>
                          <div
                            style={{
                              color: theme.color,
                              wordBreak: "break-word",
                              marginBottom: "20px",
                              marginTop: "10px",
                            }}
                          >
                            <TweetDisplay
                              tweetContent={
                                tweetCurrent.metadata.originalPost.text ?? ""
                              }
                            />
                          </div>
                          {tweetCurrent.metadata.originalPost.media &&
                            tweetCurrent.metadata.originalPost.media.map(
                              (media, index) => {
                                return (
                                  <img
                                    key={index}
                                    src={imageRender(media)}
                                    style={{
                                      width: "100%",
                                      marginBottom: "10px",
                                    }}
                                  />
                                );
                              }
                            )}
                        </>
                      )}

                      {tweetCurrent.type === TWEET_TYPE.REPLY && (
                        <>
                          {!isComment && (
                            <Link
                              style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                maxWidth: "40%",
                                marginLeft: "3px",
                              }}
                              className="link-hover"
                              to={`/tweet/${tweetCurrent?.metadata?.originalPost?.slug}`}
                            >
                              {i18next.t("replyingTo")} @
                              {
                                tweetCurrent?.metadata?.originalUser
                                  ?.twitterScreenName
                              }
                            </Link>
                          )}
                          <div
                            style={{
                              color: theme.color,
                              wordBreak: "break-word",
                              marginBottom: "20px",
                              marginTop: "10px",
                            }}
                          >
                            <TweetDisplay
                              tweetContent={tweetCurrent.text ?? ""}
                            />
                          </div>
                          {tweetCurrent.media &&
                            tweetCurrent.media.map((media, index) => {
                              return (
                                <img
                                  key={index}
                                  src={imageRender(media)}
                                  style={{
                                    width: "100%",
                                    marginBottom: "10px",
                                  }}
                                />
                              );
                            })}
                        </>
                      )}

                      {tweetCurrent.type === TWEET_TYPE.TWEET && (
                        <>
                          <div
                            style={{
                              color: theme.color,
                              wordBreak: "break-word",
                              marginBottom: "20px",
                              marginTop: "10px",
                            }}
                          >
                            <TweetDisplay
                              tweetContent={tweetCurrent.text ?? ""}
                            />
                          </div>
                          {tweetCurrent.media &&
                            tweetCurrent.media.map((media, index) => {
                              return (
                                <img
                                  key={index}
                                  src={imageRender(media)}
                                  style={{
                                    width: "100%",
                                    marginBottom: "10px",
                                  }}
                                />
                              );
                            })}
                        </>
                      )}
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#1D9BF0", fontSize: "14px" }}>
                        {i18next.t("textPrivate")}
                      </span>
                      <Button
                        style={{
                          padding: "4px 12px",
                          background: "#94A3B8",
                          borderRadius: "20px",
                          fontSize: "14px",
                          width: "max-content",
                          color: theme.color,
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          history.push(`/buy-sell/${tweetCurrent?.user.id}`);
                        }}
                      >
                        {i18next.t("buyShareBtn")}
                      </Button>
                    </div>
                  )}
                </TweetContentText>
              </div>
            </PeopleFlex>
          </Link>
          <TweetAction
            style={{
              justifyContent: "space-between",
              padding: "0px 10px 0px 50px",
            }}
          >
            <Comment
              tweet={tweetCurrent}
              onClick={(e) => {
                e.preventDefault();
              }}
              disabled={!tweetCurrent.canView}
              onFetchNewTweet={onFetchNewTweet}
              isTweetDetail={isTweetDetail}
            />
            <Retweet
              tweet={tweetCurrent}
              disabled={
                currentPolicy === POLICY_OPTIONS.PRIVATE_POLICY.value ||
                !tweetCurrent.canView
              }
            />
            <Like
              tweet={tweetCurrent}
              disabled={!tweetCurrent.canView}
              onLike={() => {
                setTweetCurrent({
                  ...tweetCurrent,
                  likesCount: tweetCurrent.likesCount + 1,
                });
              }}
              onUndoLike={() => {
                setTweetCurrent({
                  ...tweetCurrent,
                  likesCount: tweetCurrent.likesCount - 1,
                });
              }}
            />
            <ShareComponent tweet={tweetCurrent} />
          </TweetAction>
        </PeopleFlex>
      </div>
    </>
  );
};

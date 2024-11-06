import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useHistory, useParams } from "react-router-dom";
import { postService } from "../../services/PostService";
import Loading from "../loading";
import ProfileHeader from "../profileHeader";

import { toast } from "react-toastify";
import { POLICY_OPTIONS } from "../../constants";
import { ProfileCorner } from "../styles/common";
import { TweetWrapper } from "../styles/tweet";
import Comments from "./comments";

import { PostComponent } from "../PostComponent";
import TweetReplyInput from "./tweetReplyInput";
import i18next from "i18next";

const Tweet = (props) => {
  const [tweet, setTweet] = useState(null);
  const user = useSelector((state) => state.profile.user);
  const { tweetId, slug } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const theme = useSelector((state) => state.theme);

  const getTweetDetail = async () => {
    try {
      setIsLoading(true);
      const response = await postService.getTweetDetail(slug);
      if (response.success) {
        setTweet(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Tweet / Weknot.io";
  }, []);

  useEffect(() => {
    getTweetDetail();
  }, [slug]);

  if (!tweet) {
    if (isLoading) {
      return (
        <div>
          <Loading />
        </div>
      );
    }
    return (
      <div
        style={{
          width: "100%",
          backgroundColor: theme.bg,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: theme.color,
            fontSize: "24px",
            fontWeight: 700,
            textAlign: "center",
            marginTop: "24px",
          }}
        >
          No Content
        </span>
      </div>
    );
  }

  const likePath = [
    "M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z",
  ];

  const updatePolicy = async (policy, slug) => {
    const response = await postService.updatePolicy(slug, policy);
    if (response.success) {
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

  const handleDelete = (slug) => {
    history.push(`/profile/${user.id}`);
  };
  return (
    <ProfileCorner border={theme.border}>
      <ProfileHeader heading="Tweet" />
      <TweetWrapper>
        <div style={{ padding: "10px 15px 0px 15px" }}>
          {tweet && (
            <PostComponent
              tweet={tweet}
              user={user}
              handleDelete={handleDelete}
              handleSelectPolicy={handleSelectPolicy}
              isTweetDetail={true}
            />
          )}
          {tweet.canView && (
            <>
              <TweetReplyInput
                rows={1}
                onSuccess={() => {
                  // setTweet({ ...tweet, commentCount: tweet.commentCount + 1 });
                  getTweetDetail();
                }}
              />
              <div>
                <Comments
                  hoverColor="rgb(224,36,94)"
                  hoverBg="rgba(224,36,94,0.1)"
                  path={likePath}
                  fill={
                    tweet.selfLiked ? "rgb(224, 36, 94)" : "rgb(101, 119, 134)"
                  }
                  noPadding={true}
                />
              </div>
            </>
          )}
        </div>
      </TweetWrapper>
    </ProfileCorner>
  );
};

export default Tweet;

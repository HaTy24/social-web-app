import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { INTERACTIONS } from "../../constants";
import { postService } from "../../services/PostService";
import Icon from "../icon";
import { ActivityBox, ActivityIcon } from "../styles/common";
import { Text } from "../styles/profile";
import i18next from "i18next";

const Like = (props) => {
  const { tweet, disabled, onLike, onUndoLike } = props;
  const [isShowDes, setIsShowDes] = useState(false);
  const [likeDisabled, setLikeDisabled] = useState(false);
  const [likesCount, setLikesCount] = useState();
  const [liked, setLiked] = useState();
  const likePath = [
    "M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z",
  ];
  const theme = useSelector((state) => state.theme);

  useEffect(() => {
    setLikesCount(tweet.likesCount);
    setLiked(tweet.actions.includes(INTERACTIONS.LIKE));
  }, [tweet]);

  const handleInteraction = async (e) => {
    e.preventDefault();
    if (!liked) {
      handleLike();
    } else {
      handleUndoLike();
    }
  };

  const handleLike = async () => {
    setLikeDisabled(true);
    const response = await postService.interaction(
      tweet.slug,
      INTERACTIONS.LIKE
    );
    if (response.success) {
      onLike();
      setLikesCount((prev) => prev + 1);
      setLiked(true);
    }
    setLikeDisabled(false);
  };

  const handleUndoLike = async () => {
    setLikeDisabled(true);
    const response = await postService.undoInteraction(
      tweet.slug,
      INTERACTIONS.LIKE
    );
    if (response.success) {
      onUndoLike();
      setLikesCount((prev) => prev - 1);
      setLiked(false);
    }
    setLikeDisabled(false);
  };

  const toggleDescription = () => {
    if (!window.matchMedia("(max-width: 768px)").matches) {
      setIsShowDes(!isShowDes);
    }
  };

  return (
    <ActivityBox
      onClick={(event) => handleInteraction(event)}
      disabled={disabled}
      hoverColor={!disabled && "rgb(224,36,94)"}
      hoverBg={!disabled && "rgba(224,36,94,0.1)"}
      style={{ position: "relative" }}
      onMouseOver={!disabled && toggleDescription}
      onMouseOut={!disabled && toggleDescription}
    >
      <ActivityIcon>
        <Icon
          d={likePath}
          width="18.75px"
          height="18.75px"
          fill={liked ? "rgb(224, 36, 94)" : "rgb(101, 119, 134)"}
        />
      </ActivityIcon>
      <Text color={liked ? "rgb(224, 36, 94)" : "rgb(101, 119, 134)"}>
        {likesCount}
      </Text>
      {isShowDes && (
        <div
          style={{
            color: theme.color,
            position: "absolute",
            bottom: "-35px",
            padding: "5px 10px",
            borderRadius: "3px",
            backgroundColor: theme.border,
            width: "fit-content",
            minWidth: "48px",
            zIndex: 99,
          }}
        >
          {i18next.t("tweet.like")}
        </div>
      )}
    </ActivityBox>
  );
};

export default Like;

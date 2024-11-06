import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { postService } from "../../services/PostService";
import Icon from "../icon";
import { ActivityBox, ActivityIcon } from "../styles/common";
import { Text } from "../styles/profile";
import i18next from "i18next";

const Retweet = (props) => {
  const { tweet, disabled } = props;
  const theme = useSelector((state) => state.theme);

  const [isShowDes, setIsShowDes] = useState(false);
  const [retweetCount, setRetweetCount] = useState(0);
  const retweetPath = [
    "M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z",
  ];

  useEffect(() => {
    setRetweetCount(tweet?.retweetCount);
  }, [tweet]);

  const toggleDescription = () => {
    if (!window.matchMedia("(max-width: 768px)").matches) {
      setIsShowDes(!isShowDes);
    }
  };

  const handleRetweet = async (e) => {
    e.preventDefault();
    const response = await postService.retweet(tweet.slug);
    if (response.success) {
      setRetweetCount((prev) => prev + 1);
    }
  };

  return (
    <ActivityBox
      onClick={handleRetweet}
      disabled={disabled}
      hoverColor={!disabled && "rgb(23,191,99)"}
      hoverBg={!disabled && "rgba(23,191,99,0.1)"}
      style={{ position: "relative" }}
      onMouseOver={!disabled && toggleDescription}
      onMouseOut={!disabled && toggleDescription}
    >
      <ActivityIcon>
        <Icon
          d={retweetPath}
          width="18.75px"
          height="18.75px"
          fill={tweet.selfRetweeted ? "rgb(23, 191, 99)" : "rgb(101, 119, 134)"}
        />
      </ActivityIcon>
      <Text
        color={tweet.selfRetweeted ? "rgb(23, 191, 99)" : "rgb(101, 119, 134)"}
      >
        {retweetCount}
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
          {i18next.t("profile.repost")}
        </div>
      )}
    </ActivityBox>
  );
};

export default Retweet;

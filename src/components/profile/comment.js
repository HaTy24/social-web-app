import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Icon from "../icon";
import { ActivityBox, ActivityIcon } from "../styles/common";
import { Text } from "../styles/profile";
import Modal from "../modal";
import CommentModal from "../tweet/commentModal";
import { doc } from "firebase/firestore";
import i18next from "i18next";

const commentPath = [
  "M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z",
];

const Comment = (props) => {
  const {
    tweet,
    onClick,
    disabled,
    onFetchNewTweet = () => {},
    isTweetDetail = false,
  } = props;
  const theme = useSelector((state) => state.theme);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowDes, setIsShowDes] = useState(false);
  const [commentCount, setCommentCount] = useState(tweet?.commentCount || 0);

  const toggleDescription = () => {
    if (!window.matchMedia("(max-width: 768px)").matches) {
      setIsShowDes(!isShowDes);
    }
  };

  const toggleOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setCommentCount(tweet?.commentCount || 0);
  }, [tweet?.commentCount]);
  return (
    <>
      {isModalOpen && (
        <Modal
          toggleOpen={toggleOpen}
          children={
            <CommentModal
              handleClose={handleClose}
              tweetId={tweet.slug}
              onSuccess={() => {
                setCommentCount(commentCount + 1);
                onFetchNewTweet();
              }}
            />
          }
          handleClose={handleClose}
          top="10%"
          padding="15px"
        />
      )}
      <ActivityBox
        disabled={disabled}
        hoverColor={!disabled && "rgb(29,161,242)"}
        hoverBg={!disabled && "rgba(29,161,242,0.1)"}
        onClick={(e) => {
          if (isTweetDetail) {
            document.getElementById("input-reply").focus();
          } else {
            setIsModalOpen(true);
          }
        }}
        style={{ position: "relative" }}
        onMouseOver={!disabled && toggleDescription}
        onMouseOut={!disabled && toggleDescription}
      >
        <ActivityIcon>
          <Icon
            d={commentPath}
            width="18.75px"
            height="18.75px"
            fill="rgb(101, 119, 134)"
          />
        </ActivityIcon>
        <Text color="rgb(101, 119, 134)">{commentCount}</Text>
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
            {i18next.t("tweet.reply")}
          </div>
        )}
      </ActivityBox>
    </>
  );
};

export default Comment;

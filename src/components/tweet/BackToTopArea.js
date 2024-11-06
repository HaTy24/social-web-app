import React, { useEffect, useState } from "react";
import { postService } from "../../services/PostService";
import { CloseIcon } from "../icons/CloseIcon";
import { BackToTopArea } from "../styles/home";
import i18next from "i18next";

const BackToTopPost = ({ totalPost, handleRefreshPost }) => {
  const [isVisibleShowNewPost, setIsVisibleShowNewPost] = useState(false);
  const [countNewPost, setCountNewPost] = useState(0);

  useEffect(() => {
    const tweetInterval = setInterval(() => {
      countCurrentPost({ limit: 1, offset: 0 }, totalPost);
    }, 30000);

    return () => clearInterval(tweetInterval);
  }, [totalPost]);

  const countCurrentPost = async (pagination, totalPost) => {
    if (totalPost > 0) {
      try {
        const response = await postService.getTweets(pagination);
        if (response.success && response.data.total > totalPost) {
          setIsVisibleShowNewPost(true);
          setCountNewPost(response.data.total - totalPost);
        }
      } catch (error) {
        console.error("An error occurred while getting tweets:", error);
      }
    }
  };
  return (
    <div>
      <BackToTopArea
        style={{
          bottom: `${window.matchMedia("(min-width: 768px)").matches ? "50px" : "150px"
            }`,
        }}
      >
        <div
          style={{
            position: "fixed",
            bottom: `${window.matchMedia("(min-width: 768px)").matches ? "50px" : "100px"
              }`,
            right: "50%",
            transform: "translate(50%)",
            backgroundColor: "#1DA1F2FF",
            color: "white",
            borderRadius: "1rem",
            display: `${isVisibleShowNewPost ? "flex" : "none"}`,
            gap: "5px",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <div
            onClick={() => {
              setIsVisibleShowNewPost(false);
              setCountNewPost(0);
              handleRefreshPost();
            }}
            style={{
              padding: "5px 8px",
            }}
          >
            <p style={{ margin: "0" }}>
              {countNewPost > 1 ? i18next.t("thereAreNewPost", { number: countNewPost }) : i18next.t("thereIsNewPost", { number: countNewPost })}
            </p>
          </div>
          <div
            style={{
              borderRadius: "50%",
              backgroundColor: "white",
              height: "24px",
              width: "24px",
              cursor: "pointer",
              marginRight: "5px",
            }}
            onClick={(e) => {
              setIsVisibleShowNewPost(false);
            }}
          >
            <CloseIcon color={"#1DA1F2"} height={24} width={24} />
          </div>
        </div>
      </BackToTopArea>
    </div>
  );
};

export default BackToTopPost;

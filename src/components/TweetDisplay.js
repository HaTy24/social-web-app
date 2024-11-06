import React from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../services/AuthService";
import {
  regexCharactersBetweenAtSigns,
  regexMultipleAdjacentAtSigns,
} from "../utils/regex";
import { HashTag } from "./styles/tweet";

const TweetDisplay = ({
  tweetContent = "",
  searchHashtag = "",
  handleClickHashtag,
}) => {
  const history = useHistory();

  const handleHashtagClick = (event) => {
    const hashtag = event.target.dataset.hashtag;
    if (hashtag) {
      event.preventDefault();
      if (handleClickHashtag) {
        handleClickHashtag(hashtag);
      }
      history.push(`/hashtag/${hashtag}`);
    }
  };

  const handleTagUserClick = async (event, userName) => {
    const taguser = event.target.dataset.taguser;
    const result = await authService.getUserInfoByUserName(userName);
    if (taguser) {
      event.preventDefault();
      if (!result.success) {
        toast.warning("Sorry, this user doesn't seem to exist", {
          position: "bottom-center",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        if (handleClickHashtag) {
          handleClickHashtag(taguser);
        }
        history.push(`/profile/${result?.data?.id}`);
      }
    }
  };

  const splitted = tweetContent.split(" ");

  return (
    <HashTag>
      {splitted.map((text) =>
        text.startsWith("#") ? (
          <span
            onClick={handleHashtagClick}
            class={`${
              String(text).replace(/#/g, "").toLowerCase() ===
              String(searchHashtag).toLowerCase()
                ? "hashtag-bold"
                : "hashtag"
            }`}
            data-hashtag={text.replace(/#/g, "")}
          >
            {text}&nbsp;
          </span>
        ) : text.startsWith("@") &&
          !regexMultipleAdjacentAtSigns.test(text) &&
          !regexCharactersBetweenAtSigns.test(text) ? (
          <span
            onClick={(e) => handleTagUserClick(e, text.replace(/[@#]/g, ""))}
            class="hashtag"
            data-taguser={text.replace(/[@#]/g, "")}
          >
            {text}&nbsp;
          </span>
        ) : (
          text + " "
        )
      )}
    </HashTag>
  );
};

export default TweetDisplay;

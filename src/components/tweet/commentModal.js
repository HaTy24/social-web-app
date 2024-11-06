import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ACCOUNT_TYPE, IMG_IS_NSFW, MAX_SIZE_IMAGE } from "../../constants";
import { useAliUpload } from "../../services/CloudService";
import { postService } from "../../services/PostService";
import { userService } from "../../services/UserService";
import {
  appendStringAtPosition,
  removeSubstring,
} from "../../utils/stringUtil";
import { ClickOutside } from "../../utils/triggerClickOutside";
import PostImage from "../PostImage";
import { CloseIcon } from "../icons/CloseIcon";
import { EmojiIcon } from "../icons/EmojiIcon";
import { ImageIcon } from "../icons/ImageIcon";
import { YellowTick } from "../icons/YellowTick";
import Loading from "../loading";
import { EmojiPickerContainer } from "../styles/chat";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import i18next from "i18next";
import { AutoComplete } from "../styles/explore";
import { Button, Flex } from "../styles/modal";
import { PeopleDetails, PeopleFlex, UserImage } from "../styles/profile";

const CommentModal = (props) => {
  const { onAliUpload } = useAliUpload();
  const [text, setText] = useState("");
  const [isCommentDisabled, setIsCommentDisabled] = useState(true);
  const [preview, setPreview] = useState([]);
  const [hastags, setHastags] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenTagModal, setIsOpenTagModal] = useState(false);
  const [tagUsersAvailable, setTagUsersAvailable] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const tempArr = useRef([]);
  const postRef = useRef();
  const tagRef = useRef();

  const user = useSelector((state) => state.profile.user);
  const theme = useSelector((state) => state.theme);
  const [fileUpload, setFileUpload] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);

  const { handleClose, rows, tweetId, onSuccess } = props;

  const addComment = async () => {
    setIsCommentDisabled(true);
    setIsLoading(true);
    const urlArray = await handleUpload();
    const res = await postService.commentTweet(
      {
        text,
        media: urlArray,
        hastags,
      },
      tweetId
    );
    if (res.success) {
      onSuccess();
      setPreview([]);
      setFileUpload([]);
      setText("");
      handleClose && handleClose();
    } else if (!res.success && String(res.code).toLowerCase() === IMG_IS_NSFW) {
      toast.error("Your image is NSFW therefore can't be processed");
      setIsTweetDisabled(false);
    } else {
      toast.error("Sent tweet failed");
      setIsCommentDisabled(false);
    }
    setIsLoading(false);
  };

  const handleUpload = async () => {
    let images = [];
    if (fileUpload.length !== 0) {
      const uploadedImages = await onAliUpload(
        fileUpload,
        "homePage",
        `home-page`
      );

      if (uploadedImages) {
        images = uploadedImages.map((image) => image.url);
      }
    }
    return images;
  };

  const handlePhoto = (event) => {
    const maxPhotos = 4;
    const totalPhotos = event.target.files.length + preview.length;
    const allowedExtensions = ["png", "jpg", "jpeg"];

    if (totalPhotos > maxPhotos) {
      toast(`${i18next.t("chooseUpTo")} ${maxPhotos} ${i18next.t("photo")}`, {
        position: "bottom-center",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const files = Array.from(event.target.files);

    const filesAccepted = files.map((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        toast(
          `${i18next.t("invalidFileFormat")}`,
          {
            position: "bottom-center",
            autoClose: 2000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        return;
      }

      if (file.size <= MAX_SIZE_IMAGE) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          setPreview((prev) => [...prev, event.target.result]);
        };
        return file;
      } else {
        toast(`${i18next.t("minimumCapacityError")}`, {
          position: "bottom-center",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
    setFileUpload([...fileUpload, ...filesAccepted]);
    event.target.value = null;
  };

  const onRemove = (index) => {
    setPreview(preview.filter((_, i) => i !== index));
    setFileUpload(fileUpload.filter((_, i) => i !== index));
  };

  const handleSelectEmoji = (emojiObject) => {
    setText((prevMessageInput) => prevMessageInput + emojiObject.native);
    setIsTweetDisabled(false);
  };

  ClickOutside(emojiRef, () => {
    setShowEmojiPicker(false);
  });

  ClickOutside(tagRef, () => {
    setIsOpenTagModal(false);
  });

  const getTagUserAvailable = async () => {
    if (!text.endsWith("@")) {
      const result = await userService.getTagUserAvailable();
      if (result.success) {
        setTagUsersAvailable(result.data);
        tempArr.current = result.data;
        setIsOpenTagModal(true);
      }
    } else {
      setIsOpenTagModal(false);
    }
  };

  const onChangeText = (e) => {
    setText(e.target.value);
    setCursorPosition(e.target.selectionStart);
    e.target.value.trim()
      ? setIsCommentDisabled(false)
      : setIsCommentDisabled(true);
    if (isOpenTagModal) {
      const compare = e.target.value
        .slice(e.target.value.lastIndexOf("@") + 1)
        .toLowerCase();
      const filtered = tempArr.current.filter((user) =>
        filterString(user?.twitterScreenName?.toLowerCase(), compare)
      );
      if (e.target.value.lastIndexOf("@") < 0 || !filtered.length) {
        setIsOpenTagModal(false);
      }
      setTagUsersAvailable(filtered);
    }
  };

  const onSelectUserTotag = (item) => {
    const atIndex = text.lastIndexOf("@", cursorPosition);

    let textAfterAt = text.substring(atIndex + 1, cursorPosition).trim();
    if (textAfterAt) {
      if (filterString(item?.twitterScreenName?.toLowerCase(), textAfterAt)) {
        textAfterAt = "";
      } else {
        textAfterAt;
      }
    }

    const spaceIndex = text.indexOf(" ", cursorPosition);

    let textBetweenAtAndSpace = "";
    if (atIndex !== -1) {
      if (spaceIndex !== -1) {
        const charsBetweenAtAndSpace = text.substring(atIndex + 1, spaceIndex);
        textBetweenAtAndSpace = charsBetweenAtAndSpace;
      } else {
        const charsBetweenAtAndSpace = text.substring(atIndex + 1);
        textBetweenAtAndSpace = charsBetweenAtAndSpace;
      }
    }
    if (textBetweenAtAndSpace) {
      if (
        filterString(
          item?.twitterScreenName?.toLowerCase(),
          textBetweenAtAndSpace
        )
      ) {
        textAfterAt = "";
      } else {
        textAfterAt = " " + textBetweenAtAndSpace;
      }
    }

    const updatedText = appendStringAtPosition(
      removeSubstring(
        text,
        atIndex + 1,
        textBetweenAtAndSpace
          ? cursorPosition + textBetweenAtAndSpace.length
          : cursorPosition
      ),
      item.twitterScreenName,
      atIndex + 1
    );

    setText(updatedText + " " + textAfterAt);
    setIsOpenTagModal(false);
    postRef.current.focus();
  };

  return (
    <Flex bg={theme.bg} color={theme.color}>
      <div
        style={{
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            position: "relative",
          }}
        >
          <img
            src={user?.profile_image_url}
            width="49px"
            height="49px"
            style={{ borderRadius: "50%" }}
          />
          <textarea
            ref={postRef}
            rows={rows || 5}
            placeholder="Tweet your reply"
            value={text}
            onChange={(e) => {
              onChangeText(e);
            }}
            onKeyDown={(e) => {
              e.key === "@" && getTagUserAvailable();
            }}
            autoFocus
          ></textarea>
          {isOpenTagModal && tagUsersAvailable.length > 0 && (
            <AutoComplete
              ref={tagRef}
              boxShadow={theme.boxShadow}
              bg={theme.bg}
              style={{
                maxHeight: "180px",
                width: "100%",
                marginTop: "0px",
                position: "relative",
              }}
            >
              {tagUsersAvailable.map((item, index) => (
                <PeopleFlex
                  key={index}
                  tweetHov={theme.tweetHov}
                  bg={theme.bg}
                  onClick={() => onSelectUserTotag(item)}
                >
                  <div>
                    <UserImage src={item.profile_image_url} />
                  </div>
                  <div style={{ width: "100%" }}>
                    <PeopleDetails>
                      <div>
                        <h3
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                            color: theme.color,
                          }}
                        >
                          {item.fullname}
                          {item.accountType === ACCOUNT_TYPE.INVESTMENT && (
                            <YellowTick />
                          )}
                        </h3>
                        <p>@{item.twitterScreenName}</p>
                      </div>
                    </PeopleDetails>
                  </div>
                </PeopleFlex>
              ))}
            </AutoComplete>
          )}
        </div>
        <div style={{ marginBottom: "10px", marginRight: 0 }}>
          <PostImage images={preview} onRemove={onRemove} />
        </div>
        <Flex
          style={{
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <div>
            <input
              type="file"
              id="photoCommment"
              multiple
              name="photoCommment"
              accept="image/png, image/jpeg, image/webp"
              onChange={handlePhoto}
              style={{ display: "none" }}
            />
          </div>
          <label
            style={{ height: "24px", cursor: "pointer" }}
            htmlFor="photoCommment"
          >
            <ImageIcon color={theme.defaultBg} />
          </label>
          <div
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            style={{
              cursor: "pointer",
              height: "24px",
            }}
          >
            <EmojiIcon color={theme.defaultBg} />
          </div>
          <div>
            <Button
              onClick={addComment}
              disabled={isCommentDisabled}
              style={{
                backgroundColor: theme.defaultBg,
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              {i18next.t("tweet.reply")}
              {isLoading && <Loading color={theme.color} size={12} />}
            </Button>
          </div>
        </Flex>
        <EmojiPickerContainer
          ref={emojiRef}
          style={{
            bottom: "0px",
            right: "0px",
            paddingTop: "15px",
            opacity: showEmojiPicker ? 1 : 0,
            visibility: showEmojiPicker ? "visible" : "hidden",
            transformOrigin: "top center",
            height: "200px",
            zIndex: 1,
          }}
          height={showEmojiPicker ? "auto" : "0px"}
        >
          <div
            style={{
              color: "red",
              cursor: "pointer",
              position: "absolute",
              top: "7px",
              right: "-7px",
              zIndex: 3,
              background: "#bfbcbc6e",
              borderRadius: "50%",
              height: "28px",
              width: "28px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setShowEmojiPicker(false)}
          >
            <CloseIcon color={"#1DA1F2"} height={18} width={18} />
          </div>
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "10px",
              zIndex: 0,
            }}
          >
            <Picker
              theme={theme.mode}
              style={{ width: "100%", zIndex: 1 }}
              emojiVersion={13}
              data={data}
              onEmojiSelect={handleSelectEmoji}
              previewPosition={"none"}
              perLine={9}
              emojiSize={20}
              emojiButtonSize={30}
              searchPosition={"none"}
            />
          </div>
        </EmojiPickerContainer>
      </div>
    </Flex>
  );
};

export default CommentModal;

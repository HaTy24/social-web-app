import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  ACCOUNT_TYPE,
  IMG_IS_NSFW,
  MAX_SIZE_IMAGE,
  POLICY_OPTIONS,
} from "../../constants";
import { SET_RELOAD_POST } from "../../redux/actions";
import { useAliUpload } from "../../services/CloudService";
import { postService } from "../../services/PostService";
import { userService } from "../../services/UserService";
import {
  appendStringAtPosition,
  filterString,
  removeSubstring,
} from "../../utils/stringUtil";
import { ClickOutside } from "../../utils/triggerClickOutside";
import DropDownPolicy from "../DropDownPolicy";
import PostImage from "../PostImage";
import { CloseIcon } from "../icons/CloseIcon";
import { EmojiIcon } from "../icons/EmojiIcon";
import { ImageIcon } from "../icons/ImageIcon";
import i18next from "i18next";

const URL = process.env.REACT_APP_SERVER_URL;
import { YellowTick } from "../icons/YellowTick";
import Loading from "../loading";
import { EmojiPickerContainer } from "../styles/chat";
import { AutoComplete } from "../styles/explore";
import { Button, Flex } from "../styles/modal";
import { PeopleDetails, PeopleFlex } from "../styles/profile";
import { UserImage } from "../styles/tweet";

const TweetModal = (props) => {
  const { onAliUpload } = useAliUpload();
  const [text, setText] = useState("");
  const [hastags, setHastags] = useState([""]);
  const [isTweetDisabled, setIsTweetDisabled] = useState(true);
  const [fileUpload, setFileUpload] = useState([]);
  const storeUser = useSelector((state) => state.profile.user);
  const [preview, setPreview] = useState([]);
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);
  const [currentPolicy, setCurrentPolicy] = useState({...POLICY_OPTIONS.PUBLIC_POLICY,label:i18next.t(`tweet.${POLICY_OPTIONS.PUBLIC_POLICY.label}`)} );
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenTagModal, setIsOpenTagModal] = useState(false);
  const [tagUsersAvailable, setTagUsersAvailable] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);

  const tempArr = useRef([]);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const { handleClose, rows, userInfo, autoFocus = true } = props;
  const postRef = useRef();
  const tagRef = useRef();

  const addTweet = async () => {
    try {
      setIsTweetDisabled(true);
      setIsLoading(true);
      const urlArray = await handleUpload();

      if (fileUpload.length && !urlArray.length) {
        setIsTweetDisabled(false);
        setIsLoading(false);
        return;
      }
      const res = await postService.postTweet({
        text,
        media: urlArray,
        hastags,
        policy: currentPolicy.value,
      });
      if (res.success) {
        setPreview([]);
        setFileUpload([]);
        setText("");
        postRef.current.focus();
        toast(`${i18next.t("yourPostWasSent")}`);
        dispatch({ type: SET_RELOAD_POST });
        handleClose && handleClose();
        setIsTweetDisabled(false);
      } else if (
        !res.success &&
        String(res.code).toLowerCase() === IMG_IS_NSFW
      ) {
        toast.error(`${i18next.t("imageIsNSFW")}`);
        setIsTweetDisabled(false);
      } else {
        toast.error(`${i18next.t("sentPostFailed")}`);
        setIsTweetDisabled(false);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
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
    postRef.current.focus();
    setFileUpload([...fileUpload, ...filesAccepted]);
    event.target.value = null;
  };

  const onRemove = (index) => {
    setPreview(preview.filter((_, i) => i !== index));
    setFileUpload(fileUpload.filter((_, i) => i !== index));
    if (preview.length === 1) {
      fileInputRef.current && (fileInputRef.current.value = null);
    }
    postRef.current.focus();
  };

  const handleSelectEmoji = (emojiObject) => {
    setText((prevMessageInput) => prevMessageInput + emojiObject.native);
    setIsTweetDisabled(false);
    postRef.current.focus();
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
    setCursorPosition(e.target.selectionStart);
    setText(e.target.value);
    e.target.value.trim()
      ? setIsTweetDisabled(false)
      : setIsTweetDisabled(true);
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
    <React.Fragment>
      <Flex bg={theme.bg} color={theme.color}>
        <div style={{ width: "100%", position: "relative" }}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              position: "relative",
            }}
          >
            <div>
              <img
                src={
                  userInfo?.profile_image_url || storeUser?.profile_image_url
                }
                width="49px"
                height="49px"
                style={{ borderRadius: "50%" }}
              />
            </div>
            <div style={{ width: "100%", position: "relative" }}>
              <DropDownPolicy
                listItem={Object.entries(POLICY_OPTIONS).map(
                  ([key, value]) => ({
                    ...value,
                    key,
                    label:i18next.t(`tweet.${value.label}`),
                  })
                )}
                currentItem={currentPolicy}
                onChange={(newItem) => {
                  setCurrentPolicy(newItem);
                }}
              />
              <textarea
                ref={postRef}
                rows={rows || 5}
                placeholder={i18next.t("tweet.whatsHappening")}
                value={text}
                onChange={(e) => {
                  onChangeText(e);
                }}
                onKeyDown={(e) => {
                  e.key === "@" && getTagUserAvailable();
                }}
                autoFocus={autoFocus}
                style={{ position: "relative" }}
              ></textarea>
              {isOpenTagModal && tagUsersAvailable.length > 0 && (
                <AutoComplete
                  ref={tagRef}
                  boxShadow={theme.boxShadow}
                  bg={theme.bg}
                  style={{
                    top: 0,
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
                ref={fileInputRef}
                type="file"
                id="photo"
                multiple
                name="photo"
                accept="image/png, image/jpeg, image/webp"
                onChange={handlePhoto}
                style={{ display: "none" }}
              />
            </div>
            <label
              style={{ height: "24px", cursor: "pointer" }}
              htmlFor="photo"
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
                onClick={addTweet}
                disabled={isTweetDisabled}
                defaultBg={theme.defaultBg}
                darkBg={theme.darkBg}
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
               {i18next.t("post")}
                {isLoading && <Loading color={"white"} />}
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
    </React.Fragment>
  );
};

export default TweetModal;

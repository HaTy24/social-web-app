import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { ACCOUNT_TYPE, IMAGE_TYPE, IMG_IS_NSFW } from "../../constants";
import { SET_UPDATE, SET_USER } from "../../redux/actions";
import { authService } from "../../services/AuthService";
import { useAliUpload } from "../../services/CloudService";
import { userService } from "../../services/UserService";
import { CopyIcon } from "../core/icons/CopyIcon";
import Icon from "../icon";
import { LocationIcon } from "../icons/LocationIcon";
import { WebsiteIcon } from "../icons/WebsiteIcon";
import { YellowTick } from "../icons/YellowTick";
import { ImageCropperModal } from "../images/ImageCropperModal";
import Loading from "../loading";
import Modal from "../modal";
import ProfileHeader from "../profileHeader";
import { ProfileCorner, RelationshipBox } from "../styles/common";
import {
  Avatar,
  Cover,
  Dates,
  ImgFlex,
  Info,
  ReferralBox,
  ReferralSpan,
} from "../styles/profile";
import { Button } from "../styles/sidebar";
import Tabs from "../tabs";
import Activity from "./activity";
import EditProfileForm from "./editProfileForm";
import Follower from "./follower";
import { blobToFile } from "../../utils/file";
import i18next from "i18next";

const URL = process.env.REACT_APP_SERVER_URL;

const Profile = () => {
  const { onAliUpload } = useAliUpload();
  const [avatar, setAvatar] = useState();
  const [cover, setCover] = useState();
  const [imageType, setImageType] = useState(IMAGE_TYPE.AVATAR);
  const url_origin = window.location.origin;
  const [userInfo, setUserInfo] = useState(null);
  const [headerText, setHeaderText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCropImageOpen, setIsModalCropImageOpen] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [{ holders, holdings }, setSharesBought] = useState({
    holders: 0,
    holdings: 0,
  });

  const { activity, id } = useParams();
  const user = useSelector((state) => state.profile.user);
  const theme = useSelector((state) => state.theme);
  const myId = userInfo?.id;
  const dispatch = useDispatch();

  const handleHeaderText = (text) => {
    setHeaderText(text);
  };

  const getUserInfo = async () => {
    const response = await authService.getUserInfo(id);
    if (response.success) {
      setUserInfo(response.data);
    }
  };

  const getRelationships = async () => {
    const response = await userService.getRelationships(id);
    if (response.success) {
      setSharesBought({
        holders: response.data.holderAddreses.length,
        holdings: response.data.holdingAddresses.length,
      });
    }
  };

  useEffect(() => {
    document.title = "Profile / Weknot.io";
  }, []);

  useEffect(() => {
    getUserInfo();
    getRelationships();
  }, [id]);

  const handleUpload = async (file, fileName, filePath) => {
    let image = null;
    if (file.length !== 0) {
      const uploadedImages = await onAliUpload(file, fileName, filePath);
      if (uploadedImages) {
        image = uploadedImages[0].url;
      }
    }
    return image;
  };

  const handleSubmit = async (data) => {
    setIsSaveDisabled(true);
    const { fullname, description, location, website } = data;
    try {
      if (avatar) {
        const avatarUrl = await handleUpload([avatar], "avatar", "avatar");
        const responseUpdateAvatar = await authService.updateAvatar(avatarUrl);

        if (responseUpdateAvatar.success) {
          dispatch({
            type: SET_USER,
            payload: {
              ...user,
              profile_image_url: avatarUrl,
            },
          });
          setAvatar(null);
        } else if (
          !responseUpdateAvatar.success &&
          String(responseUpdateAvatar.code).toLowerCase() === IMG_IS_NSFW
        ) {
          toast.error(`${i18next, t("imageIsNSFW")}`);
          setIsSaveDisabled(false);
          return;
        } else {
          toast.error(`${i18next, t("updateAvatarFailed")}`);
          setIsSaveDisabled(false);
          return;
        }
      }

      if (cover) {
        const bannerUrl = await handleUpload([cover], "banner", "banner");
        const responseUpdateBanner = await authService.updateBanner(bannerUrl);

        if (responseUpdateBanner.success) {
          dispatch({
            type: SET_USER,
            payload: {
              ...user,
              profile_banner_url: bannerUrl,
            },
          });
          setCover(null);
        } else if (
          !responseUpdateBanner.success &&
          String(responseUpdateBanner.code).toLowerCase() === IMG_IS_NSFW
        ) {
          toast.error(`${i18next, t("imageIsNSFW")}`);
          setIsSaveDisabled(false);
          return;
        } else {
          toast.error(`${i18next, t("updateAvatarFailed")}`);
          setIsSaveDisabled(false);
          return;
        }
      }

      const responeUpdateInfo = await authService.updateProfile({
        fullname,
        description,
        location,
        website,
      });

      if (responeUpdateInfo.success) {
        setIsSaveDisabled(false);
        setIsModalOpen(false);
        toast(`${i18next, t("profileWasEditedSuccessfully")}`);
        dispatch({
          type: SET_USER,
          payload: {
            ...user,
            fullname: data.fullname,
            website: data.website,
            description: data.description,
            location: data.location,
          },
        });
        dispatch({ type: SET_UPDATE });
        getUserInfo();
      } else {
        toast.error(`${i18next, t("updateProfileFailed")}`);
      }
    } catch (error) {
      setIsSaveDisabled(false);
      console.log(error);
    }
  };

  if (userInfo === null)
    return (
      <div style={{ height: "100vh", backgroundColor: theme.bg }}>
        <Loading />
      </div>
    );

  const joinedAt = new Date(userInfo.joinDate);

  const joinPath = [
    "M19.708 2H4.292C3.028 2 2 3.028 2 4.292v15.416C2 20.972 3.028 22 4.292 22h15.416C20.972 22 22 20.972 22 19.708V4.292C22 3.028 20.972 2 19.708 2zm.792 17.708c0 .437-.355.792-.792.792H4.292c-.437 0-.792-.355-.792-.792V6.418c0-.437.354-.79.79-.792h15.42c.436 0 .79.355.79.79V19.71z",
  ];

  const tabList = [
    // {
    //   name: "tweets",
    //   title: "Tweets",
    //   path: undefined,
    // },
    // {
    //   name: "media",
    //   title: "Media",
    //   path: "/media",
    // },
    // {
    //   name: "likes",
    //   title: "Likes",
    //   path: "/likes",
    // },
  ];

  // if (activity === "followers" || activity === "following") return <Follow />;

  const renderTab = () => {
    // undefined -> tweet
    switch (activity) {
      case undefined:
        return (
          <div>
            <Activity
              url={`${URL}/user/get-tweets?userId=${userInfo.id}&myId=${myId}`}
              dataKey={i18next.t("profile.hasNotPostYet")}
              header="Tweets"
              handleHeaderText={handleHeaderText}
              userInfo={userInfo}
            />
          </div>
        );
      case "media":
        return (
          <div>
            <Activity
              url={`${URL}/user/get-media?userId=${userInfo.id}&myId=${myId}`}
              dataKey={i18next.t("profile.hasNotMediaYet")}
              header="Photos &amp; Videos"
              handleHeaderText={handleHeaderText}
            />
          </div>
        );
      case "likes":
        return (
          <div>
            <Activity
              url={`${URL}/user/get-likes?userId=${userInfo.id}&myId=${myId}`}
              dataKey={i18next.t("profile.hasNotLikeYet")}
              header="Likes"
              handleHeaderText={handleHeaderText}
            />
          </div>
        );
    }
  };
  const handleCopy = (value) => {
    navigator.clipboard
      .writeText(value)
      .then(() => toast(`${i18next.t("copiedToClipboard")}`), {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  };
  const toggleOpen = () => {
    setIsModalOpen(!isModalOpen);
    setAvatar(null);
    setCover(null);
  };

  const toggleOpenModalCropImage = () => {
    setIsModalOpen(!isModalOpen);
    setIsModalCropImageOpen(!isModalCropImageOpen);
    setAvatar(null);
    setCover(null);
  };

  return (
    <React.Fragment>
      {isModalOpen && (
        <Modal
          children={
            <EditProfileForm
              onChosenAvatar={(file) => {
                setAvatar(file);
                setImageType(IMAGE_TYPE.AVATAR);
                setIsModalOpen(false);
                setIsModalCropImageOpen(true);
              }}
              onChosenCover={(file) => {
                setCover(file);
                setImageType(IMAGE_TYPE.COVER);
                setIsModalOpen(false);
                setIsModalCropImageOpen(true);
              }}
              defaultAvatar={avatar || userInfo?.profile_image_url}
              defaultCover={cover || userInfo?.profile_banner_url}
              onSubmit={handleSubmit}
              initialValues={userInfo}
              isSaveDisabled={isSaveDisabled}
            />
          }
          toggleOpen={toggleOpen}
          handleClose={() => {
            setAvatar(null);
            setCover(null);
            setIsModalOpen(false);
          }}
          padding="0px"
          headerBorder="#ccc"
          paddingBottomHeader="13px"
          heading={i18next.t("profile.editProfile")}
        />
      )}
      {isModalCropImageOpen && (
        <Modal
          children={
            <ImageCropperModal
              imageFile={imageType === IMAGE_TYPE.AVATAR ? avatar : cover}
              onFinish={(fileBlob) => {
                if (imageType === IMAGE_TYPE.AVATAR) {
                  setAvatar(blobToFile(fileBlob));
                } else {
                  setCover(blobToFile(fileBlob));
                }
                setIsModalCropImageOpen(false);
                setIsModalOpen(true);
              }}
              type={imageType}
            />
          }
          toggleOpen={toggleOpenModalCropImage}
          handleClose={() => {
            setAvatar(null);
            setCover(null);
            setIsModalCropImageOpen(false);
            setIsModalOpen(true);
          }}
          padding="0px"
          headerBorder="#ccc"
          paddingBottomHeader="13px"
          heading={i18next.t("profile.editProfile")}
        />
      )}
      <ProfileCorner border={theme.border}>
        <ProfileHeader heading={`${userInfo.fullname}`} text={headerText} />
        <div>
          <Cover
            bg={theme.border}
            style={{
              backgroundImage: `url(${userInfo.profile_banner_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></Cover>
          <ImgFlex>
            <Avatar
              backgroundImage={userInfo?.profile_image_url}
              bg={theme.bg}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                gap: "10px",
                margin: "10px 0",
              }}
            >
              {userInfo && id === user.id && (
                <Button
                  style={{
                    backgroundColor: "transparent",
                    border: `1px solid ${theme.color}`,
                    color: `${theme.color}`,
                  }}
                  onClick={() => setIsModalOpen(true)}
                >
                  {i18next.t("profile.editProfile")}
                </Button>
              )}
              <Link to={`/buy-sell/${id}`}>
                <Button onClick={(e) => { }} style={{ color: "#000" }}>
                  {i18next.t("profile.trade")}
                </Button>
              </Link>
            </div>
          </ImgFlex>
        </div>
        <Info color={theme.color}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div style={{}}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <h2>{userInfo.fullname}</h2>
                {userInfo.accountType === ACCOUNT_TYPE.INVESTMENT && (
                  <YellowTick />
                )}
              </div>
              {userInfo.twitterScreenName &&
                (userInfo.socialType === "twitter" ? (
                  <a
                    href={`https://twitter.com/${userInfo.twitterScreenName}`}
                    target="_blank"
                  >
                    @{userInfo.twitterScreenName}
                  </a>
                ) : (
                  <span style={{ color: "#1890ff" }}>
                    {" "}
                    @{userInfo.twitterScreenName}
                  </span>
                ))}
            </div>
          </div>
          <p
            style={{
              margin: "12px 0",
              color: theme.color,
              whiteSpace: "pre-line",
            }}
          >
            {userInfo.description}
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {userInfo.location && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <LocationIcon color="rgb(101, 119, 134)" />
                  <span>{userInfo.location}</span>
                </div>
              )}
              {userInfo.website && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <WebsiteIcon color="rgb(101, 119, 134)" />
                  <a href={userInfo.website} target="_blank">
                    {userInfo.website}
                  </a>
                </div>
              )}
              <Dates style={{ margin: "0" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <Icon
                    d={joinPath}
                    width="18.75"
                    height="18.75"
                    fill="rgb(101, 119, 134)"
                  />
                  <span>
                    {i18next.t("profile.joined")}&nbsp;
                    {joinedAt.getMonth()}
                    <span>-</span>
                    {joinedAt.getFullYear()}
                  </span>
                </div>
              </Dates>
            </div>

            {id === user.id && userInfo.referral_code && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <span style={{ fontWeight: "16px", color: theme.color }}>
                  {i18next.t("profile.myReferral")}
                </span>
                <ReferralBox>
                  <ReferralSpan color={theme.color}>
                    {`${url_origin}/referral?refCode=${userInfo.referral_code}`}
                  </ReferralSpan>
                  <Button
                    style={{
                      padding: "4px 8px",
                      background: "#94A3B8",
                      borderRadius: "20px",
                      color: theme.color,
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    onClick={() =>
                      handleCopy(
                        `${url_origin}/referral?refCode=${userInfo.referral_code}`
                      )
                    }
                  >
                    <div style={{ width: "18px", height: "18px" }}>
                      <CopyIcon color={theme.color} />
                    </div>{" "}
                    {i18next.t("profile.copy")}
                  </Button>
                </ReferralBox>
              </div>
            )}
            <div style={{ display: "flex", gap: "15px" }}>
              <RelationshipBox>
                <Link to={`/relationship/${id}?tabs=holders`}>
                  <span style={{ color: theme.color, fontWeight: "bold" }}>
                    {holders}&nbsp;
                  </span>
                  <span>{i18next.t("profile.holder")}</span>
                </Link>
              </RelationshipBox>
              <RelationshipBox>
                <Link to={`/relationship/${id}?tabs=holdings`}>
                  <span style={{ color: theme.color, fontWeight: "bold" }}>
                    {holdings}&nbsp;
                  </span>
                  <span>{i18next.t("profile.holding")}</span>
                </Link>
              </RelationshipBox>
            </div>
            <Follower user={userInfo} />
          </div>
        </Info>
        <Tabs tabList={tabList} />
        {renderTab()}
      </ProfileCorner>
    </React.Fragment>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Field, reduxForm } from "redux-form";

import { toast } from "react-toastify";
import { MAX_SIZE_IMAGE } from "../../constants";
import Loading from "../loading";
import { Button, StyledInput } from "../styles/common";
import { Avatar, Cover, ImgFlex, MyProfile } from "../styles/profile";
import { Error } from "../styles/signin";
import UploadButton from "../uploadButton";
import i18next from "i18next";

const validate = (data) => {
  const errors = {};
  if (!data.firstname) errors.firstname = `${i18next.t("profile.firstnameRequired")}`;
  if (!data.lastname) errors.lastname = `${i18next.t("profile.lastnameRequired")}`;
  if (!data.dob) errors.dob = `${i18next.t("profile.dateOfBirthRequired")}`;
  if (!data.bio) data.bio = "";
  if (!data.location) data.location = "";
  return errors;
};

const Input = ({ input, type, placeholder, meta: { touched, error } }) => {
  const theme = useSelector((state) => state.theme);
  return (
    <React.Fragment>
      <StyledInput
        {...input}
        type={type}
        placeholder={placeholder}
        color={theme.color}
      />
      {touched && error && <Error>{error}</Error>}
    </React.Fragment>
  );
};

let EditProfileForm = (props) => {
  const [cover, setCover] = useState();
  const [avatar, setAvatar] = useState();
  const allowedExtensions = ["png", "jpg", "jpeg", "heic"];

  const theme = useSelector((state) => state.theme);

  const { isSaveDisabled, onChosenAvatar, onChosenCover } = props;

  const handleCover = (e) => {
    const file = e.target.files[0];
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
      onChosenCover(file);
    } else {
      toast(`${i18next.t("minimumCapacityError")}`, {
        position: "bottom-center",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    e.target.value = null;
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
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
      onChosenAvatar(file);
    } else {
      toast(`${i18next.t("minimumCapacityError")}`, {
        position: "bottom-center",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    e.target.value = null;
  };

  const readFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (typeof props.defaultAvatar === "object") {
      (async () => {
        const url = await readFile(props.defaultAvatar);
        setAvatar(url);
      })();
    } else {
      setAvatar(props.defaultAvatar);
    }

    if (typeof props.defaultCover === "object") {
      (async () => {
        const url = await readFile(props.defaultCover);
        setCover(url);
      })();
    } else {
      setCover(props.defaultCover);
    }
  }, []);

  return (
    <form onSubmit={props.handleSubmit}>
      <Cover
        bg={theme.border}
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${cover})`,
          backgroundSize: "cover",
        }}
      >
        {/* {cover && <img src={cover} />} */}

        <label
          htmlFor="banner"
          style={{ zIndex: 1, position: "absolute", top: "50%" }}
        >
          <UploadButton
            isCamera
            color="rgb(255,255,255)"
            width="22.5px"
            height="22.5px"
          />
        </label>
        <input
          type="file"
          id="banner"
          name="banner"
          accept="image/png, image/jpeg, image/webp, image/heic"
          onChange={(e) => handleCover(e)}
          style={{ display: "none" }}
        />
      </Cover>
      <ImgFlex>
        <Avatar
          style={{ position: "relative" }}
          backgroundImage={avatar}
          bg={theme.bg}
        >
          <label
            htmlFor="avatar"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <UploadButton
              isCamera
              color="rgb(255,255,255)"
              width="22.5px"
              height="22.5px"
            />
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg, image/webp, image/heic"
            onChange={(e) => handleAvatar(e)}
            style={{ display: "none" }}
          />
        </Avatar>
      </ImgFlex>
      <MyProfile color={theme.color}>
        <div className="input-item">
          <label className="label">{i18next.t("profile.fullName")}</label>
          <Field
            type="text"
            name="fullname"
            component={Input}
            placeholder={i18next.t("profile.fullNamePlaceholder")}
          />
        </div>
        <div className="input-item">
          <label className="label">{i18next.t("profile.description")}</label>
          <Field
            type="text"
            name="description"
            component={Input}
            placeholder={i18next.t("profile.descriptionPlaceholder")}
          />
        </div>
        <div className="input-item">
          <label className="label">{i18next.t("profile.location")}</label>
          <Field
            type="text"
            name="location"
            component={Input}
            placeholder={i18next.t("profile.locationPlaceholder")}
          />
        </div>
        <div className="input-item">
          <label className="label">{i18next.t("profile.website")}</label>
          <Field
            type="text"
            name="website"
            component={Input}
            placeholder={i18next.t("profile.websitePlaceholder")}
          />
        </div>
        <Button
          type="submit"
          bg="rgb(29, 161, 242)"
          color="rgb(255,255,255)"
          padding="3px 10px"
          hoverBg="rgb(26,145,218)"
          disabled={isSaveDisabled}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            padding: "12px 0",
          }}
        >
          {i18next.t("profile.save")}{" "}
          {isSaveDisabled && (
            <Loading style={{ padding: 0 }} color={"#fff"} size={10} />
          )}
        </Button>
      </MyProfile>
    </form>
  );
};

EditProfileForm = reduxForm({
  form: "editprofile",
  validate,
})(EditProfileForm);

export default EditProfileForm;

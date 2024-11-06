import React, { useState } from "react";
import { toast } from "react-toastify";

import { MAX_SIZE_IMAGE, getStaticURL } from "../../constants";
import { UploadImgIcon } from "../icons/UploadImgIcon";
import { UploadImageWrapper } from "../styles/chat";
import i18next from "i18next";
export const UploadImage = ({
  imgUpload,
  setImgUpload,
  preview,
  setPreview,
  inputRef,
  messageInputRef,
}) => {
  const handleImgUpload = (event) => {
    const maxPhotos = 5;
    const totalPhotos = event.target.files.length + preview.length;
    const allowedExtensions = ["png", "jpg", "jpeg"];

    if (totalPhotos > maxPhotos) {
      toast(`${i18next.t("chooseUpTo")} ${maxPhotos} ${i18next.t("photos")}`, {
        position: "bottom-center",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const files = Array.from(event.target.files);
    const filesAccepted = files.filter((file) => {
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
    setImgUpload([...imgUpload, ...filesAccepted]);

    [filesAccepted].forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        setPreview((prev) => [...prev, event.target.result]);
      };
    });
  };

  const onRemoveImg = (index) => {
    setPreview(preview.filter((_, i) => i !== index));
    setImgUpload(imgUpload.filter((_, i) => i !== index));
    messageInputRef.current.focus();
  };

  return (
    <UploadImageWrapper>
      <div className="img-frame">
        <div className="img-item" style={{ cursor: "pointer" }}>
          <label
            htmlFor="imgUpload"
            style={{ cursor: "pointer", height: "24px" }}
          >
            <UploadImgIcon color={"#111"} />
          </label>
        </div>
        {preview.map((url, index) => {
          return (
            <div
              key={index}
              className="img-item"
              style={{ backgroundImage: `url(${url})` }}
            >
              <img src={url} alt="" className="img-preview" />
              <img
                className="close-icon"
                src={`${getStaticURL()}/assets/images/close.svg`}
                alt="menu"
                width={20}
                onClick={() => onRemoveImg(index)}
              />
            </div>
          );
        })}
      </div>
      <div className="upload-img">
        <input
          ref={inputRef}
          style={{ display: "none" }}
          id="imgUpload"
          name="images"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImgUpload}
          onClick={(e) => (e.target.value = "")}
        />
      </div>
    </UploadImageWrapper>
  );
};

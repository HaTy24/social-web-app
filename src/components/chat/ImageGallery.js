import React, { useState } from "react";
import { getStaticURL } from "../../constants";
import {
  ActionButton,
  ImagePreview,
  ImagePreviewAction,
  ImagePreviewContainer,
  ImagePreviewOverlay,
  MessageImage,
  MessageImageContainer,
} from "../styles/chat";
import { imageRender } from "../../utils/imageRender";

const ImageGallery = ({ images }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const openPreview = (image) => {
    setPreviewImage(image);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const downloadImage = () => {
    if (previewImage) {
      const link = document.createElement("a");
      link.href = previewImage;
      link.download = "image.jpg";
      link.click();
    }
  };

  return (
    <>
      <MessageImageContainer>
        {images.map((image, index) => (
          <MessageImage
            onClick={() => openPreview(imageRender(image))}
            key={index}
            src={imageRender(image)}
            alt={`Image ${index + 1}`}
            style={{ padding: "1px" }}
            className={
              index === images.length - 1 && images.length % 2 !== 0
                ? "full-width"
                : "max-h"
            }
          />
        ))}
      </MessageImageContainer>
      {previewImage && (
        <ImagePreviewOverlay onClick={closePreview}>
          <ImagePreviewAction>
            <ActionButton onClick={closePreview}>
              <img
                className="close-icon"
                src={`${getStaticURL()}/assets/images/close.svg`}
                alt="menu"
                width={20}
                onClick={() => onRemoveImg(index)}
              />
            </ActionButton>
            {/* <ActionButton onClick={downloadImage}>
              <DownloadIcon color={"#ffff"} />
            </ActionButton> */}
          </ImagePreviewAction>
          <ImagePreviewContainer>
            <ImagePreview src={previewImage} alt="Preview" />
          </ImagePreviewContainer>
        </ImagePreviewOverlay>
      )}
    </>
  );
};

export default ImageGallery;

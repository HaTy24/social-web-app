import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { IMAGE_TYPE } from "../../constants";
import { toPng } from "../../utils/heicToPng";
import Loading from "../loading";
import { Button } from "../styles/menubar";

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

const getRadianAngle = (degreeValue) => (degreeValue * Math.PI) / 180;

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} imageSrc - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * (maxSize / 2);

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas context to a central location on image to allow rotating around the center.
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to initialize canvas context.");
  }

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  // As a blob
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject("Failed to crop image.");
      }
    }, "image/png")
  );
};

const readFile = async (file) => {
  let newFile;
  if (file && file.name.toLowerCase().endsWith(".heic")) {
    newFile = await toPng(file);
  } else newFile = file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(newFile);
  });
};

export const ImageCropperModal = ({ imageFile, onFinish, type }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [widthCropper, setWidthCropper] = useState();
  const [heightCropper, setHeightCropper] = useState();
  const [loading, setLoading] = useState(true);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const [imageDataUrl, setImageDataUrl] = useState();

  useEffect(() => {
    if (typeof imageFile === "object") {
      (async () => {
        const url = await readFile(imageFile);
        setImageDataUrl(url);
        setLoading(false);
      })();
    } else {
      setImageDataUrl(imageFile);
      setLoading(false);
    }
  }, []);

  const cropImage = useCallback(async () => {
    setIsSubmitting(true);
    if (imageDataUrl && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageDataUrl, croppedAreaPixels);

      onFinish(croppedImage);
      setIsSubmitting(false);
    }
  }, [imageDataUrl, croppedAreaPixels, onFinish]);

  const onMediaLoad = (mediaSize) => {
    setWidthCropper(mediaSize.width);
    setHeightCropper(mediaSize.height);
  };

  const onZoomChange = (zoom) => {
    if (zoom < 1) return;
    setZoom(zoom);
  };

  const cropSize = {
    width: widthCropper,
    height: heightCropper,
  };

  return (
    <div>
      <div style={{ height: "60vh", position: "relative" }}>
        {type === IMAGE_TYPE.AVATAR ? (
          <Cropper
            minZoom={0.4}
            image={imageDataUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={onZoomChange}
            onMediaLoaded={onMediaLoad}
            restrictPosition={true}
          />
        ) : (
          <Cropper
            minZoom={0.4}
            image={imageDataUrl}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={onZoomChange}
            onMediaLoaded={onMediaLoad}
            restrictPosition={true}
          />
        )}
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "20px" }}
      >
        <i className="cil-zoom-out" />
        <div
          style={{
            width: window.matchMedia("(max-width: 768px)").matches
              ? `${cropSize.width / 1.2}px`
              : `${cropSize.width / 1.5}px`,
          }}
        >
          <Slider
            defaultValue={1}
            value={zoom}
            min={1}
            step={0.1}
            max={3}
            onChange={(val) => setZoom(val)}
          />
        </div>
        <i className="cil-zoom-in" />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px 0",
          textAlign: "center",
        }}
      >
        <Button
          onClick={cropImage}
          style={{
            padding: "15px",
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            gap: "5px",
            fontSize: "16px",
            position: "relative",
          }}
          disabled={isSubmitting}
        >
          Crop Image
          {isSubmitting && (
            <Loading style={{ padding: 0 }} color={"#fff"} size={10} />
          )}
        </Button>
      </div>
    </div>
  );
};

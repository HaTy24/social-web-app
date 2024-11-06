import React from "react";
import { Row, Col } from "antd";
import { getStaticURL } from "../constants";

const PostImage = ({ images, onRemove }) => {
  const closeButton = (
    <div
      style={{
        width: "25px",
        height: "25px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: "50%",
        cursor: "pointer",
        position: "absolute",
        top: "2px",
        left: "2px",
        zIndex: 99,
        opacity: 0.4,
      }}
    >
      <img
        style={{ cursor: "pointer" }}
        src={`${getStaticURL()}/assets/images/close.svg`}
        alt="menu"
        width={20}
        onClick={() => {}}
      />
    </div>
  );

  const renderImage = (image, index) => {
    return (
      <div
        key={index}
        style={{ position: "relative", width: "400px", height: "300px" }}
      >
        <div onClick={() => onRemove(index)}>{closeButton}</div>
        <img
          src={image}
          alt={`Image ${index + 1}`}
          style={{
            borderRadius: "8px",
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    );
  };

  const renderImages = () => {
    if (images.length === 1) {
      return (
        <div style={{ position: "relative", width: "100%", height: "300px" }}>
          <div onClick={() => onRemove(0)}>{closeButton}</div>
          <img
            src={images[0]}
            alt={`Image 1`}
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </div>
      );
    } else if (images.length === 2) {
      return <div style={{ display: "flex" }}>{images.map(renderImage)}</div>;
    } else if (images.length === 3) {
      return (
        <div style={{ display: "flex" }}>
          <div
            style={{ position: "relative", width: "400px", height: "300px" }}
          >
            {closeButton}
            <img
              src={images[0]}
              alt={`Image 1`}
              style={{
                width: "100%",
                objectFit: "cover",
                height: "100%",
                borderRadius: "8px",
              }}
            />
          </div>
          <div
            style={{
              width: "400px",
              height: "300px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {[images[1], images[2]].map((image, index) => {
              return (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "145px",
                  }}
                >
                  <div onClick={() => onRemove(index + 1)}>{closeButton}</div>
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    style={{
                      borderRadius: "8px",
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (images.length === 4) {
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {images.map((image, index) => {
            return (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: "calc(50% - 10px)",
                  height: "300px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 0,
                }}
              >
                <div onClick={() => onRemove(index)}>{closeButton}</div>
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  style={{
                    borderRadius: "8px",
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  };

  return <div style={{ marginLeft: 0 }}>{renderImages()}</div>;
};

export default PostImage;

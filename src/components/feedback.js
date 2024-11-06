import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

import { feedbackService } from "../services/FeedbackService";
import { MAX_SIZE_IMAGE, getStaticURL } from "../constants";
import { Container } from "./styles/feedback";
import { UploadImgIcon } from "./icons/UploadImgIcon";
import { BackgroundContent } from "./styles/signin";
import { useAliUpload } from "../services/CloudService";
import FormInput from "./controls/FormInput";
import FormAreaField from "./controls/FormAreaField";
import { Button } from "./styles/profile-wallet";
import Loading from "./loading";
import { userService } from "../services/UserService";
import i18next from "i18next";

const Feedback = () => {
  const theme = useSelector((state) => state.theme);
  const user = useSelector((state) => state.profile.user);
  const [imgUpload, setImgUpload] = useState([]);
  const [preview, setPreview] = useState([]);
  const { onAliUpload } = useAliUpload();
  const [loading, setLoading] = useState(false);

  const handleImgUpload = (event) => {
    const maxPhotos = 4;
    const totalPhotos = event.target.files.length + preview.length;
    const allowedExtensions = ["png", "jpg", "jpeg", "webp"];

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
    setImgUpload([...imgUpload, ...filesAccepted]);
    event.target.value = null;
  };

  const onRemoveImg = (index) => {
    setPreview(preview.filter((_, i) => i !== index));
    setImgUpload(imgUpload.filter((_, i) => i !== index));
  };
  const feedbackValidation = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email()
      .matches(/@[^.]*\./, `${i18next.t("feedbackPage.invalidYourEmail")}` || "")
      .required(`${i18next.t("feedbackPage.emailIsRequired")}`),
    phone: Yup.string()
      .trim()
      .min(9, `${i18next.t("feedbackPage.phoneNumberAtLeast10Numbers")}`)
      .required(`${i18next.t("feedbackPage.phoneNumberIsRequired")}`),
    subject: Yup.string().trim().required(`${i18next.t("feedbackPage.subjectIsRequired")}`),
    description: Yup.string()
      .trim()
      .required(`${i18next.t("feedbackPage.leaveYourFeedbackBelowIsRequired")}`),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      phone: "",
      subject: "",
      description: "",
      images: null,
    },
    validationSchema: feedbackValidation,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        let images;
        if (imgUpload.length !== 0) {
          const uploadedImages = await onAliUpload(
            imgUpload,
            "feedbackImage",
            `feedback-image-`
          );

          if (uploadedImages) {
            images = uploadedImages.map((image) => image.url);
          } else {
            throw new Error("");
          }
        }

        const response = await userService.createFeedback({
          title: values.subject,
          phoneNumber: values.phone,
          email: values.email,
          feedback: values.description,
          images,
        });

        if (response.success) {
          formik.resetForm();
          setPreview([]);
          setImgUpload([]);
          Swal.fire({
            color: theme.color,
            title: `${i18next.t("feedbackPage.sendFeedbackSuccessfull")}`,
            text: `${i18next.t("feedbackPage.createdFeedbackSuccessfully")}`,
            icon: "success",
            background: theme.tweetHov,
          });
        } else {
          Swal.fire({
            color: theme.color,
            title: `${i18next.t("feedbackPage.sendFeedbackFailed")}`,
            text: `${i18next.t("feedbackPage.createFeedbackFailed")}`,
            icon: "error",
            background: theme.tweetHov,
          });
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    },
  });

  const isDisable = useMemo(() => {
    return (
      formik.isSubmitting ||
      loading ||
      Object.values(formik.errors).length !== 0
    );
  }, [formik.errors, loading, formik.isSubmitting]);

  return (
    <React.Fragment>
      <BackgroundContent
        style={{
          minHeight: "100vh",
          overflow: "hidden",
          backgroundColor: "#18181B",
        }}
      >
        <Container>
          <div style={{ flex: 1, textAlign: "center" }}>
            <Link to="/">
              <img
                src={`${getStaticURL()}/assets/images/weknot_logo_c.svg`}
                alt="Weknot"
                width={150}
                height={150}
              />
            </Link>
          </div>
          <form onSubmit={formik.handleSubmit} className="feedback-form">
            <h1 style={{ color: "white", fontSize: "40px" }}>{i18next.t("feedbackPage.title")}</h1>
            <FormInput
              id="email"
              name="email"
              type="email"
              label={i18next.t("feedbackPage.email")}
              placeholder="abc@gmail.com"
              onChange={formik.handleChange}
              value={formik.values.email}
              isError={formik.touched.email && !!formik.errors.email}
              error={formik.errors.email}
            />
            <FormInput
              id="phone"
              name="phone"
              type="number"
              label={i18next.t("feedbackPage.phoneNumber")}
              placeholder={i18next.t("feedbackPage.phoneNumberPlaceholder")}
              onChange={formik.handleChange}
              value={formik.values.phone}
              isError={formik.touched.phone && !!formik.errors.phone}
              error={formik.errors.phone}
            />
            <FormInput
              id="subject"
              name="subject"
              type="text"
              label={i18next.t("feedbackPage.subject")}
              placeholder={i18next.t("feedbackPage.subjectPlaceholder")}
              onChange={formik.handleChange}
              value={formik.values.subject}
              isError={formik.touched.subject && !!formik.errors.subject}
              error={formik.errors.subject}
            />
            <FormAreaField
              id="description"
              name="description"
              label={i18next.t("feedbackPage.title")}
              onChange={formik.handleChange}
              value={formik.values.description}
              isError={
                formik.touched.description && !!formik.errors.description
              }
              error={formik.errors.description}
            />
            <div className="img-frame">
              {Array.from(Array(5).keys()).map((index) => {
                return (
                  <div
                    key={index}
                    className="img-item"
                    style={{ backgroundImage: `url(${preview[index]})` }}
                  >
                    {preview[index] && (
                      <img
                        className="close-icon"
                        src={`${getStaticURL()}/assets/images/close.svg`}
                        alt="menu"
                        width={20}
                        onClick={() => onRemoveImg(index)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="upload-img">
              <input
                id="imgUpload"
                name="images"
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImgUpload}
                onClick={(e) => (e.target.value = "")}
              />
              <label className="title" htmlFor="imgUpload">
                <UploadImgIcon />
                {i18next.t("feedbackPage.uploadImage")}
              </label>
            </div>
            <Button
              width="100%"
              padding="12px 30px"
              type="submit"
              disabled={isDisable}
              style={{
                borderRadius: "5px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                fontSize: "20px",
                height: "50px",
                backgroundColor: "transparent",
                gap: "10px",
                border: "1px solid",
              }}
            >
              {loading && <Loading />}
              {i18next.t("feedbackPage.sendFeedback")}
            </Button>
          </form>
        </Container>
      </BackgroundContent>
    </React.Fragment>
  );
};

export default Feedback;

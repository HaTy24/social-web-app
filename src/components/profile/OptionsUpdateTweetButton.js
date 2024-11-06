import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

import i18next from "i18next";
import Swal from "sweetalert2";
import { POLICY_OPTIONS } from "../../constants";
import { postService } from "../../services/PostService";
import { ClickOutside } from "../../utils/triggerClickOutside";
import { CheckIcon } from "../icons/CheckIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { PencilIcon } from "../icons/PencilIcon";
import { EditPost, EditPrivateModal, MenuOption } from "../styles/common";

export const OptionUpdateTweetButton = ({
  slug,
  policy,
  onDelete,
  onClickPolicy,
  isComment,
  isFeed,
}) => {
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalEditPivateOpen, setIsModalEditPivateOpen] = useState(false);
  const ref = useRef();

  const theme = useSelector((state) => state.theme);

  const handleToggleDeleteModal = () => {
    setIsModalDeleteOpen(!isModalDeleteOpen);
  };

  const handleDeleteMessage = async () => {
    const result = await Swal.fire({
      background: theme.tweetHov,
      title: `<h3 style='color:${theme.color}'>` + `${i18next.t("profile.areYouSure")}` + "</h3>",
      icon: "warning",
      color: theme.color,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `${i18next.t("profile.delete")}`,
      cancelButtonText: `${i18next.t("profile.cancel")}`,
      reverseButtons: true,
      focusCancel: true,
    });
    if (result.isConfirmed) {
      const response = await postService.deleteTweet(slug);
      if (response.success) {
        Swal.fire({
          color: theme.color,
          title: `${i18next.t("profile.deletePostSuccessful")}`,
          icon: "success",
          background: theme.tweetHov,
        });
        onDelete(slug);
      } else {
        Swal.fire({
          color: theme.color,
          title: `${i18next.t("profile.deletePostFailed")}`,
          text: `${i18next.t("profile.errorOccurredDeletion")}`,
          icon: "error",
          background: theme.tweetHov,
          confirmButtonColor: "#3085d6",
        });
      }
    }
  };

  ClickOutside(ref, () => {
    setIsModalDeleteOpen(false);
    setIsModalEditPivateOpen(false);
  });
  return (
    <div ref={ref}>
      <MenuOption
        onClick={(e) => {
          e.preventDefault();
          handleToggleDeleteModal();
        }}
        style={{ color: theme.color }}
      >
        ...
      </MenuOption>
      {isModalDeleteOpen && (
        <EditPost
          backgroundColor={theme.bg}
          boxShadow={theme.boxShadow}
          hover={theme.tweetHov}
        >
          {/* <div className="edit-item">
            <PencilIcon color={theme.color} />
            <span
              style={{ fontSize: "16px", color: theme.color, fontWeight: 700 }}
            >
              Edit post
            </span>
          </div> */}
          {(!isComment || !isFeed) && (
            <div
              className="edit-item"
              onClick={(e) => {
                e.preventDefault();
                setIsModalDeleteOpen(false);
                setIsModalEditPivateOpen(true);
              }}
            >
              <div
                style={{
                  width: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PencilIcon color={theme.color} />
              </div>
              <span
                style={{
                  fontSize: "16px",
                  color: theme.color,
                  fontWeight: 700,
                }}
              >
                {i18next.t("profile.editProfile")}
              </span>
            </div>
          )}
          <div
            className="edit-item"
            onClick={(e) => {
              e.preventDefault();
              handleDeleteMessage();
              setIsModalDeleteOpen(false);
            }}
          >
            <DeleteIcon width={24} heigth={24} color={theme.color} />
            <span
              style={{ fontSize: "16px", color: theme.color, fontWeight: 700 }}
            >
              {i18next.t("profile.delete")}
            </span>
          </div>
        </EditPost>
      )}
      {isModalEditPivateOpen && (
        <EditPrivateModal
          backgroundColor={theme.bg}
          boxShadow={theme.boxShadow}
          hover={theme.tweetHov}
        >
          <p className="content">
            {i18next.t("profile.policyTitle")}
          </p>
          {Object.entries(POLICY_OPTIONS)
            .map(([key, value]) => ({
              key,
              ...value,
            }))
            .map((item, index) => (
              <div
                key={index}
                style={{ display: "flex", justifyContent: "space-between" }}
                className="edit-item"
                onClick={(e) => {
                  e.preventDefault();
                  onClickPolicy(item.value);
                  setIsModalEditPivateOpen(false);
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {item.icon}
                  <span
                    style={{
                      fontSize: "16px",
                      color: theme.color,
                      fontWeight: 700,
                    }}
                  >
                    {i18next.t("tweet." + item.label)}
                  </span>
                </div>
                {(policy
                  ? policy === item.value
                  : item.value === POLICY_OPTIONS.PUBLIC_POLICY.value) && (
                    <CheckIcon />
                  )}
              </div>
            ))}
        </EditPrivateModal>
      )}
    </div>
  );
};

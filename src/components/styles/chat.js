import styled from "styled-components";

export const MessageContainner = styled.div`
  // min-height: 100vh;
  position: relative;
  .input-message {
    z-index: 10;
    padding: 10px 6px;
    @media (max-width: 767px) {
      position: sticky;
      bottom: 0;
      width: 100%;
    }
  }
  .conversation-header {
    z-index: 10;
    @media (max-width: 767px) {
      position: sticky;
      top: 0;
      width: 100%;
    }
  }
`;
export const ChatCorner = styled.div`
  border-left: ${(props) => `1px solid ${props.border}`};
  border-right: ${(props) => `1px solid ${props.border}`};
  height: 100%;
  .chat-box {
    height: 100%;
    width: 100vw;
    position: relative;

    @media (max-width: 767px) {
      position: fixed;
      top: 0;
      z-index: 20;
    }
  }
  .msg-list {
    height: calc(100vh - 175px);
    position: sticky;
    bottom: 60px;

    @media (max-width: 767px) {
      height: calc(100vh - 200px);
    }
`;
export const ChatInputContainer = styled.div`
  display: flex;
  // align-items: center;
  flex-direction: column;
  padding: 10px;
  border-top: 1px solid #ccc;
  transition: all 1s linear;
`;
export const ChatInputGroup = styled.div`
  border: ${(props) => `1px solid ${props.border}`};
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  // gap: 8px;
  div {
    // background-color: transparent !important;
    // color:${(props) => `${props.color} !important`};
  }
  .cs-message-input__content-editor-wrapper {
    background-color: transparent !important;
    padding-right: 0px !important;
    padding-left: 0 !important;
  }

  .cs-message-input__content-editor {
    background-color: transparent !important;
  }
  .cs-message-input__content-editor {
    background-color: transparent !important;
  }
`;
export const ChatInput = styled.textarea`
  background-color: transparent;
  color: ${(props) => `${props.color}`};
  border-radius: 3px;
  border: none;
  outline: none;
  width: 100%;
  resize: none;
  line-height: 1.2;
  white-space: pre-line;
  max-height: 240px; /* Tối đa 6 dòng */
  padding: 0;
  overflow-y: auto; /* Hiển thị thanh cuộn khi cần thiết */

  &::-webkit-scrollbar {
    width: 0;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
  }
`;
export const InputField = styled.div`
  flex: 1;
  border: 1px solid #ccc;
  outline: none;
  padding: 8px;
  font-size: 16px;
  border-radius: 20px;
  min-height: 40px;
  white-space: pre-wrap;
  line-height: 1;
  div {
    white-space: pre-wrap;
  }
`;

export const MessageInput2 = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
`;

export const EmojiButton = styled.button`
  font-size: 20px;
  cursor: pointer;
`;

export const EmojiPickerContainer = styled.div`
  position: absolute;
  bottom: calc(100% + 5px);
  // height: ${(props) => `${props.height}`};
  width: max-content;
  transform: scale(${(props) => `${props.scale}`});
  transform-origin: bottom left;
  transition: all 0.2s linear;
  z-index: 10000;
`;

export const MessageContent = styled.div`
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
  text-align: initial;
  display: block;
  unicode-bidi: plaintext;
  border-radius: 0.25rem;
  position: relative;
`;
export const MessageInfo = styled.div`
  position: relative;
  top: 12px;
  right: 6px;
  bottom: auto !important;
  float: right;
  line-height: 1.35;
  height: 20px;
  padding: 0 4px;
  margin-left: 8px;
  margin-right: -8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;
export const ReplyWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 1.125rem;
  margin-bottom: 0.0625rem;
  padding: 3px 6px 3px 3px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background-color: #c6e3fa;
  transition: background-color 0.2s ease-in;
  margin: 2px 0;
  margin-bottom: 4px;
  max-width: 100%;
  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    inset-inline-start: 0;
    width: 3px;
    background: #1da1f2;
  }
`;
export const ReplyContent = styled.div`
  overflow: hidden;
  margin-inline-start: 0.5rem;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ReplyTitle = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.25rem;
  color: var(--accent-color);
  unicode-bidi: plaintext;
  display: flex;
  width: 100%;
`;
export const ReplyText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  height: 1.125rem;
  margin-bottom: 0;
  width: 100%;
`;
export const UploadImageWrapper = styled.form`
  display: flex;

  .feedback-form {
    padding: 24px 120px 24px 0;
    flex: 3;
  }

  .img-frame {
    display: grid;
    grid-template-columns: auto auto auto auto auto;
    gap: 12px;
  }

  .img-item {
    width: 42px;
    height: 42px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: #e4e6eb;
    .img-preview {
      border-radius: 8px;
      width: 100%;
      height: 100%;
    }
    .close-icon {
      cursor: pointer;
      position: absolute;
      top: -10px;
      right: -10px;
      background-color: #fff;
      border-radius: 50%;
      background: #fff;
      padding: 2px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    }
  }

  .upload-img {
    display: flex;
    padding-bottom: 32px;

    input {
      display: none;
    }

    label {
      display: flex;
      gap: 8px;
    }
  }

  .title {
    font-size: 16px;
    color: #f1f5f9;
  }

  .btnSend {
    background-color: #888f9b;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    outline: none;
    border: none;
    border-radius: 8px;
    width: 100%;
    cursor: pointer;
  }

  // @media (max-width: 1024px) {
  //   .img-frame {
  //     grid-template-columns: auto auto auto;
  //   }

  //   .img-item {
  //     width: 120px;
  //     height: 120px;
  //   }
  // }

  // @media (max-width: 768px) {
  //   flex-direction: column;

  //   .feedback-form {
  //     padding: 24px 16px;
  //     flex: 3;
  //   }

  //   .img-item {
  //     width: 80px;
  //     height: 80px;
  //   }
  // }
`;
export const MessageImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 600px;
  width: 100%;
`;

export const MessageImageReplyContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-width: 600px;
  width: 100%;
`;

export const MessageImage = styled.img`
  width: calc(50% - 1px);
  object-fit: cover;
  border-radius: 4px;

  &.full-width {
    // display:none;
    width: 100%;
    margin-top: 2px;
  }
  &.max-h {
    aspect-ratio: 3/4;
  }
`;

export const MessageImageReply = styled.img`
  width: 32px;
  height: 32px;
  object-fit: fill;
  border-radius: 4px;

  &.full-width {
    // display:none;
    width: 20%;
    margin-top: 2px;
  }
  &.max-h {
    aspect-ratio: 3/4;
  }
`;

export const ImagePreviewOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ImagePreviewContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70vw;
  height: 70vh;
`;
export const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 100%;
  // object-fit: contain;
`;
export const ImagePreviewAction = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  top: 8px;
  right: 8px;
`;
export const ActionButton = styled.div`
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 24px;
  background: #ffffff14;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

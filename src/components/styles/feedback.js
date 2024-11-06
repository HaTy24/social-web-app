import styled from "styled-components";

export const Container = styled.form`
  display: flex;

  .feedback-form {
    padding: 24px 120px 24px 0;
    flex: 3;
  }

  .img-frame {
    display: grid;
    grid-template-columns: auto auto auto auto auto;
    gap: 24px;
    padding: 32px 8px;
  }

  .img-item {
    width: 160px;
    height: 160px;
    border: 1px dashed #94a3b8;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(${(props) => props.imgbg});
    background-size: cover;
    position: relative;

    .close-icon {
      cursor: pointer;
      position: absolute;
      top: -10px;
      right: -10px;
      background-color: #fff;
      border-radius: 50%;
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

  @media (max-width: 1024px) {
    .img-frame {
      grid-template-columns: auto auto auto;
    }

    .img-item {
      width: 120px;
      height: 120px;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;

    .feedback-form {
      padding: 24px 16px;
      flex: 3;
    }

    .img-item {
      width: 80px;
      height: 80px;
    }
  }
`;

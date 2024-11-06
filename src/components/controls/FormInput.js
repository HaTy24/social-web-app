import React from "react";
import { useSelector } from "react-redux";
import { Wrapper } from "../styles/control";

const FormInput = (props) => {
  const {
    isError,
    helper,
    label,
    error,
    className,
    displayInline,
    underLine,
    endIcon,
    ...rest
  } = props;
  const theme = useSelector((state) => state.theme);

  return (
    <Wrapper>
      {label && (
        <label
          className="title"
          htmlFor={rest.id}
          style={{ color: "white" }}
        >
          {label}
        </label>
      )}
      <input style={{ color: "white" }} className="input" {...rest} />
      {endIcon}
      {underLine && <div className="border-b border-lightCyan" />}
      {!isError && helper ? (
        <p>{helper}</p>
      ) : (
        <p className="error-message">{error}</p>
      )}
    </Wrapper>
  );
};

export default FormInput;

import React from "react";
import { Wrapper } from "../styles/control";

const FormAreaField = (props) => {
  const { isError, helper, label, error, className, underLine, ...rest } =
    props;
  return (
    <Wrapper>
      {label && (
        <label className="title" htmlFor={rest.id}>
          {label}
        </label>
      )}
      <textarea cols={50} rows={2} className="textarea" {...rest} />
      {underLine && <div className="border-b border-lightCyan" />}
      {!isError && helper ? (
        <p>{helper}</p>
      ) : (
        <p className="error-message">{error}</p>
      )}
    </Wrapper>
  );
};

export default FormAreaField;

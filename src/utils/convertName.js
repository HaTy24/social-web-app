import cuid from "cuid";

export const convertName = (formatFile, fileName) => {
  const extension = fileName.split(".").pop();
  const uuid = cuid();

  return formatFile + "-" + uuid + "." + extension;
};

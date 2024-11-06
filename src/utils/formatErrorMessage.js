export const formatErrorMessage = (errorMessage) => {
  const words = errorMessage
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  const formattedMessage = words.join(" ");
  return formattedMessage;
};

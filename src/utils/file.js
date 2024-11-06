export const blobToFile = (theBlob) =>
  new File([theBlob], `${new Date().getTime()}.png`, { type: "image/png" });

{
  /*eslint-disable @typescript-eslint/no-var-requires */
}
export const toPng = async (file) => {
  const heic2any = require('heic2any');
  // get image as blob url
  const blobURL = URL.createObjectURL(file);

  // convert "fetch" the new blob url
  const blobRes = await fetch(blobURL);

  // convert response to blob
  const blob = await blobRes.blob();

  // convert to PNG - response is blob
  const conversionResult = await heic2any({
    blob,
    toType: 'image/png',
    quality: 1,
  });

  return conversionResult;
};

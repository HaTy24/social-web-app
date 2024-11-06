export const capitalizeFirstWord = (inputString) => {
  const lowercase = String(inputString).toLowerCase();
  let words = lowercase.split(/[\s_]+/);

  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

  let resultString = words.join(" ");

  return resultString;
};

export const convertStringToCamelCase = (text) => {
  const words = text.split(' ').map((word, index) => {
    return index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1);
  });

  const camelCaseText = words.join('');
  return camelCaseText
}
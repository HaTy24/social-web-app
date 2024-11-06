export function filterString(input, target) {
  let j = 0;
  let result = "";

  for (let i = 0; i < input?.length; i++) {
    if (input[i] === target[j]) {
      result += input[i];
      j++;
    } else {
      break;
    }
    if (j === target?.length) {
      break;
    }
  }

  return result === target;
}

export function appendStringAtPosition(
  originalString,
  stringToAppend,
  position
) {
  const partBeforePosition = originalString.substring(0, position);
  const partAfterPosition = originalString.substring(position);

  const resultString = partBeforePosition + stringToAppend + partAfterPosition;

  return resultString;
}

export function removeSubstring(originalString, start, end) {
  const part1 = originalString.slice(0, start);
  const part2 = originalString.slice(end);
  return part1 + part2;
}

import { DateTime } from "luxon";
import { convertStringToCamelCase } from "./convertString";
import i18next from "i18next";

export const convertDate = (date) => {
  const base = DateTime.fromISO(date);
  const now = DateTime.now();
  const calcDate = now.diff(base, ["months", "years"]).toObject();
  if (base.year !== now.year) {
    return DateTime.fromISO(date).toFormat("dd-MM-yyyy");
  }
  if (calcDate.months > 1) {
    return DateTime.fromISO(date).toFormat("dd-MM");
  }
  return i18nForDateString(DateTime.fromISO(date).toRelative());
};

export const i18nForDateString = (str) => {
  const firstSpaceIndex = str.indexOf(' ');

  if (firstSpaceIndex == -1) {
    return str
  }

  const number = str.substring(0, firstSpaceIndex);

  const string = convertStringToCamelCase(str.substring(firstSpaceIndex + 1));

  if (number == 0) {
    return i18next.t("tweet." + string , { number: 1 });
  }

  return i18next.t("tweet." + string, { number: number });
}
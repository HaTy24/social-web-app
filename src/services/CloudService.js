import Swal from "sweetalert2";
import restConnector from "../axiosRestConnector";
import { convertName } from "../utils/convertName";
import { useSelector } from "react-redux";
import i18next from "i18next";
const OSS = require("ali-oss");

const isDev = process.env.NODE_ENV === "development";

export const useGetSessionToken = () => {
  const theme = useSelector((state) => state.theme);

  const getSessionToken = async () => {
    try {
      const { data } = await restConnector.get(`/uploads/session-token`);
      return data;
    } catch (error) {
      Swal.fire({
        color: theme.color,
        text: i18next.t("somethingWentWrong"),
        icon: "error",
        background: theme.tweetHov,
      });
      isDev &&
        console.log("🚀 ~ file: api.ts:24 ~ getSessionToken ~ error:", error);
    }
  };

  return { getSessionToken };
};

export const useGetTempUploadCredentials = () => {
  const { getSessionToken } = useGetSessionToken();
  const theme = useSelector((state) => state.theme);

  const getTempUploadCredentials = async () => {
    try {
      const sessionToken = await getSessionToken();
      if (sessionToken.success === "false") {
        throw new Error("No session token");
      }
      const { data } = await restConnector.get(
        `/uploads/temp-upload-credentials`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-session-token": sessionToken.data,
          },
        }
      );
      return data.data;
    } catch (error) {
      Swal.fire({
        color: theme.color,
        text: i18next.t("somethingWentWrong"),
        icon: "error",
        background: theme.tweetHov,
      });
      isDev &&
        console.log(
          "🚀 ~ file: api.ts:48 ~ getTempUploadCredentials ~ error:",
          error
        );
    }
  };

  return { getTempUploadCredentials };
};

export const useAliUpload = () => {
  const { getTempUploadCredentials } = useGetTempUploadCredentials();
  const theme = useSelector((state) => state.theme);

  const onAliUpload = async (fileImg, field, nameImg) => {
    try {
      const { AccessKeyId, AccessKeySecret, SecurityToken } =
        await getTempUploadCredentials();
      if (!AccessKeyId || !AccessKeySecret || !SecurityToken) {
        throw new Error("No credentials");
      }
      const client = new OSS({
        accessKeyId: AccessKeyId,
        accessKeySecret: AccessKeySecret,
        cname: true,
        endpoint: `${process.env.NEXT_PUBLIC_STATIC_ALI_OSS_DOMAIN}`,
        stsToken: SecurityToken,
        bucket: `${process.env.NEXT_PUBLIC_STATIC_ALI_OSS_BUCKET}`,
        region: `${process.env.NEXT_PUBLIC_STATIC_ALI_OSS_REGION}`,
      });

      if (Array.isArray(fileImg)) {
        const files = fileImg;
        const promises = files.map(async (file) => {
          const fileName = convertName(nameImg, file.name);
          const data = await client.put(fileName, file);
          return { ...data, field };
        });
        const result = await Promise.all(promises);
        return result;
      }
    } catch (error) {
      Swal.fire({
        color: theme.color,
        text: i18next.t("somethingWentWrong"),
        icon: "error",
        background: theme.tweetHov,
      });
      isDev && console.log("🚀 ~ file: api.ts:76 ~ aliUpload ~ error:", error);
    }
  };

  return { onAliUpload };
};

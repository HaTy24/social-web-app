import React from "react";
import { PublicIcon } from "../components/icons/PublicIcon";
import { PrivateIcon } from "../components/icons/PrivateIcon";

export const getStaticURL = () => process.env.REACT_APP_STATIC_URL;

export const getStaticScanUrl = () => process.env.REACT_APP_SCAN_URL;

export const checkEnableGoogleLogin = () => !!process.env.GOOGLE_CLIENT_ID;

export const INTERACTIONS = {
  LIKE: "like",
};

export const TWEET_TYPE = {
  TWEET: "tweet",
  RETWEET: "retweet",
  REPLY: "reply",
};

export const NOTIFICATION_TYPE = {
  SHARE_BOUGHT: "shares_bought",
  SHARE_SOLD: "shares_sold",
  FUNDS_TRANSFERRED: "funds_transferred",
  TOKEN_TRANSFERRED: "token_transferred",
  POST_REACT: "post_react",
  POST_SHARE: "post_share",
  POST_COMMENT: "post_comment",
  POST_REPLY: "post_reply",
  TAGGED_USER: "tagged_user",
};

export const CHAT_MESSAGE_TYPE = {
  SEND_MESSAGE: "send_message",
  REPLY_MESSAGE: "reply_message",
  ACK_MESSAGE_RECEIVED: "ack_message_received",
};

export const TRANSACTION_ACTIONS = {
  BUY_SHARES: "buy_shares",
  SELL_SHARES: "sell_shares",
};
export const TYPE_TRANSACTION = {
  BUY_SHARES: "buy_shares",
  SELL_SHARES: "sell_shares",
};

export const ICON_PATH = {
  commentPath: [
    "M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z",
  ],
  likePath: [
    "M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z",
  ],
  retweetPath: [
    "M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z",
  ],
  bookmarkPath: [
    "M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z",
    "M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z",
  ],
  buyPath: ["M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"],
  logout: [
    "M349.85,62.196c-10.797-4.717-23.373,0.212-28.09,11.009c-4.717,10.797,0.212,23.373,11.009,28.09c69.412,30.324,115.228,98.977,115.228,176.035c0,106.034-85.972,192-192,192c-106.042,0-192-85.958-192-192c0-77.041,45.8-145.694,115.192-176.038c10.795-4.72,15.72-17.298,10.999-28.093c-4.72-10.795-17.298-15.72-28.093-10.999C77.306,99.275,21.331,183.181,21.331,277.329c0,129.606,105.061,234.667,234.667,234.667c129.592,0,234.667-105.068,234.667-234.667C490.665,183.159,434.667,99.249,349.85,62.196z",
    "M255.989,234.667c11.782,0,21.333-9.551,21.333-21.333v-192C277.323,9.551,267.771,0,255.989,0c-11.782,0-21.333,9.551-21.333,21.333v192C234.656,225.115,244.207,234.667,255.989,234.667z",
  ],
  brand: [
    "M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z",
  ],
  holdMoneyPath: [
    "M312 24V34.5c6.4 1.2 12.6 2.7 18.2 4.2c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17c-10.9-2.9-21.1-4.9-30.2-5c-7.3-.1-14.7 1.7-19.4 4.4c-2.1 1.3-3.1 2.4-3.5 3c-.3 .5-.7 1.2-.7 2.8c0 .3 0 .5 0 .6c.2 .2 .9 1.2 3.3 2.6c5.8 3.5 14.4 6.2 27.4 10.1l.9 .3c11.1 3.3 25.9 7.8 37.9 15.3c13.7 8.6 26.1 22.9 26.4 44.9c.3 22.5-11.4 38.9-26.7 48.5c-6.7 4.1-13.9 7-21.3 8.8V232c0 13.3-10.7 24-24 24s-24-10.7-24-24V220.6c-9.5-2.3-18.2-5.3-25.6-7.8c-2.1-.7-4.1-1.4-6-2c-12.6-4.2-19.4-17.8-15.2-30.4s17.8-19.4 30.4-15.2c2.6 .9 5 1.7 7.3 2.5c13.6 4.6 23.4 7.9 33.9 8.3c8 .3 15.1-1.6 19.2-4.1c1.9-1.2 2.8-2.2 3.2-2.9c.4-.6 .9-1.8 .8-4.1l0-.2c0-1 0-2.1-4-4.6c-5.7-3.6-14.3-6.4-27.1-10.3l-1.9-.6c-10.8-3.2-25-7.5-36.4-14.4c-13.5-8.1-26.5-22-26.6-44.1c-.1-22.9 12.9-38.6 27.7-47.4c6.4-3.8 13.3-6.4 20.2-8.2V24c0-13.3 10.7-24 24-24s24 10.7 24 24zM568.2 336.3c13.1 17.8 9.3 42.8-8.5 55.9L433.1 485.5c-23.4 17.2-51.6 26.5-80.7 26.5H192 32c-17.7 0-32-14.3-32-32V416c0-17.7 14.3-32 32-32H68.8l44.9-36c22.7-18.2 50.9-28 80-28H272h16 64c17.7 0 32 14.3 32 32s-14.3 32-32 32H288 272c-8.8 0-16 7.2-16 16s7.2 16 16 16H392.6l119.7-88.2c17.8-13.1 42.8-9.3 55.9 8.5zM193.6 384l0 0-.9 0c.3 0 .6 0 .9 0z",
  ],
};

export const ERR_CODE = {
  USER_LOCKED: "user_locked",
  INVALID_PIN: "invalid_pin",
  CONFLICT: "CONFLICT",
};

export const IMAGE_TYPE = {
  AVATAR: "avatar",
  COVER: "cover",
};

export const LIST_TOKEN = [
  {
    name: "USDT",
    decimals: 18,
    symbol: "USDT",
    amount: "0",
    logoURI: `${getStaticURL()}/assets/images/usdt-icon.svg`,
  },
  {
    name: "USC",
    decimals: 18,
    symbol: "USC",
    amount: "0",
    logoURI: `${getStaticURL()}/assets/images/usc-icon.svg`,
  },
  {
    name: "XRP Token",
    decimals: 18,
    symbol: "XRP",
    amount: "0",
    logoURI:
      "https://assets.coingecko.com/coins/images/31167/thumb/ETYYcV7I_400x400.jpg?1696529995",
  },
  {
    name: "USDC",
    decimals: 18,
    symbol: "USDC",
    amount: "0",
    logoURI:
      "https://assets.coingecko.com/coins/images/6319/thumb/usdc.png?1696506694",
  },
  {
    name: "BUSD Token",
    decimals: 18,
    symbol: "BUSD",
    amount: "0",
    logoURI:
      "https://assets.coingecko.com/coins/images/9576/thumb/BUSDLOGO.jpg?1696509654",
  },
  {
    name: "Wrapped BNB",
    decimals: 18,
    symbol: "WBNB",
    amount: "0",
    logoURI:
      "https://assets.coingecko.com/coins/images/12591/thumb/binance-coin-logo.png?1696512401",
  },
  {
    name: "Hay Destablecoin",
    decimals: 18,
    symbol: "HAY",
    amount: "0",
    logoURI:
      "https://assets.coingecko.com/coins/images/26947/thumb/HAY.png?1696526002",
  },
];
export const GAME_WITHDRAW_STATUS = {
  SUBMITTED: "submitted",
  INPROGRESS: "inprogress",
  APPROVED: "approved",
  COMPLETED: "completed",
  REJECTED: "rejected",
  FAILED: "failed",
};
export const GAME_DEPOSIT_STATUS = {
  FAILED: "failed",
  SUBMITTED: "submitted",
  INPROGRESS: "inprogress",
  CREDITED: "credited",
  REJECTED: "rejected",
};

export const GAME_DEPOSIT_SORT_COLUMN = {
  OLDEST: "addon",
  AMOUNT: "amttoinvest",
  // STATUSID : 'statusid',
  LATEST: "actionedon",
};

export const GAME_DEPOSIT_SORT_SELECT = [
  {
    label: "OLDEST",
    value: GAME_DEPOSIT_SORT_COLUMN.OLDEST,
  },
  {
    label: "AMOUNT",
    value: GAME_DEPOSIT_SORT_COLUMN.AMOUNT,
  },
  {
    label: "LATEST",
    value: GAME_DEPOSIT_SORT_COLUMN.LATEST,
  },
];

export const GAME_WITHDRAW_SORT_COLUMN = {
  OLDEST: "wdon",
  AMOUNT: "wdamt",
  // STATUSID : 'statusid',
  LATEST: "actionedon",
};

export const GAME_WITHDRAW_SORT_SELECT = [
  {
    label: "OLDEST",
    value: GAME_WITHDRAW_SORT_COLUMN.OLDEST,
  },
  {
    label: "AMOUNT",
    value: GAME_WITHDRAW_SORT_COLUMN.AMOUNT,
  },
  {
    label: "LATEST",
    value: GAME_WITHDRAW_SORT_COLUMN.LATEST,
  },
];

export const EVENT_TRANSFER = {
  WALLET_ADDRESS: "wallet_address",
  ANOTHER_USER: "another_user",
};

export const WS_TOPIC = {
  SEND_MESSAGE: "send_message",
  REPLY_MESSAGE: "reply_message",
  READ_MESSAGE: "read_message",
  DELETE_MESSAGE: "delete_message",
  NOTIFICATION: "notification",
};

export const ACCOUNT_TYPE = {
  NORMAL: "normal",
  INVESTMENT: "investment",
};
export const POLICY_OPTIONS = {
  PUBLIC_POLICY: { icon: <PublicIcon />, label: "everyone", value: "PUBLIC" },
  PRIVATE_POLICY: {
    icon: <PrivateIcon />,
    label: "private",
    value: "PRIVATE",
  },
};
export const IMG_IS_NSFW = "img_is_nsfw";
export const LIST_POLICY = [
  {
    icon: <PublicIcon />,
    label: "Everyone",
    value: "PUBLIC",
  },
  {
    icon: <PrivateIcon />,
    label: "Private",
    value: "PRIVATE",
  },
];

export const MAX_SIZE_IMAGE = 5 * 1024 * 1000;

export const TOKEN_IP_INFO = "296f12aacaa210";
export const COUNTRY_NOT_CONNECT_TWITTER = [""];

export const handleCheckMsgError = (msg, msgDefault) => {
  switch (msg) {
    case "email already registered":
      return "emailAlreadyRegistered";
    case "username already registered":
      return "usernameAlreadyRegistered";
    case "user not found":
      return "userNotFound";
    case "invalid login method":
      return "invalidLoginMethod";
    case "user not verified email":
      return "userNotVerifiedEmail";
    case "password incorrect":
      return "passwordIncorrect";
    case "Invalid token or expired":
      return "invalidTokenOrExpired";
    case "invalid social type":
      return "invalidSocialType";
    case "user verified email":
      return "userVerifiedEmail";
    case "email type not supported":
      return "emailTypeNotSupported";
    case "too many request":
      return "tooManyRequests";
    case "referenceid already used":
      return "referenceIdAlreadyUsed"
    case "referenceid is not valid":
      return "referenceIdInvalid"
    default:
      return msgDefault;
  }
};

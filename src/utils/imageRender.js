export const imageRender = (media) => {
  if (typeof media === "string") {
    return media;
  } else {
    if (media.large || media.medium || media.small) {
      const checkIsTweetDetail = window.location.pathname.includes("tweet");
      const checkIsMobile = window.matchMedia("(max-width: 768px)").matches;

      if (checkIsTweetDetail) {
        if (checkIsMobile) {
          return media.medium;
        } else {
          return media.large;
        }
      } else {
        if (checkIsMobile) {
          return media.small;
        } else {
          return media.medium;
        }
      }
    }
    return media.original;
  }
};

import restConnector from "../axiosRestConnector";

const AUTHORIZATION_HEADER = "Authorization";
export const ACCESS_TOKEN = "jwt";

class AuthService {
  async googleLogin(credential) {
    const randomString = Math.random().toString(36).substring(2);
    const { data } = await restConnector.post("/auth/google/login", {
      credential,
      g_csrf_token: randomString,
    });

    return data;
  }

  async linkTwitter(oauthToken, oauthVerifier) {
    const { data } = await restConnector.post("/profile/link/twitter", {
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier,
    });

    return data;
  }

  async twitterGetLoginUrl() {
    const { data } = await restConnector.get("/auth/twitter/get-login-url");
    return data;
  }

  async twitterLogin(oauthToken, oauthVerifier) {
    const { data } = await restConnector.post("/auth/twitter/login", {
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier,
    });
    return data;
  }

  async updateProfile(payload) {
    const { data } = await restConnector.patch("/profile", payload);
    return data;
  }

  async updateProfileEmail(payload) {
    const { data } = await restConnector.patch("/profile/email", payload);
    return data;
  }

  async getProfile() {
    const { data } = await restConnector.get("/profile");
    return data;
  }

  async updateAvatar(payload) {
    const { data } = await restConnector.patch("/profile/profile-image-url", {
      profile_image_url: payload,
    });
    return data;
  }

  async updateBanner(payload) {
    const { data } = await restConnector.patch("/profile/profile-banner-url", {
      profile_banner_url: payload,
    });
    return data;
  }

  async getUserInfo(userId) {
    const { data } = await restConnector.get(`/users/${userId}/info`);
    return data;
  }

  async getUserInfoByUserName(userName) {
    const { data } = await restConnector.get(`/users/${userName}/detail`);
    return data;
  }

  setAccessToken(token) {
    localStorage.setItem(ACCESS_TOKEN, token);
  }

  loadAccessToken() {
    // On browser, load access token from local storage.
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    if (accessToken) {
      restConnector.defaults.headers[
        AUTHORIZATION_HEADER
      ] = `Bearer ${accessToken}`;
    }
    return accessToken;
  }

  logout() {
    localStorage.removeItem(ACCESS_TOKEN);
  }
  async createPin(payload) {
    const { data } = await restConnector.post(`/profile/pin`, payload);
    return data;
  }
  async changePin(payload) {
    const { data } = await restConnector.patch(`/profile/pin`, payload);
    return data;
  }
  async getPrivateKey(pin) {
    const { data } = await restConnector.post(`/profile/export-private-key`, {
      pin,
    });
    return data;
  }
  async loginWithEmail(payload) {
    const { data } = await restConnector.post(`/auth/email/login`, {
      ...payload,
    });
    return data;
  }
  async registerWithEmail(payload) {
    const { data } = await restConnector.post(`/auth/email/register`, {
      ...payload,
    });
    return data;
  }
  async reSendEmail(payload) {
    const { data } = await restConnector.post(`/auth/email/resend`, {
      ...payload,
    });
    return data;
  }
  async verifyEmail(payload) {
    const { data } = await restConnector.post(`/auth/verify-email`, {
      ...payload,
    });
    return data;
  }
  async forgotPassword(payload) {
    const { data } = await restConnector.post(`/auth/forgot-password`, {
      ...payload,
    });
    return data;
  }
  async resetPassword(payload) {
    const { data } = await restConnector.post(`/auth/set-password`, {
      ...payload,
    });
    return data;
  }
}

export const authService = new AuthService();

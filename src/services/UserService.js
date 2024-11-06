import restConnector from "../axiosRestConnector";

class UserService {
  async searchUser(keyword) {
    const { data } = await restConnector.get("/users/search", {
      params: { keyword },
    });
    return data;
  }
  async getTokens() {
    const { data } = await restConnector.get("/users/token-balance/common");
    return data;
  }
  async getBalanceOfToken(token) {
    const { data } = await restConnector.get(`/users/token-balance/${token}`);
    return data;
  }
  async referral(referral) {
    const { data } = await restConnector.patch("/profile/referral", {
      referral,
    });
    return data;
  }

  async getRelationships(id) {
    const { data } = await restConnector.get(`/users/${id}/relationship`);
    return data;
  }

  async getCompanyHistory(endDate) {
    const { data } = await restConnector.get(`/users/share-report`, {
      params: { endDate },
    });
    return data;
  }

  async assessRecaptchaToken(token, action) {
    const { data } = await restConnector.post(`/users/recaptcha-assessment`, {
      token,
      action,
    });
    return data;
  }
  async getTopProfiles(pagination) {
    const { data } = await restConnector.get("/users/top", {
      params: pagination,
    });
    return data;
  }
  async getInvestment(pagination) {
    const { data } = await restConnector.get("/users/investment", {
      params: pagination,
    });
    return data;
  }

  async createFeedback(payload) {
    const { data } = await restConnector.post(`/feedback`, payload);

    return data;
  }

  async getTagUserAvailable() {
    const { data } = await restConnector.get("/users/tag-users-available");

    return data;
  }
}

export const userService = new UserService();

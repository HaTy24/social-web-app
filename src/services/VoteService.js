import restConnector from "../axiosRestConnector";

class VoteService {
  async getTopVotes(pagination) {
    const { data } = await restConnector.get("/votes/top", {
      params: pagination,
    });
    return data;
  }

  async getVoteInfo(userId) {
    const { data } = await restConnector.get(`/users/${userId}/info`);
    return data;
  }

  async getVoteEarned(userId) {
    const { data } = await restConnector.get(`/users/${userId}/earned-fees`);
    return data;
  }

  async createVote(screenName) {
    const { data } = await restConnector.post("/votes/create", {
      screen_name: screenName,
    });
    return data;
  }

  async getTotalUnclaimed() {
    const { data } = await restConnector.get("/votes/total-unclaimed");
    return data;
  }
}

export const voteService = new VoteService();

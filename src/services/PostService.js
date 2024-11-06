import restConnector from "../axiosRestConnector";

class PostService {
  async postTweet(payload) {
    const { data } = await restConnector.post("/posts", payload);
    return data;
  }

  async postReply(slug, payload) {
    const { data } = await restConnector.post(
      `/posts/${slug}/comment`,
      payload
    );
    return data;
  }

  async getTweets(pagination, tag) {
    const { data } = await restConnector.get("/posts/recent", {
      params: { ...pagination, tag },
    });
    return data;
  }

  async getUserWall(userId, pagination) {
    const { data } = await restConnector.get(`/users/${userId}/posts`, {
      params: pagination,
    });
    return data;
  }

  async interaction(slug, action) {
    const { data } = await restConnector.post(`/posts/${slug}/interaction`, {
      action,
    });
    return data;
  }

  async undoInteraction(slug, action) {
    const { data } = await restConnector.post(
      `/posts/${slug}/interaction/undo`,
      {
        action,
      }
    );
    return data;
  }

  async retweet(slug) {
    const { data } = await restConnector.post(`/posts/${slug}/retweet`);
    return data;
  }

  async commentTweet(payload, slug) {
    const { data } = await restConnector.post(
      `/posts/${slug}/comment`,
      payload
    );
    return data;
  }

  async getTweetDetail(slug) {
    const { data } = await restConnector.get(`/posts/${slug}`);
    return data;
  }

  async getComments(slug, pagination) {
    const { data } = await restConnector.get(`/posts/${slug}/comments`, {
      params: pagination,
    });
    return data;
  }

  async deleteTweet(slug) {
    const { data } = await restConnector.delete(`/posts/${slug}`);
    return data;
  }

  async updatePolicy(slug, policy) {
    const { data } = await restConnector.patch(`/posts/${slug}/policy`, {
      policy,
    });
    return data;
  }
}

export const postService = new PostService();

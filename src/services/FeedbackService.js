import restConnector from "../axiosRestConnector";

class FeedbackService {
  async createFeedback(payload) {
    const { data } = await restConnector.post(`/feedback`, payload);

    return data;
  }
}

export const feedbackService = new FeedbackService();

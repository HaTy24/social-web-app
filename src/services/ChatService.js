import restConnector from "../axiosRestConnector";

class ChatService {
  async getListChat(pagination) {
    const { data } = await restConnector.get(`/chats`, {
      params: pagination,
    });
    return data;
  }

  async countMessageUnread() {
    const { data } = await restConnector.get("/chats/unread-messages");
    return data;
  }

  async getChat(chatId) {
    const { data } = await restConnector.get(`/chats/${chatId}/detail`);
    return data;
  }

  async getListMessage(chatId, pagination, position) {
    const { data } = await restConnector.get(`/chats/${chatId}/messages`, {
      params: {
        ...pagination,
        position,
      },
    });
    return data;
  }

  async readMessages(chatId) {
    const { data } = await restConnector.post(`/chats/${chatId}/messages/read`);
    return data;
  }

  async sendMessage(chatId, payload) {
    const { data } = await restConnector.post(
      `/chats/${chatId}/messages`,
      payload
    );
    return data;
  }

  async replyMessage(chatId, payload) {
    const { data } = await restConnector.post(
      `/chats/${chatId}/messages/reply`,
      payload
    );
    return data;
  }

  async deleteMessage(chatId, messageId) {
    const { data } = await restConnector.delete(
      `/chats/${chatId}/messages/delete`,
      {
        params: { messageId },
      }
    );
    return data;
  }
}

export const chatService = new ChatService();

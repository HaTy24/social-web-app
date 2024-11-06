import restConnector from "../axiosRestConnector";

class TransactionService {
  async buy(targetUserId, pinNumber, quantity) {
    const { data } = await restConnector.post(`/transactions/buy`, {
      targetUserId,
      pinNumber,
      quantity,
    });

    return data;
  }

  async sell(targetUserId, pinNumber, quantity) {
    const { data } = await restConnector.post(`/transactions/sell`, {
      targetUserId,
      pinNumber,
      quantity,
    });

    return data;
  }

  async transfer(amount, toAddress, pinNumber, token) {
    const { data } = await restConnector.post(`/transactions/transfer`, {
      amount,
      toAddress,
      pinNumber,
      token,
    });
    return data;
  }
  async transferToken(amount, toAddress, pinNumber, tokenAddress, token) {
    const { data } = await restConnector.post(`/transactions/token-transfer`, {
      amount,
      toAddress,
      pinNumber,
      tokenAddress,
      token,
    });
    return data;
  }

  async getRecentTrades(pagination) {
    const { data } = await restConnector.get(`/transactions/recent`, {
      params: pagination,
    });
    return data;
  }

  async getProfileTrades(pagination, type) {
    const { data } = await restConnector.get(`/profile/trades`, {
      params: {
        ...pagination,
        type,
      },
    });
    return data;
  }

  async getWhoToBuy(pagination) {
    const { data } = await restConnector.get("/users/suggestions", {
      params: pagination,
    });
    return data;
  }
}

export const transactionService = new TransactionService();

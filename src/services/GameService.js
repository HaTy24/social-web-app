import restConnector from "../axiosRestConnector";
import {
  GAME_DEPOSIT_SORT_COLUMN,
  GAME_WITHDRAW_SORT_COLUMN,
} from "../constants";

export const GAME_ACCESS_TOKEN = "game-jwt";

class GameService {
  async loginOrCreate() {
    const { data } = await restConnector.post("/games/login-or-create");
    return data;
  }

  async createSessionResult(gameId) {
    const { data } = await restConnector.post(
      `/games/create-session/${gameId}`
    );
    return data;
  }

  async deposit(payload) {
    const { data } = await restConnector.post(`/games/deposit`, payload);
    return data;
  }
  async depositHistory(pagination, sort = GAME_DEPOSIT_SORT_COLUMN.OLDEST) {
    const { data } = await restConnector.get("/games/deposit-history", {
      params: { ...pagination, sort },
    });
    return data;
  }

  async withdraw(payload) {
    const { data } = await restConnector.post(`/games/withdraw`, payload);
    return data;
  }
  async withdrawHistory(pagination, sort = GAME_WITHDRAW_SORT_COLUMN.OLDEST) {
    const { data } = await restConnector.get(`/games/withdraw-history`, {
      params: { ...pagination, sort },
    });
    return data;
  }
  async getGameBalance(gameId) {
    const { data } = await restConnector.get(`/games/${gameId}/balance`);
    return data;
  }
  setGameAccessToken(token) {
    localStorage.setItem(GAME_ACCESS_TOKEN, token);
  }

  loadGameAccessToken() {
    // On browser, load access token from local storage.
    const accessToken = localStorage.getItem(GAME_ACCESS_TOKEN);

    return accessToken;
  }
}

export const gameService = new GameService();

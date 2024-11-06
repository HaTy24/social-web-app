import axios from "axios";
import { TOKEN_IP_INFO } from "../constants";

class GeolocationService {
  async getLocation() {
    const ipResponse = await axios.get("https://api64.ipify.org?format=json");
    const userIp = ipResponse.data.ip;

    const locationResponse = await axios.get(
      `https://ipinfo.io/${userIp}/json?token=${TOKEN_IP_INFO}`
    );
    const locationData = locationResponse.data;

    return locationData;
  }
}

export const geolocationService = new GeolocationService();

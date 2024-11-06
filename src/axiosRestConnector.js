import axios from "axios";

const restConnector = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

export default restConnector;

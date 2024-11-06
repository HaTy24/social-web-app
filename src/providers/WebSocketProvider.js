import React, { createContext, useState } from "react";
import { io } from "socket.io-client";

const defaultCtxVal = {
  webSocket: null,
  register: (accessToken) => {},
};

export const WebSocketCtx = createContext(defaultCtxVal);

export const WebSocketProvider = ({ children }) => {
  const [webSocket, setWebSocket] = useState();
  const URL = process.env.SOCKET_URL;

  const register = async (accessToken) => {
    setWebSocket(
      io(URL, {
        transports: ["websocket"],
        path: "/ws",
        auth: {
          authorization: `Bearer ${accessToken}`,
        },
      })
    );
  };

  return (
    <WebSocketCtx.Provider
      value={{
        webSocket,
        register,
      }}
    >
      {children}
    </WebSocketCtx.Provider>
  );
};

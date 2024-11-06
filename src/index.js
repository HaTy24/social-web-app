import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import redux from "./redux/store";
import App from "./App";
import { WebSocketProvider } from "./providers/WebSocketProvider";
import { ErrorBoundary } from "react-error-boundary";

ReactDOM.render(
  <ErrorBoundary FallbackComponent={Fallback}>
    <Provider store={redux.store}>
      <PersistGate loading={null} persistor={redux.persistor}>
        <WebSocketProvider>
          <App />
        </WebSocketProvider>
      </PersistGate>
    </Provider>
  </ErrorBoundary>,
  document.getElementById("root")
);

function Fallback({ resetErrorBoundary }) {
  useEffect(() => {
    // setTimeout(() => {
    //   window.location.reload();
    //   resetErrorBoundary();
    // }, 1000);
  }, []);

  return <div />;
}

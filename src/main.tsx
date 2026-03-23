import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.scss";
import TrpcProvider from "./providers/TrpcProvider";
import AppErrorBoundary from "./components/AppErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <TrpcProvider>
        <App />
      </TrpcProvider>
    </AppErrorBoundary>
  </React.StrictMode>,
);
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "@/app.css";

import { App } from "@/app";
import { store } from "@/store/index";

const ERROR_MESSAGE = "Root element not found";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(ERROR_MESSAGE);
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);

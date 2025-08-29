import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { AppProviders } from "./context/Context";
import { LogProviders } from "./context/LogContext";
import "./styles/app.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AppProviders>
      <LogProviders>
        <App />
      </LogProviders>
    </AppProviders>
  </StrictMode>
);

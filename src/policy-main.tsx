import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PolicyPage from "./PolicyPage";
import { LocaleProvider } from "./i18n";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaleProvider>
      <PolicyPage />
    </LocaleProvider>
  </StrictMode>,
);

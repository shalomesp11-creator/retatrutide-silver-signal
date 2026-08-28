import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CheckoutPage from "./CheckoutPage";
import { LocaleProvider } from "./i18n";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaleProvider>
      <CheckoutPage />
    </LocaleProvider>
  </StrictMode>,
);

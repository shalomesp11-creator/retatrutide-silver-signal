import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PolicyPage from "./PolicyPage";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PolicyPage />
  </StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./design-system/tokens/tokens.css";
import "./styles.css";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    const baseUrl = import.meta.env.BASE_URL;
    void navigator.serviceWorker.register(`${baseUrl}sw.js`, { scope: baseUrl });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><App /></StrictMode>
);

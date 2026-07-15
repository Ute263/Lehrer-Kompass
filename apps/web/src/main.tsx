import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DesignSystemPage } from "./prototype/DesignSystemPage";
import "./design-system/tokens/tokens.css";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode><DesignSystemPage /></StrictMode>
);

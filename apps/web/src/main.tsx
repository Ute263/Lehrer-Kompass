import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./design-system/tokens/tokens.css";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("LehrerKompass konnte das Wurzelelement nicht finden.");
}

function showStartupError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  rootElement.innerHTML = `
    <main style="max-width:760px;margin:64px auto;padding:32px;font-family:system-ui,sans-serif;color:#173042">
      <h1 style="font-size:32px;margin-bottom:16px">LehrerKompass konnte nicht gestartet werden</h1>
      <p style="font-size:18px;line-height:1.6">Die Seite ist erreichbar, aber beim Laden der App ist ein Fehler aufgetreten.</p>
      <pre style="white-space:pre-wrap;background:#f3f6f5;border:1px solid #d8e2df;border-radius:12px;padding:16px;margin-top:24px">${message.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ?? character)}</pre>
      <p style="margin-top:24px">Bitte diese Fehlermeldung als Screenshot weitergeben.</p>
    </main>`;
}

async function clearCloudflareLegacyCaches() {
  if (!window.location.hostname.endsWith("pages.dev")) return;

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.filter((name) => name.startsWith("lehrerkompass-app-")).map((name) => caches.delete(name)));
  }
}

async function startApp() {
  await clearCloudflareLegacyCaches();
  const { App } = await import("./app/App");

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  if ("serviceWorker" in navigator && import.meta.env.PROD && !window.location.hostname.endsWith("pages.dev")) {
    window.addEventListener("load", () => {
      const baseUrl = import.meta.env.BASE_URL;
      void navigator.serviceWorker.register(`${baseUrl}sw.js`, { scope: baseUrl });
    });
  }
}

void startApp().catch(showStartupError);

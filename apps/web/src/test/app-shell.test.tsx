// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "../app/App";
import { AppRoutes } from "../app/router";
import { NAVIGATION_STORAGE_KEY, readNavigationCollapsed } from "../app/storage";

function renderAt(path: string) { return render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>); }

beforeEach(() => { localStorage.clear(); window.history.replaceState({}, "", "/"); });

describe("Routing und AppShell", () => {
  it("leitet / auf /werkbank weiter", async () => { renderAt("/"); expect(await screen.findByRole("heading", { name: "Werkbank" })).toBeInTheDocument(); });

  it.each([
    ["/werkbank", "Werkbank"], ["/klassen", "Klassen"], ["/stundenplan", "Stundenplan"], ["/bibliothek", "Bibliothek"],
    ["/foerderunterricht", "Förderunterricht"], ["/schule-grundlagen", "Schule und Grundlagen"], ["/einstellungen", "Einstellungen"]
  ])("rendert %s als neutrale Seite", (path, title) => { renderAt(path); expect(screen.getByRole("heading", { name: title })).toBeInTheDocument(); expect(screen.getByText("Noch keine Fachfunktion aktiv.")).toBeInTheDocument(); });

  it("markiert die aktive Navigation semantisch", () => { renderAt("/klassen"); expect(screen.getByRole("link", { name: "Klassen" })).toHaveAttribute("aria-current", "page"); });

  it("enthält Navigation, TopBar, Main und genau sieben Hauptlinks", () => { renderAt("/werkbank"); expect(screen.getByRole("navigation", { name: "Hauptnavigation" })).toBeInTheDocument(); expect(document.querySelector(".application-topbar")).toHaveAttribute("class", "application-topbar"); expect(screen.getByRole("main")).toBeInTheDocument(); expect(screen.getByRole("navigation", { name: "Hauptnavigation" }).querySelectorAll("a")).toHaveLength(7); });

  it("klappt die Navigation ein und speichert den Zustand", async () => { const user = userEvent.setup(); renderAt("/werkbank"); await user.click(screen.getByRole("button", { name: "Navigation einklappen" })); expect(localStorage.getItem(NAVIGATION_STORAGE_KEY)).toBe("true"); expect(document.querySelector(".application-frame")).toHaveClass("application-frame--collapsed"); });

  it("stellt gespeicherten Zustand wieder her und ignoriert ungültige Werte", () => { localStorage.setItem(NAVIGATION_STORAGE_KEY, "true"); const first = renderAt("/werkbank"); expect(document.querySelector(".application-frame")).toHaveClass("application-frame--collapsed"); first.unmount(); localStorage.setItem(NAVIGATION_STORAGE_KEY, "kaputt"); expect(readNavigationCollapsed()).toBe(false); });

  it("öffnet Buddy und ersetzt ihn durch den Bibliotheks-Drawer", async () => { const user = userEvent.setup(); renderAt("/werkbank"); await user.click(screen.getByRole("button", { name: "Buddy" })); expect(screen.getByRole("dialog", { name: "Buddy" })).toBeInTheDocument(); fireEvent.click(screen.getByRole("button", { name: "Bibliothek" })); expect(screen.queryByRole("dialog", { name: "Buddy" })).not.toBeInTheDocument(); expect(screen.getByRole("dialog", { name: "Bibliothek" })).toBeInTheDocument(); expect(screen.getAllByRole("dialog")).toHaveLength(1); });

  it("schließt den Drawer mit Escape und gibt Fokus zurück", async () => { const user = userEvent.setup(); renderAt("/werkbank"); const trigger = screen.getByRole("button", { name: "Buddy" }); await user.click(trigger); expect(screen.getByRole("button", { name: "Seitenbereich schließen" })).toHaveFocus(); await user.keyboard("{Escape}"); expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); expect(trigger).toHaveFocus(); });

  it("fokussiert über den Skip-Link den Hauptinhalt", async () => { const user = userEvent.setup(); renderAt("/werkbank"); const skip = screen.getByRole("link", { name: "Zum Hauptinhalt" }); skip.focus(); await user.keyboard("{Enter}"); expect(screen.getByRole("main")).toHaveFocus(); });

  it("öffnet die mobile Navigation per Tastatur und schließt sie mit Fokusrückgabe", async () => { const user = userEvent.setup(); renderAt("/werkbank"); const trigger = screen.getByRole("button", { name: "Mobile Navigation öffnen" }); trigger.focus(); await user.keyboard("{Enter}"); expect(screen.getByRole("complementary", { name: "Mobile Hauptnavigation" })).toBeInTheDocument(); expect(screen.getByRole("button", { name: "Mobile Navigation schließen" })).toHaveFocus(); await user.keyboard("{Escape}"); expect(screen.queryByRole("complementary", { name: "Mobile Hauptnavigation" })).not.toBeInTheDocument(); expect(trigger).toHaveFocus(); });

  it("zeigt für unbekannte Routen die Nicht-gefunden-Seite", () => { renderAt("/gibt-es-nicht"); expect(screen.getByRole("heading", { name: "Diese Seite wurde nicht gefunden." })).toBeInTheDocument(); expect(screen.getByRole("button", { name: "Zur Werkbank" })).toBeInTheDocument(); });

  it("unterstützt Browsernavigation zurück", async () => { window.history.replaceState({}, "", "/werkbank"); const user = userEvent.setup(); render(<App />); await user.click(screen.getByRole("link", { name: "Klassen" })); expect(await screen.findByRole("heading", { name: "Klassen" })).toBeInTheDocument(); window.history.back(); await waitFor(() => expect(screen.getByRole("heading", { name: "Werkbank" })).toBeInTheDocument()); });
});

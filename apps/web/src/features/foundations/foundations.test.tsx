// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../../app/router";

const STORAGE_KEY = "lehrerkompass-foundations-v1";
const renderPage = () => render(<MemoryRouter initialEntries={["/schule-grundlagen"]}><AppRoutes /></MemoryRouter>);

beforeEach(() => localStorage.clear());

describe("Schule und Grundlagen", () => {
  it("zeigt Lehrwerke und Filter", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Schule und Grundlagen" })).toBeInTheDocument();
    expect(screen.getByText("ABC der Tiere 2")).toBeInTheDocument();
    expect(screen.getByText("MiniMax 2")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Nach Art filtern" })).toBeInTheDocument();
  });

  it("legt eine Grundlage an und speichert sie lokal", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Grundlage hinzufügen/ }));
    await user.type(screen.getByLabelText("Titel"), "Arbeitsplan Deutsch 2");
    await user.type(screen.getByLabelText("Fach oder Bereich"), "Deutsch");
    await user.type(screen.getByLabelText("Jahrgang"), "Klasse 2");
    await user.selectOptions(screen.getByLabelText("Art"), "curriculum");
    await user.click(screen.getByRole("button", { name: "Grundlage speichern" }));
    expect(screen.getByText("Arbeitsplan Deutsch 2")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]").some((item: { title: string }) => item.title === "Arbeitsplan Deutsch 2")).toBe(true);
  });

  it("sucht und markiert Favoriten", async () => {
    const user = userEvent.setup();
    renderPage();
    const search = screen.getByPlaceholderText("Lehrwerk, Fach oder Stichwort suchen …");
    await user.type(search, "MiniMax");
    expect(screen.getByText("MiniMax 2")).toBeInTheDocument();
    expect(screen.queryByText("ABC der Tiere 2")).not.toBeInTheDocument();
    await user.click(screen.getByText("MiniMax 2"));
    await user.click(screen.getByRole("button", { name: "Zu Favoriten hinzufügen" }));
    expect(screen.getByRole("button", { name: "Aus Favoriten entfernen" })).toBeInTheDocument();
  });
});

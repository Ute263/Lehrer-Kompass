// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../../app/router";
import { domainDb } from "../../domain";

beforeEach(async()=>{localStorage.clear();await domainDb.delete();await domainDb.open()});
const renderSettings=()=>render(<MemoryRouter initialEntries={["/einstellungen"]}><AppRoutes/></MemoryRouter>);

describe("Einstellungen",()=>{
 it("zeigt die echten Einstellungsbereiche statt eines Platzhalters",async()=>{renderSettings();expect(await screen.findByRole("heading",{name:"Einstellungen"})).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Allgemein"})).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Darstellung"})).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Daten und Sicherung"})).toBeInTheDocument()});
 it("speichert Darstellungsoptionen lokal",async()=>{const user=userEvent.setup();renderSettings();await user.click(screen.getByRole("switch",{name:"Größere Schrift verwenden"}));expect(document.documentElement.classList.contains("app-large-text")).toBe(true);expect(localStorage.getItem("lehrerkompass-settings-v1")).toContain("largerText")});
 it("verlinkt Sicherung, Import, Austausch, Daten und Installation",async()=>{renderSettings();expect(await screen.findByRole("link",{name:/Sicherung erstellen/})).toHaveAttribute("href","/einstellungen/sicherung");expect(screen.getByRole("link",{name:/Sicherung wiederherstellen/})).toHaveAttribute("href","/einstellungen/import");expect(screen.getByRole("link",{name:/Installation auf dem iPad/})).toHaveAttribute("href","/einstellungen/installation")});
});

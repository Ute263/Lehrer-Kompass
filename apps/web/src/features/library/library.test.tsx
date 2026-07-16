// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../../app/router";
import { domainDb } from "../../domain";

beforeEach(async()=>{localStorage.clear();await domainDb.delete();await domainDb.open()});
const at=()=>render(<MemoryRouter initialEntries={["/bibliothek"]}><AppRoutes/></MemoryRouter>);

describe("Lehrerbibliothek",()=>{
  it("zeigt Reihen, Stunden und Materialien gemeinsam",async()=>{at();expect(await screen.findByRole("heading",{name:"Bibliothek"})).toBeInTheDocument();expect(await screen.findByText("Nomen entdecken")).toBeInTheDocument();expect(screen.getByText("Nomen mit Artikeln erkennen")).toBeInTheDocument();expect(screen.getAllByText("Unterrichtsreihe").length).toBeGreaterThan(0);expect(screen.getAllByText("Unterrichtsstunde").length).toBeGreaterThan(0);expect(screen.getAllByText("Material").length).toBeGreaterThan(0)});
  it("durchsucht Titel und pädagogischen Kontext",async()=>{const user=userEvent.setup();at();const search=await screen.findByRole("textbox",{name:"Bibliothek durchsuchen"});await user.type(search,"Artikel");expect(screen.getByText("Nomen mit Artikeln erkennen")).toBeInTheDocument()});
  it("filtert nach Inhaltstyp",async()=>{const user=userEvent.setup();at();await screen.findByText("Nomen entdecken");await user.selectOptions(screen.getByRole("combobox",{name:"Inhaltstyp"}),"material");expect(screen.getByText("Nomen mit Artikeln erkennen")).toBeInTheDocument();expect(screen.queryByText("Nomen entdecken")).not.toBeInTheDocument()});
  it("speichert Favoriten lokal",async()=>{const user=userEvent.setup();at();await screen.findByText("Nomen mit Artikeln erkennen");const buttons=screen.getAllByRole("button",{name:"Zu Favoriten hinzufügen"});await user.click(buttons[0]!);expect(localStorage.getItem("lehrerkompass-library-favourites")).toContain(":")});
});

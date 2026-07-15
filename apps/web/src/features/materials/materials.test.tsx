// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../../app/router";
import { domainDb } from "../../domain";

beforeEach(async () => { localStorage.clear(); await domainDb.delete(); await domainDb.open(); });
const at = (path: string) => render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>);

describe("Materialwerkstatt", () => {
  it("öffnet die echte Werkstatt mit strukturierter Seite", async () => {
    at("/materialien/material-nomen-standard");
    expect((await screen.findAllByRole("heading", { name: "Nomen mit Artikeln erkennen" })).length).toBeGreaterThan(0);
    expect(screen.getByText(/Drucknahe Arbeitsansicht/)).toBeInTheDocument();
    expect(screen.getByText(/Sicherer Bildplatzhalter/)).toBeInTheDocument();
  });
  it("öffnet die Vorschau und schaltet Schwarz-Weiß", async () => {
    const user = userEvent.setup(); at("/materialien/material-nomen-standard/vorschau");
    await screen.findByRole("heading", { name: "Drucknahe Vorschau" });
    await user.click(screen.getByRole("checkbox", { name: "Schwarz-Weiß-Vorschau" }));
    expect(document.querySelector(".a4-page--bw")).toBeTruthy();
  });
  it("zeigt die Materialfamilie", async () => {
    at("/materialien/material-nomen-standard/varianten");
    expect((await screen.findAllByRole("heading", { name: "Nomen mit Artikeln erkennen" })).length).toBeGreaterThan(0);
    expect(screen.getByText(/Zusammengehörige Fassungen/)).toBeInTheDocument();
  });
  it("legt Material aus einer Stunde mit Kontext an", async () => {
    at("/materialien/neu?lessonId=lesson-nomen-1");
    expect(await screen.findByRole("heading", { name: "Material aus Unterrichtsstunde anlegen" })).toBeInTheDocument();
    expect(screen.getByText(/Klasse, Fach, Thema, Reihe und Stunde/)).toBeInTheDocument();
  });
  it("legt Material auch eigenständig an", async () => {
    at("/materialien/neu");
    expect(await screen.findByRole("heading", { name: "Eigenständiges Material anlegen" })).toBeInTheDocument();
    expect(screen.getByText(/ohne Pflichtkontext/)).toBeInTheDocument();
  });
  it("öffnet Blockauswahl", async () => {
    const user = userEvent.setup(); at("/materialien/material-nomen-standard");
    await user.click(await screen.findByRole("button", { name: "Block hinzufügen" }));
    expect(screen.getByRole("dialog", { name: "Block hinzufügen" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rechenraster" })).toBeInTheDocument();
  });
  it("öffnet Variantendialog mit Kopierhinweis", async () => {
    const user = userEvent.setup(); at("/materialien/material-nomen-standard");
    await user.click(await screen.findByRole("button", { name: "Variante erstellen" }));
    expect(screen.getByText(/Original bleibt unverändert/)).toBeInTheDocument();
  });
  it("zeigt ungültigen Materialverweis ruhig", async () => {
    at("/materialien/unbekannt");
    expect(await screen.findByRole("heading", { name: "Material nicht gefunden" })).toBeInTheDocument();
  });
});

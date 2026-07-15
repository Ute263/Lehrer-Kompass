// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Breadcrumbs, Button, Checkbox, PlanningSection, SyncIndicator, TextField } from "../design-system/components";

describe("Designsystem-Komponenten", () => {
  it("rendert Buttonvarianten mit stabilen Klassen und Attributen", () => {
    render(<><Button variant="secondary">Weiter</Button><Button loading>Lädt</Button></>);
    expect(screen.getByRole("button", { name: "Weiter" })).toHaveClass("button--secondary");
    expect(screen.getByRole("button", { name: "Lädt" })).toHaveAttribute("aria-busy", "true");
  });

  it("löst Buttons per Tastatur aus und unterbindet Aktionen bei disabled", async () => {
    const user = userEvent.setup(); const active = vi.fn(); const disabled = vi.fn();
    render(<><Button onClick={active}>Aktiv</Button><Button disabled onClick={disabled}>Gesperrt</Button></>);
    screen.getByRole("button", { name: "Aktiv" }).focus(); await user.keyboard("{Enter}");
    await user.click(screen.getByRole("button", { name: "Gesperrt" }));
    expect(active).toHaveBeenCalledOnce(); expect(disabled).not.toHaveBeenCalled();
  });

  it("verknüpft Feldbeschriftungen und Fehlertexte semantisch", () => {
    render(<><TextField id="subject" label="Thema" error="Bitte ergänzen" /><Checkbox id="material" label="Materialliste anzeigen" /></>);
    expect(screen.getByLabelText("Thema")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Thema")).toHaveAccessibleDescription("Bitte ergänzen");
    expect(screen.getByLabelText("Materialliste anzeigen")).toHaveAttribute("type", "checkbox");
  });

  it("öffnet einen Planungsabschnitt tastaturbedienbar", async () => {
    const user = userEvent.setup(); render(<PlanningSection title="Einstieg" state="started">Inhalt</PlanningSection>);
    const trigger = screen.getByRole("button", { name: /Einstieg/ }); trigger.focus(); await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true"); expect(screen.getByText("Inhalt")).toBeVisible();
  });

  it("rendert semantische Brotkrumen", () => {
    render(<Breadcrumbs items={[{ label: "Technik", href: "#" }, { label: "Designsystem" }]} />);
    expect(screen.getByRole("navigation", { name: "Brotkrumen" })).toBeInTheDocument();
    expect(screen.getByText("Designsystem")).toHaveAttribute("aria-current", "page");
  });

  it("beschreibt Status zusätzlich zur Farbe mit Text", () => {
    render(<SyncIndicator state="offline" />);
    expect(screen.getByRole("status")).toHaveTextContent("Offline – lokal gesichert");
  });
});

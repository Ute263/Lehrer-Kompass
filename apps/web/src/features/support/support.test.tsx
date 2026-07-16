// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../../app/router";

const renderSupport=()=>render(<MemoryRouter initialEntries={["/foerderunterricht"]}><AppRoutes/></MemoryRouter>);
beforeEach(()=>localStorage.clear());

describe("Förderunterricht",()=>{
 it("zeigt Fördergruppen, Ziele und Verlauf",()=>{renderSupport();expect(screen.getByRole("heading",{name:"Förderunterricht"})).toBeInTheDocument();expect(screen.getByText("Fördergruppe Sprache")).toBeInTheDocument();expect(screen.getByText("Silben sicher erkennen")).toBeInTheDocument();expect(screen.getByText(/Zweisilbige Wörter/)).toBeInTheDocument();});
 it("legt eine Fördergruppe lokal an",async()=>{const user=userEvent.setup();renderSupport();await user.click(screen.getByRole("button",{name:/Neue Fördergruppe/}));await user.type(screen.getByLabelText("Name der Fördergruppe"),"Fördergruppe Lesen");await user.type(screen.getByLabelText("Förderbereich"),"Leseflüssigkeit");await user.click(screen.getByRole("button",{name:"Fördergruppe speichern"}));expect(screen.getByText("Fördergruppe Lesen")).toBeInTheDocument();expect(localStorage.getItem("lehrerkompass-support-v1")).toContain("Fördergruppe Lesen");});
 it("ändert den Zielstatus",async()=>{const user=userEvent.setup();renderSupport();const status=screen.getByRole("button",{name:/In Arbeit/});await user.click(status);expect(screen.getByRole("button",{name:/Erreicht/})).toBeInTheDocument();});
});
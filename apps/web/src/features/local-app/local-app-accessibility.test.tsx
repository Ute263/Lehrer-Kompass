// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import axe from "axe-core";
import { BackupPage, DataPage, ImportPage, InstallationPage } from "./LocalAppPages";
async function check(ui:React.ReactNode){const {container}=render(<MemoryRouter>{ui}</MemoryRouter>);const result=await axe.run(container);expect(result.violations).toEqual([]);}
describe("Accessibility lokale App",()=>{it("prüft Sicherung",()=>check(<BackupPage/>));it("prüft Import",()=>check(<ImportPage/>));it("prüft Installation",()=>check(<InstallationPage/>));it("prüft Datenübersicht",()=>check(<DataPage/>));});

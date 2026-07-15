// @vitest-environment jsdom
import axe from "axe-core";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../app/router";

describe("AppShell Accessibility-Basistest", () => {
  it("findet auf der Werkbank-AppShell keine grundlegenden axe-Verstöße", async () => {
    const { container } = render(<MemoryRouter initialEntries={["/werkbank"]}><AppRoutes /></MemoryRouter>);
    const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(result.violations, result.violations.map((v) => `${v.id}: ${v.help}`).join("\n")).toEqual([]);
  });
});

// @vitest-environment jsdom
import { beforeEach, expect, it } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axe from "axe-core";
import { AppRoutes } from "../../app/router";
import { domainDb } from "../../domain";

beforeEach(async () => { localStorage.clear(); await domainDb.delete(); await domainDb.open(); });
for (const path of ["/materialien/material-nomen-standard", "/materialien/material-nomen-standard/vorschau", "/materialien/neu"]) {
  it(`axe materials ${path}`, async () => {
    const { container } = render(<MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>);
    await waitFor(() => expect(container.querySelector("h1")).toBeTruthy());
    expect((await axe.run(container)).violations).toEqual([]);
  });
}

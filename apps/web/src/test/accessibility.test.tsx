// @vitest-environment jsdom
import axe from "axe-core";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DesignSystemPage } from "../prototype/DesignSystemPage";

describe("Accessibility-Basistest", () => {
  it("findet auf der Designsystem-Testseite keine grundlegenden axe-Verstöße", async () => {
    const { container } = render(<DesignSystemPage />);
    const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(result.violations, result.violations.map((v) => `${v.id}: ${v.help}`).join("\n")).toEqual([]);
  });
});

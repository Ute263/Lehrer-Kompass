import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { demoMaterial, MaterialSchema } from "./material.js";

describe("structured material model", () => {
  it("has exactly four tasks with linked answers and writing space", () => {
    const parsed = MaterialSchema.parse(demoMaterial);
    expect(parsed.tasks).toHaveLength(4);
    expect(new Set(parsed.tasks.map((task) => task.id)).size).toBe(4);
    expect(parsed.tasks.every((task) => task.answer.length > 0 && task.writingLines > 0)).toBe(true);
    expect(parsed.tasks.some((task) => task.imagePlaceholder)).toBe(true);
  });

  it("generates non-empty PDF and DOCX artifacts when artifact task ran", () => {
    for (const file of ["artifacts/machbarkeit/Nomen_mit_Artikeln_Test.pdf", "artifacts/machbarkeit/Nomen_mit_Artikeln_Test.docx"]) {
      expect(fs.existsSync(file)).toBe(true);
      expect(fs.statSync(file).size).toBeGreaterThan(1_000);
    }
  });
});


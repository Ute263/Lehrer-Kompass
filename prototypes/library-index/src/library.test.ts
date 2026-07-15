import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { entries, search } from "./library.js";

describe("library metadata and search", () => {
  it("contains ten artificial files and required formats/statuses", () => {
    expect(entries).toHaveLength(10);
    expect(new Set(entries.map((entry) => entry.fileType))).toEqual(new Set(["pdf", "docx", "txt", "png"]));
    expect(entries.some((entry) => entry.indexStatus === "Zuordnung prüfen")).toBe(true);
    expect(entries.find((entry) => entry.id === "m1")?.links).toHaveLength(2);
  });

  it.each([
    ["Nomen Klasse 2", "m1"], ["wenig schreiben Nomen", "m1"], ["bewährtes Arbeitsblatt", "m1"],
    ["Wasser Versuch", "m3"], ["Lösung vorhanden", "m1"]
  ])("finds %s", (query, expectedId) => expect(search(query).map((entry) => entry.id)).toContain(expectedId));

  it("filters without copying originals", () => {
    const result = search("Arbeitsblatt", { subject: "Mathematik", grade: 2 });
    expect(result.map((entry) => entry.id)).toEqual(["m5"]);
    expect(entries).toHaveLength(10);
  });

  it("creates every artificial source file when artifact task ran", () => {
    for (const entry of entries) expect(fs.existsSync(`prototypes/library-index/${entry.location}`)).toBe(true);
  });
});


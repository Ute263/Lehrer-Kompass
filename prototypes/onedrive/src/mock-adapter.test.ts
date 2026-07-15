import { describe, expect, it } from "vitest";
import { InMemoryOneDriveAdapter } from "./mock-adapter.js";

describe("OneDrive test-folder mock", () => {
  it("supports list, upload, download, rename, move and location by stable IDs", async () => {
    const adapter = new InMemoryOneDriveAdapter();
    const created = await adapter.upload(adapter.testFolderId, "demo.txt", "nur künstliche Daten");
    expect(created.driveId).toBe(adapter.testDriveId);
    expect(await adapter.download(created.driveId, created.itemId)).toBe("nur künstliche Daten");
    const renamed = await adapter.rename(created.driveId, created.itemId, "demo-neu.txt");
    expect(renamed.itemId).toBe(created.itemId);
    const moved = await adapter.move(created.driveId, created.itemId, "LEHRERKOMPASS_TEST/verschoben");
    expect(moved.parentId).toBe("LEHRERKOMPASS_TEST/verschoben");
    expect(await adapter.list(adapter.testFolderId)).toHaveLength(0);
    expect(await adapter.list("LEHRERKOMPASS_TEST/verschoben")).toHaveLength(1);
    expect(await adapter.openLocation(created.driveId, created.itemId)).toMatch(/^https:\/\/onedrive\.test\//);
  });

  it("refuses writes outside the selected folder and refuses overwrite", async () => {
    const adapter = new InMemoryOneDriveAdapter();
    await expect(adapter.upload("root", "verboten.txt", "x")).rejects.toMatchObject({
      error: { code: "ONEDRIVE_OUTSIDE_TEST_FOLDER" }
    });
    await adapter.upload(adapter.testFolderId, "gleich.txt", "eins");
    await expect(adapter.upload(adapter.testFolderId, "gleich.txt", "zwei")).rejects.toMatchObject({
      error: { code: "ONEDRIVE_NO_OVERWRITE" }
    });
  });
});


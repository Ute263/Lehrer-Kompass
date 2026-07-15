import { describe, expect, it, vi } from "vitest";
import { MicrosoftGraphOneDriveAdapter, PersonalGraphConfigSchema } from "./graph-adapter.js";

const config = PersonalGraphConfigSchema.parse({ authority: "consumers", clientId: "personal-app", personalAccountId: "personal-a", testDriveId: "drive-a", testFolderId: "folder-a", testSubfolderId: "sub-a" });
const item = (id: string, name: string, parent = "folder-a") => ({ id, name, eTag: `etag-${id}`, webUrl: `https://onedrive.live.com/${id}`, parentReference: { driveId: "drive-a", id: parent } });

describe("personal Microsoft Graph adapter contract", () => {
  it("rejects organizational authorities and operations outside the personal test folder", async () => {
    expect(() => PersonalGraphConfigSchema.parse({ ...config, authority: "organizations" })).toThrow();
    const adapter = new MicrosoftGraphOneDriveAdapter(config, async () => "token", vi.fn());
    await expect(adapter.list("root")).rejects.toMatchObject({ error: { code: "ONEDRIVE_OUTSIDE_TEST_FOLDER" } });
    await expect(adapter.download("foreign-drive", "x")).rejects.toMatchObject({ error: { code: "ONEDRIVE_WRONG_DRIVE" } });
  });

  it("sends an authenticated no-overwrite upload only to the configured private folder", async () => {
    const requests: Array<{ url: string; init: RequestInit | undefined }> = [];
    const fetcher = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      requests.push({ url: String(input), init });
      if (String(input).includes("/children")) return new Response(JSON.stringify({ value: [] }), { status: 200 });
      return new Response(JSON.stringify(item("new-1", "demo.txt")), { status: 200 });
    });
    const adapter = new MicrosoftGraphOneDriveAdapter(config, async () => "personal-token", fetcher);
    const created = await adapter.upload("folder-a", "demo.txt", "künstliche Testdaten");
    expect(created).toMatchObject({ driveId: "drive-a", parentId: "folder-a", name: "demo.txt" });
    expect(requests[1]?.url).toContain("/drives/drive-a/items/folder-a:/demo.txt:/content");
    expect(new Headers(requests[1]?.init?.headers).get("Authorization")).toBe("Bearer personal-token");
    expect(new Headers(requests[1]?.init?.headers).get("If-None-Match")).toBe("*");
  });

  it("binds the token to the configured personal account before a real smoke test", async () => {
    const matching = new MicrosoftGraphOneDriveAdapter(config, async () => "token", async () => new Response(JSON.stringify({ id: "personal-a", userPrincipalName: "private@example.test" }), { status: 200 }));
    await expect(matching.verifyPersonalAccount()).resolves.toMatchObject({ id: "personal-a" });
    const foreign = new MicrosoftGraphOneDriveAdapter(config, async () => "token", async () => new Response(JSON.stringify({ id: "personal-b" }), { status: 200 }));
    await expect(foreign.verifyPersonalAccount()).rejects.toMatchObject({ error: { code: "MICROSOFT_ACCOUNT_MISMATCH" } });
  });
});

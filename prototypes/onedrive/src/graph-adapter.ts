import { z } from "zod";
import { appError } from "../../shared/error.js";
import { DriveItemSchema, type DriveItem, type OneDriveAdapter } from "./contracts.js";

export const PersonalGraphConfigSchema = z.object({
  authority: z.literal("consumers"),
  clientId: z.string().min(1),
  personalAccountId: z.string().min(1),
  testDriveId: z.string().min(1),
  testFolderId: z.string().min(1),
  testSubfolderId: z.string().min(1)
});
export type PersonalGraphConfig = z.infer<typeof PersonalGraphConfigSchema>;

const GraphItemSchema = z.object({
  id: z.string(), name: z.string(), eTag: z.string(), webUrl: z.string().url(),
  parentReference: z.object({ driveId: z.string(), id: z.string() })
});
const GraphListSchema = z.object({ value: z.array(GraphItemSchema) });
const GraphProfileSchema = z.object({ id: z.string().min(1), userPrincipalName: z.string().optional() });

export type AccessTokenProvider = () => Promise<string>;
export type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export class MicrosoftGraphOneDriveAdapter implements OneDriveAdapter {
  readonly testDriveId: string;
  readonly testFolderId: string;
  private readonly config: PersonalGraphConfig;
  private readonly allowedParents: Set<string>;

  constructor(configInput: PersonalGraphConfig, private readonly tokenProvider: AccessTokenProvider, private readonly fetcher: FetchLike = fetch) {
    this.config = PersonalGraphConfigSchema.parse(configInput);
    this.testDriveId = this.config.testDriveId;
    this.testFolderId = this.config.testFolderId;
    this.allowedParents = new Set([this.config.testFolderId, this.config.testSubfolderId]);
  }

  private assertDrive(driveId: string): void {
    if (driveId !== this.testDriveId) throw appError("ONEDRIVE_WRONG_DRIVE", "Zugriff auf ein anderes OneDrive wurde verweigert.");
  }

  private assertParent(parentId: string): void {
    if (!this.allowedParents.has(parentId)) throw appError("ONEDRIVE_OUTSIDE_TEST_FOLDER", "Operation außerhalb des privaten OneDrive-Testordners verweigert.");
  }

  private async request(path: string, init: RequestInit = {}): Promise<Response> {
    const token = await this.tokenProvider();
    if (!token) throw appError("GRAPH_NOT_CONFIGURED", "Persönlicher Microsoft-Zugriffstoken fehlt.");
    const response = await this.fetcher(`https://graph.microsoft.com/v1.0${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, ...init.headers }
    });
    if (!response.ok) throw appError("GRAPH_REQUEST_FAILED", `Microsoft Graph antwortete mit HTTP ${response.status}.`, response.status >= 500);
    return response;
  }

  private map(itemInput: unknown, content = ""): DriveItem {
    const item = GraphItemSchema.parse(itemInput);
    this.assertDrive(item.parentReference.driveId);
    this.assertParent(item.parentReference.id);
    return DriveItemSchema.parse({
      driveId: item.parentReference.driveId, itemId: item.id, parentId: item.parentReference.id,
      name: item.name, content, webUrl: item.webUrl, eTag: item.eTag
    });
  }

  async verifyPersonalAccount(): Promise<z.infer<typeof GraphProfileSchema>> {
    const response = await this.request("/me?$select=id,userPrincipalName");
    const profile = GraphProfileSchema.parse(await response.json());
    if (profile.id !== this.config.personalAccountId) {
      throw appError("MICROSOFT_ACCOUNT_MISMATCH", "Das angemeldete persönliche Konto passt nicht zur freigegebenen Testkonfiguration.");
    }
    return profile;
  }

  async list(parentId: string): Promise<DriveItem[]> {
    this.assertParent(parentId);
    const response = await this.request(`/drives/${encodeURIComponent(this.testDriveId)}/items/${encodeURIComponent(parentId)}/children?$select=id,name,eTag,webUrl,parentReference`);
    return GraphListSchema.parse(await response.json()).value.map((item) => this.map(item));
  }

  async upload(parentId: string, name: string, content: string): Promise<DriveItem> {
    this.assertParent(parentId);
    if ((await this.list(parentId)).some((item) => item.name === name)) throw appError("ONEDRIVE_NO_OVERWRITE", "Eine gleichnamige Datei im privaten Testordner wird nicht überschrieben.");
    const response = await this.request(`/drives/${encodeURIComponent(this.testDriveId)}/items/${encodeURIComponent(parentId)}:/${encodeURIComponent(name)}:/content`, {
      method: "PUT", headers: { "Content-Type": "text/plain; charset=utf-8", "If-None-Match": "*" }, body: content
    });
    return this.map(await response.json(), content);
  }

  async download(driveId: string, itemId: string): Promise<string> {
    this.assertDrive(driveId);
    const response = await this.request(`/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}/content`);
    return response.text();
  }

  async rename(driveId: string, itemId: string, name: string): Promise<DriveItem> {
    this.assertDrive(driveId);
    const currentResponse = await this.request(`/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}?$select=id,name,eTag,webUrl,parentReference`);
    const current = this.map(await currentResponse.json());
    if ((await this.list(current.parentId)).some((item) => item.itemId !== itemId && item.name === name)) throw appError("ONEDRIVE_NO_OVERWRITE", "Umbenennen würde eine Testdatei überschreiben.");
    const response = await this.request(`/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}`, {
      method: "PATCH", headers: { "Content-Type": "application/json", "If-Match": current.eTag }, body: JSON.stringify({ name })
    });
    return this.map(await response.json());
  }

  async move(driveId: string, itemId: string, targetParentId: string): Promise<DriveItem> {
    this.assertDrive(driveId); this.assertParent(targetParentId);
    const response = await this.request(`/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentReference: { driveId, id: targetParentId } })
    });
    return this.map(await response.json());
  }

  async openLocation(driveId: string, itemId: string): Promise<string> {
    this.assertDrive(driveId);
    const response = await this.request(`/drives/${encodeURIComponent(driveId)}/items/${encodeURIComponent(itemId)}?$select=id,name,eTag,webUrl,parentReference`);
    return this.map(await response.json()).webUrl;
  }
}

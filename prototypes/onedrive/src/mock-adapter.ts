import { appError } from "../../shared/error.js";
import { DriveItemSchema, type DriveItem, type OneDriveAdapter } from "./contracts.js";

export class InMemoryOneDriveAdapter implements OneDriveAdapter {
  readonly testDriveId: string;
  readonly testFolderId: string;
  private readonly allowedParents: Set<string>;
  private readonly items = new Map<string, DriveItem>();

  constructor(options: { testDriveId?: string; testFolderId?: string; subfolderId?: string } = {}) {
    this.testDriveId = options.testDriveId ?? "demo-drive";
    this.testFolderId = options.testFolderId ?? "LEHRERKOMPASS_TEST";
    this.allowedParents = new Set([this.testFolderId, options.subfolderId ?? `${this.testFolderId}/verschoben`]);
  }

  private assertParent(parentId: string): void {
    if (!this.allowedParents.has(parentId)) {
      throw appError("ONEDRIVE_OUTSIDE_TEST_FOLDER", "Operation außerhalb des OneDrive-Testordners verweigert.");
    }
  }

  private get(driveId: string, itemId: string): DriveItem {
    if (driveId !== this.testDriveId) {
      throw appError("ONEDRIVE_WRONG_DRIVE", "Unbekannte driveId.");
    }
    const item = this.items.get(itemId);
    if (!item) throw appError("ONEDRIVE_NOT_FOUND", "Testdatei nicht gefunden.");
    return item;
  }

  async list(parentId: string): Promise<DriveItem[]> {
    this.assertParent(parentId);
    return [...this.items.values()].filter((item) => item.parentId === parentId).map((item) => ({ ...item }));
  }

  async upload(parentId: string, name: string, content: string): Promise<DriveItem> {
    this.assertParent(parentId);
    if ([...this.items.values()].some((item) => item.parentId === parentId && item.name === name)) {
      throw appError("ONEDRIVE_NO_OVERWRITE", "Eine gleichnamige Testdatei wird nicht überschrieben.");
    }
    const itemId = crypto.randomUUID();
    const item = DriveItemSchema.parse({
      driveId: this.testDriveId,
      itemId,
      parentId,
      name,
      content,
      webUrl: `https://onedrive.test/${this.testDriveId}/${itemId}`,
      eTag: `\"${crypto.randomUUID()}\"`
    });
    this.items.set(itemId, item);
    return { ...item };
  }

  async download(driveId: string, itemId: string): Promise<string> {
    return this.get(driveId, itemId).content;
  }

  async rename(driveId: string, itemId: string, name: string): Promise<DriveItem> {
    const item = this.get(driveId, itemId);
    if ([...this.items.values()].some((other) => other.itemId !== itemId && other.parentId === item.parentId && other.name === name)) {
      throw appError("ONEDRIVE_NO_OVERWRITE", "Umbenennen würde eine Testdatei überschreiben.");
    }
    const updated = DriveItemSchema.parse({ ...item, name, eTag: `\"${crypto.randomUUID()}\"` });
    this.items.set(itemId, updated);
    return { ...updated };
  }

  async move(driveId: string, itemId: string, targetParentId: string): Promise<DriveItem> {
    this.assertParent(targetParentId);
    const item = this.get(driveId, itemId);
    const updated = DriveItemSchema.parse({ ...item, parentId: targetParentId, eTag: `\"${crypto.randomUUID()}\"` });
    this.items.set(itemId, updated);
    return { ...updated };
  }

  async openLocation(driveId: string, itemId: string): Promise<string> {
    return this.get(driveId, itemId).webUrl;
  }
}

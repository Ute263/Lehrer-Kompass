import { z } from "zod";

export const DriveItemSchema = z.object({
  driveId: z.string().min(1),
  itemId: z.string().min(1),
  parentId: z.string().min(1),
  name: z.string().min(1),
  content: z.string(),
  webUrl: z.string().url(),
  eTag: z.string().min(1)
});

export type DriveItem = z.infer<typeof DriveItemSchema>;

export interface OneDriveAdapter {
  readonly testDriveId: string;
  readonly testFolderId: string;
  list(parentId: string): Promise<DriveItem[]>;
  upload(parentId: string, name: string, content: string): Promise<DriveItem>;
  download(driveId: string, itemId: string): Promise<string>;
  rename(driveId: string, itemId: string, name: string): Promise<DriveItem>;
  move(driveId: string, itemId: string, targetParentId: string): Promise<DriveItem>;
  openLocation(driveId: string, itemId: string): Promise<string>;
}


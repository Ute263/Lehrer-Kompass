import { MicrosoftGraphOneDriveAdapter, PersonalGraphConfigSchema } from "./graph-adapter.js";

const required = ["MICROSOFT_CLIENT_ID", "MICROSOFT_ACCESS_TOKEN", "MICROSOFT_PERSONAL_ACCOUNT_ID", "ONEDRIVE_TEST_DRIVE_ID", "ONEDRIVE_TEST_FOLDER_ID", "ONEDRIVE_TEST_SUBFOLDER_ID"] as const;
const missing = required.filter((name) => !process.env[name]);
if (process.env.MICROSOFT_AUTHORITY !== "consumers" || missing.length > 0) {
  console.error(`BLOCKIERT: Persönlicher Microsoft-Graph-Test nicht gestartet. Erforderlich: MICROSOFT_AUTHORITY=consumers und ${missing.join(", ") || "persönliche Testkonfiguration"}.`);
  process.exitCode = 2;
} else {
  const config = PersonalGraphConfigSchema.parse({
    authority: process.env.MICROSOFT_AUTHORITY,
    clientId: process.env.MICROSOFT_CLIENT_ID,
    personalAccountId: process.env.MICROSOFT_PERSONAL_ACCOUNT_ID,
    testDriveId: process.env.ONEDRIVE_TEST_DRIVE_ID,
    testFolderId: process.env.ONEDRIVE_TEST_FOLDER_ID,
    testSubfolderId: process.env.ONEDRIVE_TEST_SUBFOLDER_ID
  });
  const adapter = new MicrosoftGraphOneDriveAdapter(config, async () => process.env.MICROSOFT_ACCESS_TOKEN!);
  const profile = await adapter.verifyPersonalAccount();
  const name = `lehrerkompass-private-smoke-${Date.now()}.txt`;
  const created = await adapter.upload(config.testFolderId, name, "Ausschließlich künstliche Testdaten für den privaten OneDrive-Testordner.");
  const downloaded = await adapter.download(created.driveId, created.itemId);
  if (!downloaded.includes("künstliche Testdaten")) throw new Error("Abrufinhalt stimmt nicht überein.");
  const renamed = await adapter.rename(created.driveId, created.itemId, name.replace(".txt", "-umbenannt.txt"));
  const moved = await adapter.move(renamed.driveId, renamed.itemId, config.testSubfolderId);
  const location = await adapter.openLocation(moved.driveId, moved.itemId);
  console.log(JSON.stringify({ status: "REAL_GETESTET", accountId: profile.id, driveId: moved.driveId, itemId: moved.itemId, parentId: moved.parentId, webUrl: location, deletion: "nicht ausgeführt" }, null, 2));
}

import { BACKUP_FORMAT_VERSION, BackupError } from "./contracts";
export type BackupMigration = { fromVersion: number; toVersion: number; migrate: (backup: unknown) => unknown };
export const backupMigrations: BackupMigration[] = [];
export function migrateBackup(input: unknown, version: number) {
  if (version > BACKUP_FORMAT_VERSION) throw new BackupError("BACKUP_FORMAT_UNSUPPORTED", "Diese Sicherung stammt aus einer neueren LehrerKompass-Version.");
  let current = input; let next = version;
  while (next < BACKUP_FORMAT_VERSION) {
    const migration = backupMigrations.find((item) => item.fromVersion === next);
    if (!migration) throw new BackupError("BACKUP_MIGRATION_FAILED", "Für diese ältere Sicherung ist keine sichere Migration verfügbar.");
    current = migration.migrate(structuredClone(current)); next = migration.toVersion;
  }
  return current;
}

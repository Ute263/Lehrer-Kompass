import { z } from "zod";

export const APP_VERSION = "1.0.0-local";
export const BACKUP_FORMAT_VERSION = 1;
export const DATABASE_SCHEMA_VERSION = 7;

export const CONTENT_TABLES = [
  "schoolYears", "classes", "subjects", "classSubjects", "topics", "meta",
  "seriesTemplates", "seriesImplementations", "seriesPlannings", "seriesSequenceItems", "seriesWorkbenchRefs",
  "lessons", "lessonPlannings", "lessonPhases", "lessonReflections", "lessonWorkbenchRefs",
  "timetablePeriods", "weeklyScheduleSlots", "calendarEvents", "calendarEventHistory",
  "materialFamilies", "materials", "materialVariants", "materialDocuments", "materialPages", "materialBlocks",
  "materialSolutions", "materialLinks", "materialVersions", "buddyRequests", "buddySuggestions",
  "buddySuggestionChanges", "buddyVersions",
] as const;

export type ContentTable = (typeof CONTENT_TABLES)[number];
export type BackupData = Record<ContentTable, unknown[]>;
export type BackupManifest = {
  schoolYears: number; classes: number; topics: number; seriesTemplates: number;
  seriesImplementations: number; lessons: number; calendarEvents: number;
  materials: number; materialPages: number; buddySuggestions: number;
  versions: number; appVersion: string; databaseSchemaVersion: number;
};
export type LehrerKompassBackup = {
  format: "lehrerkompass-backup"; formatVersion: number; appVersion: string;
  databaseSchemaVersion: number; exportedAt: string; backupId: string;
  sourceMode: "local"; manifest: BackupManifest; data: BackupData;
  checksums: { manifest: string; domain: string; materials: string; versions: string };
};
export type ImportMode = "replace" | "merge" | "selective";
export type ImportArea = "domain" | "series" | "lessons" | "calendar" | "materials" | "buddy" | "settings";
export type ImportConflict = { table: ContentTable; id: string; kind: "identical" | "different"; resolution: "keep-local" | "use-backup" | "copy" | "skip" };
export type ImportPreview = { backup: LehrerKompassBackup; total: number; additions: number; identical: number; conflicts: ImportConflict[]; missingReferences: string[] };

const rows = z.record(z.string(), z.array(z.unknown()));
export const backupEnvelopeSchema = z.object({
  format: z.literal("lehrerkompass-backup"), formatVersion: z.number().int().positive(),
  appVersion: z.string().min(1), databaseSchemaVersion: z.number().int().positive(),
  exportedAt: z.iso.datetime(), backupId: z.string().min(8), sourceMode: z.literal("local"),
  manifest: z.object({ schoolYears:z.number(), classes:z.number(), topics:z.number(), seriesTemplates:z.number(), seriesImplementations:z.number(), lessons:z.number(), calendarEvents:z.number(), materials:z.number(), materialPages:z.number(), buddySuggestions:z.number(), versions:z.number(), appVersion:z.string(), databaseSchemaVersion:z.number() }),
  data: rows, checksums: z.object({ manifest:z.string(), domain:z.string(), materials:z.string(), versions:z.string() }),
});

export class BackupError extends Error {
  constructor(public readonly code: string, message: string) { super(message); }
}

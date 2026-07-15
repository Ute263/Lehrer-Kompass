import type { Table } from "dexie";
import { domainDb, type LocalImportReport, type LocalRestorePoint } from "../domain/database";
import { sha256 } from "./checksum";
import { APP_VERSION, BACKUP_FORMAT_VERSION, BackupError, CONTENT_TABLES, DATABASE_SCHEMA_VERSION, backupEnvelopeSchema, type BackupData, type ContentTable, type ImportArea, type ImportMode, type ImportPreview, type LehrerKompassBackup } from "./contracts";
import { migrateBackup } from "./migrations";

const groups = {
  domain: ["schoolYears","classes","subjects","classSubjects","topics","meta"],
  series: ["seriesTemplates","seriesImplementations","seriesPlannings","seriesSequenceItems","seriesWorkbenchRefs"],
  lessons: ["lessons","lessonPlannings","lessonPhases","lessonReflections","lessonWorkbenchRefs"],
  calendar: ["timetablePeriods","weeklyScheduleSlots","calendarEvents","calendarEventHistory"],
  materials: ["materialFamilies","materials","materialVariants","materialDocuments","materialPages","materialBlocks","materialSolutions","materialLinks","materialVersions"],
  buddy: ["buddyRequests","buddySuggestions","buddySuggestionChanges","buddyVersions"], settings: ["meta"],
} satisfies Record<ImportArea, string[]>;
const table = (name: string) => domainDb.table(name) as Table<Record<string, unknown>, string>;
const pick = (data: BackupData, names: readonly string[]) => Object.fromEntries(names.map((name) => [name, data[name as ContentTable]]));
const counts = (data: BackupData) => ({ schoolYears:data.schoolYears.length, classes:data.classes.length, topics:data.topics.length, seriesTemplates:data.seriesTemplates.length, seriesImplementations:data.seriesImplementations.length, lessons:data.lessons.length, calendarEvents:data.calendarEvents.length, materials:data.materials.length, materialPages:data.materialPages.length, buddySuggestions:data.buddySuggestions.length, versions:data.materialVersions.length + data.buddyVersions.length, appVersion:APP_VERSION, databaseSchemaVersion:DATABASE_SCHEMA_VERSION });

export async function readAllContent(): Promise<BackupData> {
  const entries = await Promise.all(CONTENT_TABLES.map(async (name) => [name, await table(name).toArray()] as const));
  return Object.fromEntries(entries) as BackupData;
}
async function checksums(data: BackupData, manifest: ReturnType<typeof counts>) {
  return { manifest:await sha256(manifest), domain:await sha256(pick(data,[...groups.domain,...groups.series,...groups.lessons,...groups.calendar])), materials:await sha256(pick(data,groups.materials)), versions:await sha256(pick(data,["materialVersions","buddyVersions"])) };
}
export async function createBackup(now = new Date()): Promise<LehrerKompassBackup> {
  const data = await readAllContent(); const manifest = counts(data);
  return { format:"lehrerkompass-backup", formatVersion:BACKUP_FORMAT_VERSION, appVersion:APP_VERSION, databaseSchemaVersion:DATABASE_SCHEMA_VERSION, exportedAt:now.toISOString(), backupId:crypto.randomUUID(), sourceMode:"local", manifest, data, checksums:await checksums(data,manifest) };
}
export function backupFileName(date = new Date()) { return `LehrerKompass_Sicherung_${date.toISOString().slice(0,16).replace("T","_").replace(":","")}.lehrerkompass.json`; }
export async function parseBackup(text: string, maxBytes = 25_000_000): Promise<LehrerKompassBackup> {
  if (new Blob([text]).size > maxBytes) throw new BackupError("BACKUP_TOO_LARGE", "Die Sicherungsdatei ist zu groß.");
  let raw: unknown; try { raw = JSON.parse(text); } catch { throw new BackupError("BACKUP_FILE_INVALID", "Die Datei enthält kein gültiges JSON."); }
  const version = typeof raw === "object" && raw && "formatVersion" in raw ? Number((raw as {formatVersion:unknown}).formatVersion) : 0;
  const parsed = backupEnvelopeSchema.safeParse(migrateBackup(raw, version));
  if (!parsed.success) throw new BackupError("BACKUP_FILE_INVALID", "Die Datei ist keine gültige LehrerKompass-Sicherung.");
  if (parsed.data.databaseSchemaVersion > DATABASE_SCHEMA_VERSION) throw new BackupError("BACKUP_SCHEMA_NEWER", "Das Datenbankschema der Sicherung ist neuer als diese App.");
  const backup = parsed.data as LehrerKompassBackup;
  const expected = await checksums(backup.data, backup.manifest);
  if (Object.keys(expected).some((key) => expected[key as keyof typeof expected] !== backup.checksums[key as keyof typeof expected])) throw new BackupError("BACKUP_CHECKSUM_INVALID", "Die Prüfsumme stimmt nicht. Die Datei kann beschädigt sein.");
  return backup;
}
export async function previewImport(backup: LehrerKompassBackup): Promise<ImportPreview> {
  const conflicts: ImportPreview["conflicts"] = []; let additions=0, identical=0, total=0;
  for (const name of CONTENT_TABLES) for (const row of backup.data[name] as Record<string,unknown>[]) { total++; const local = await table(name).get(String(row.id)); if (!local) additions++; else if (await sha256(local) === await sha256(row)) identical++; else conflicts.push({table:name,id:String(row.id),kind:"different",resolution:"keep-local"}); }
  return { backup,total,additions,identical,conflicts,missingReferences:[] };
}
export async function createRestorePoint(reason: LocalRestorePoint["reason"]) {
  const data=await readAllContent(); const snapshot=JSON.stringify(data); const point:LocalRestorePoint={id:crypto.randomUUID(),createdAt:new Date().toISOString(),reason,schemaVersion:7,sizeBytes:new Blob([snapshot]).size,snapshot};
  await domainDb.localRestorePoints.add(point); const old=await domainDb.localRestorePoints.orderBy("createdAt").reverse().offset(5).toArray(); if(old.length) await domainDb.localRestorePoints.bulkDelete(old.map(v=>v.id)); return point;
}
export async function applyImport(preview: ImportPreview, mode: ImportMode, areas: ImportArea[] = Object.keys(groups) as ImportArea[]) {
  const restore=await createRestorePoint("import"); const allowed=new Set(areas.flatMap((area)=>groups[area])); let imported=0,skipped=0,copied=0;
  const txTables=CONTENT_TABLES.map(table);
  await domainDb.transaction("rw", txTables, async()=>{ for(const name of CONTENT_TABLES){ if(!allowed.has(name)){skipped+=preview.backup.data[name].length;continue;} const rows=preview.backup.data[name] as Record<string,unknown>[]; if(mode==="replace") await table(name).clear(); for(const row of rows){ const current=await table(name).get(String(row.id)); if(!current) { await table(name).add(row); imported++; } else if(await sha256(current)===await sha256(row)) skipped++; else if(mode==="replace") { await table(name).put(row); imported++; } else skipped++; } } });
  const report:LocalImportReport={id:crypto.randomUUID(),createdAt:new Date().toISOString(),mode,imported,skipped,copied,conflicts:preview.conflicts.length,errors:0,restorePointId:restore.id}; await domainDb.importReports.add(report); return report;
}
export async function restorePoint(id:string){ const point=await domainDb.localRestorePoints.get(id); if(!point) throw new BackupError("RESTORE_POINT_FAILED","Der Wiederherstellungspunkt wurde nicht gefunden."); const data=JSON.parse(point.snapshot) as BackupData; await domainDb.transaction("rw",CONTENT_TABLES.map(table),async()=>{for(const name of CONTENT_TABLES){await table(name).clear();await table(name).bulkAdd(data[name] as Record<string,unknown>[]);}}); }
export async function resetLocalData(confirmation:string){ if(confirmation!=="LOKAL ZURÜCKSETZEN") throw new BackupError("APP_DATA_RESET_FAILED","Der Bestätigungstext stimmt nicht."); const restore=await createRestorePoint("reset"); await domainDb.transaction("rw",CONTENT_TABLES.map(table),async()=>{for(const name of CONTENT_TABLES)await table(name).clear();}); return restore; }

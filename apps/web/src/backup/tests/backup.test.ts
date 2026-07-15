import "fake-indexeddb/auto";
import Dexie from "dexie";
import { beforeAll, describe, expect, it } from "vitest";
import { domainDb, DomainDatabase } from "../../domain/database";
import { backupFileName, createBackup, parseBackup, previewImport } from "../service";
import { sha256 } from "../checksum";

describe.sequential("lokale Sicherung",()=>{
  beforeAll(async()=>{await domainDb.open();});
  it("erstellt ein vollständiges, versioniertes Format mit korrektem Manifest",async()=>{const backup=await createBackup(new Date("2026-07-15T18:30:00.000Z"));expect(backup).toMatchObject({format:"lehrerkompass-backup",formatVersion:1,sourceMode:"local",databaseSchemaVersion:7});expect(backup.manifest.classes).toBe(backup.data.classes.length);expect(JSON.stringify(backup)).not.toMatch(/OPENAI_API_KEY|MICROSOFT_CLIENT_SECRET|sessionToken/i);});
  it("akzeptiert gültige Prüfsummen",async()=>{const backup=await createBackup();expect((await parseBackup(JSON.stringify(backup))).backupId).toBe(backup.backupId);});
  it("weist beschädigte Sicherungen zurück",async()=>{const backup=await createBackup();backup.data.classes.push({id:"manipuliert"});await expect(parseBackup(JSON.stringify(backup))).rejects.toMatchObject({code:"BACKUP_CHECKSUM_INVALID"});});
  it("weist ungültiges JSON und neuere Formate ruhig zurück",async()=>{await expect(parseBackup("{" )).rejects.toMatchObject({code:"BACKUP_FILE_INVALID"});const backup=await createBackup();backup.formatVersion=99;await expect(parseBackup(JSON.stringify(backup))).rejects.toMatchObject({code:"BACKUP_FORMAT_UNSUPPORTED"});});
  it("verändert bei der Vorschau keine Daten",async()=>{const backup=await createBackup();const before=await domainDb.classes.count();const preview=await previewImport(backup);expect(preview.total).toBeGreaterThanOrEqual(0);expect(await domainDb.classes.count()).toBe(before);});
  it("erzeugt einen neutralen Dateinamen",()=>{expect(backupFileName(new Date("2026-07-15T18:30:00.000Z"))).toBe("LehrerKompass_Sicherung_2026-07-15_1830.lehrerkompass.json");});
  it("verwendet deterministische SHA-256-Prüfsummen",async()=>{expect(await sha256({b:2,a:1})).toBe(await sha256({a:1,b:2}));});
});

it("migriert v6 nach v7 und erhält Buddy-Daten",async()=>{const name=`backup-v6-${crypto.randomUUID()}`;const old=new Dexie(name);old.version(6).stores({buddySuggestions:"id,requestId,targetType,targetId,capabilityKey,status,createdAt"});await old.open();await old.table("buddySuggestions").add({id:"kept",requestId:"r",targetType:"lesson",targetId:"l",capabilityKey:"shorten_lesson",status:"preview",createdAt:new Date().toISOString()});old.close();const next=new DomainDatabase(name);await next.open();expect(await next.buddySuggestions.get("kept")).toBeTruthy();expect(next.verno).toBe(7);expect(next.tables.map(t=>t.name)).toEqual(expect.arrayContaining(["backupMetadata","localRestorePoints","importReports"]));await next.delete();});

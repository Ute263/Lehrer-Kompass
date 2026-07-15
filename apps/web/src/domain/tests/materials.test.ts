import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DomainDatabase, MaterialService, MATERIAL_SEED, layoutIssues } from "..";

let db: DomainDatabase;
let service: MaterialService;

beforeEach(async () => {
  db = new DomainDatabase(`materials-${crypto.randomUUID()}`);
  service = new MaterialService(db);
  await service.ready();
});
afterEach(() => db.delete());

describe("Materialdomäne", () => {
  it("hält Familie, Variante, Dokument, Seite und Blöcke getrennt", async () => {
    const snapshot = await service.snapshot();
    expect(snapshot.materials[0]?.familyId).toBe(MATERIAL_SEED.family);
    expect(snapshot.documents[0]?.materialId).toBe(MATERIAL_SEED.material);
    expect(snapshot.blocks.map((block) => block.blockType)).toEqual(expect.arrayContaining(["heading", "instruction", "task", "image", "table", "writing_lines", "card_grid", "footer"]));
  });

  it("legt eigenständige Materialien ohne fachlichen Pflichtkontext an", async () => {
    const id = await service.create({ title: "Lokales Blatt", materialType: "worksheet", variantType: "standard", variantLabel: "Standard", pageFormat: "A4_PORTRAIT" });
    expect((await db.materials.get(id))?.lessonId).toBeUndefined();
  });

  it("verwaltet mehrere reine Verknüpfungen und schützt vor Duplikaten", async () => {
    await service.addLink(MATERIAL_SEED.material, "series_template", "template-x");
    await expect(service.addLink(MATERIAL_SEED.material, "series_template", "template-x")).rejects.toMatchObject({ code: "MATERIAL_DUPLICATE_LINK" });
    const link = await db.materialLinks.where("targetId").equals("template-x").first();
    await service.removeLink(link!.id);
    expect(await db.materials.get(MATERIAL_SEED.material)).toBeTruthy();
  });

  it("kopiert Varianten tief mit neuen IDs und unverändertem Original", async () => {
    const before = await service.materialSnapshot(MATERIAL_SEED.material);
    const id = await service.createVariant(MATERIAL_SEED.material, "support", "Basis");
    const copy = await service.materialSnapshot(id);
    expect(copy.pages[0]?.id).not.toBe(before.pages[0]?.id);
    expect(copy.blocks.map((block) => block.id)).not.toEqual(before.blocks.map((block) => block.id));
    expect(copy.solutions.every((solution) => !solution.isVerified)).toBe(true);
    expect(await service.materialSnapshot(MATERIAL_SEED.material)).toEqual(before);
  });

  it("ordnet Seiten und Blöcke deterministisch", async () => {
    const page = await service.addPage(MATERIAL_SEED.material, "Zweite Seite");
    await service.reorderPage(page, -1);
    expect((await db.materialPages.get(page))?.position).toBe(0);
    const block = await service.addBlock(page, "text");
    const second = await service.addBlock(page, "answer_field");
    await service.reorderBlock(second, -1);
    expect((await db.materialBlocks.get(second))?.position).toBeLessThan((await db.materialBlocks.get(block))!.position);
  });

  it("macht Lösungen nach Aufgabenänderungen erneut prüfpflichtig", async () => {
    await service.updateBlock(MATERIAL_SEED.task, { instruction: "Neue Aufgabenstellung" });
    expect(await db.materialSolutions.get(MATERIAL_SEED.solution)).toMatchObject({ isVerified: false });
  });

  it("blockiert Geprüft bei ungeklärten Rechten oder ungeprüften Lösungen", async () => {
    await db.materials.update(MATERIAL_SEED.material, { status: "draft" });
    await service.changeStatus(MATERIAL_SEED.material, "editing");
    await service.changeStatus(MATERIAL_SEED.material, "ready_for_review");
    await db.materialBlocks.update("block-image-1", { rightsStatus: "unknown" });
    await expect(service.changeStatus(MATERIAL_SEED.material, "reviewed")).rejects.toMatchObject({ code: "MATERIAL_LAYOUT_OVERFLOW" });
  });

  it("erkennt Alt-Text-, Rechte-, Tabellen- und Überlaufprobleme", async () => {
    const blocks = [
      { ...(await db.materialBlocks.get("block-image-1"))!, altText: "", rightsStatus: "unknown" as const },
      { ...(await db.materialBlocks.get("block-table-1"))!, columns: 8 },
      ...Array.from({ length: 10 }, (_, index) => ({ ...(db.materialBlocks.schema.primKey ? {} : {}), id: `x-${index}`, pageId: "p", blockType: "text" as const, position: index, widthMode: "full" as const, spacingBefore: 0, spacingAfter: 0, text: "x", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })),
    ];
    const codes = layoutIssues(blocks, []).map((issue) => issue.code);
    expect(codes).toEqual(expect.arrayContaining(["ALT_TEXT", "RIGHTS", "TABLE_WIDTH", "PAGE_HEIGHT"]));
  });

  it("archiviert weich und kann entfernte Blöcke rückgängig machen", async () => {
    await service.archiveBlock("block-heading-1");
    expect((await db.materialBlocks.get("block-heading-1"))?.archivedAt).toBeTruthy();
    await service.undoLast();
    expect((await db.materialBlocks.get("block-heading-1"))?.archivedAt).toBeUndefined();
    await service.archive(MATERIAL_SEED.material);
    expect(await db.materials.get(MATERIAL_SEED.material)).toMatchObject({ status: "archived" });
  });

  it("erstellt Versionen und sichert vor Wiederherstellung", async () => {
    await service.createVersion(MATERIAL_SEED.material, "Ausgang");
    const version = (await db.materialVersions.toArray())[0]!;
    await db.materials.update(MATERIAL_SEED.material, { title: "Geändert" });
    await service.restoreVersion(version.id);
    expect((await db.materials.get(MATERIAL_SEED.material))?.title).toBe("Nomen mit Artikeln erkennen");
    expect(await db.materialVersions.count()).toBe(2);
  });
});

const v1 = { schoolYears: "id,isActive,archivedAt", classes: "id,schoolYearId,isActive,archivedAt", subjects: "id,key,sortOrder", classSubjects: "id,classId,subjectId,[classId+subjectId],sortOrder", topics: "id,classId,subjectId,[classId+subjectId],status,sortOrder", meta: "id" };
const v2 = { ...v1, seriesTemplates: "id,topicId,status,[topicId+title]", seriesImplementations: "id,templateId,classId,schoolYearId,status", seriesPlannings: "id,implementationId", seriesSequenceItems: "id,implementationId,[implementationId+position]", seriesWorkbenchRefs: "id,implementationId,isActive" };
const v3 = { ...v2, lessons: "id,implementationId,sequenceItemId,[implementationId+position],status,archivedAt", lessonPlannings: "id,lessonId", lessonPhases: "id,lessonId,[lessonId+position]", lessonReflections: "id,lessonId", lessonWorkbenchRefs: "id,lessonId,isActive" };
const v4 = { ...v3, timetablePeriods: "id,sortOrder,archivedAt", timetableSlots: "id,schoolYearId,weekday,periodId,[schoolYearId+weekday+periodId],archivedAt", calendarEvents: "id,schoolYearId,date,periodId,lessonId,[date+periodId],status,archivedAt", calendarWorkbenchRefs: "id,eventId,isActive" };

it("migriert v4 nach v5 und erhält Kalenderdaten", async () => {
  const name = `material-v4-${crypto.randomUUID()}`;
  const old = new Dexie(name);
  old.version(4).stores(v4);
  await old.open();
  await old.table("calendarEvents").add({ id: "kept-event", schoolYearId: "y", date: "2026-08-24", periodId: "p", status: "planned" });
  old.close();
  const next = new DomainDatabase(name);
  await next.open();
  expect(await next.calendarEvents.get("kept-event")).toBeTruthy();
  expect(next.verno).toBe(7);
  await next.delete();
});

it("migriert vollständig v1 bis v5 und erhält Themen", async () => {
  const name = `material-v1-${crypto.randomUUID()}`;
  const old = new Dexie(name);
  old.version(1).stores(v1);
  await old.open();
  await old.table("topics").add({ id: "kept-topic", classId: "c", subjectId: "s", title: "Bleibt", sortOrder: 0, status: "active" });
  old.close();
  const next = new DomainDatabase(name);
  await next.open();
  expect(await next.topics.get("kept-topic")).toBeTruthy();
  expect(next.verno).toBe(7);
  await next.delete();
});

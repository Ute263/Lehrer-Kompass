import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  DomainDatabase,
  DomainService,
  SeriesService,
  LessonService,
  LESSON_SEED,
  SERIES_SEED,
  phaseMinutes,
  qualityHints,
} from "..";
let db: DomainDatabase, service: LessonService;
beforeEach(async () => {
  db = new DomainDatabase(`lesson-${crypto.randomUUID()}`);
  await new DomainService(db).ready();
  await new SeriesService(db).ready();
  service = new LessonService(db);
  await service.ready();
});
afterEach(() => db.delete());
const fails = (p: Promise<unknown>, code: string) =>
  expect(p).rejects.toMatchObject({ code });
describe("Unterrichtsstunden", () => {
  it("gehört zu einer Durchführung und bleibt vom Gliederungspunkt getrennt", async () =>
    expect(await db.lessons.get(LESSON_SEED.lesson)).toMatchObject({
      implementationId: SERIES_SEED.implementation,
      sequenceItemId: "sequence-nomen-0",
    }));
  it("öffnet beim zweiten Ausarbeiten dieselbe Stunde", async () =>
    expect(
      await service.fromSequence(
        SERIES_SEED.implementation,
        "sequence-nomen-0",
      ),
    ).toBe(LESSON_SEED.lesson));
  it("erlaubt unabhängige Stunden", async () =>
    expect(
      (
        await db.lessons.get(
          await service.create({
            implementationId: SERIES_SEED.implementation,
            title: "Freie Stunde",
            duration: 45,
          }),
        )
      )?.sequenceItemId,
    ).toBeUndefined());
  it("verhindert ungültige Dauer", () =>
    fails(
      service.create({
        implementationId: SERIES_SEED.implementation,
        title: "X",
        duration: 0,
      }),
      "LESSON_INVALID_DURATION",
    ));
  it("erlaubt Statusübergänge", async () => {
    await service.changeStatus(LESSON_SEED.lesson, "ready");
    await service.changeStatus(LESSON_SEED.lesson, "completed");
    expect(await db.lessons.get(LESSON_SEED.lesson)).toMatchObject({
      status: "completed",
      completedAt: expect.any(String),
    });
  });
  it("verhindert ungültige Statussprünge", () =>
    fails(
      service.changeStatus(LESSON_SEED.lesson, "completed"),
      "LESSON_INVALID_STATUS_TRANSITION",
    ));
  it("berechnet Phasensumme einschließlich optionaler Phase", async () => {
    const phases = await db.lessonPhases
      .where("lessonId")
      .equals(LESSON_SEED.lesson)
      .toArray();
    phases[0]!.optional = true;
    expect(phaseMinutes(phases)).toBe(50);
  });
  it("liefert ruhige deterministische Hinweise", async () => {
    const p = (await db.lessonPlannings.get(LESSON_SEED.planning))!,
      ph = await db.lessonPhases
        .where("lessonId")
        .equals(LESSON_SEED.lesson)
        .toArray();
    expect(qualityHints(p, ph, 45)).toContain(
      "Die Phasen ergeben 50 Minuten, geplant sind 45 Minuten.",
    );
  });
  it("sortiert Phasen persistent", async () => {
    await service.reorderPhase(LESSON_SEED.lesson, "phase-work", -1);
    expect(
      (
        await db.lessonPhases
          .where("lessonId")
          .equals(LESSON_SEED.lesson)
          .sortBy("position")
      )[0]!.id,
    ).toBe("phase-work");
  });
  it("dupliziert mit neuen IDs und lässt Original unverändert", async () => {
    const copy = await service.duplicate(LESSON_SEED.lesson);
    expect(copy).not.toBe(LESSON_SEED.lesson);
    expect(await db.lessons.get(copy)).toMatchObject({
      status: "draft",
      title: "Nomen kennenlernen – Kopie",
    });
    expect(await db.lessons.get(LESSON_SEED.lesson)).toMatchObject({
      title: "Nomen kennenlernen",
    });
    const ids = (
      await db.lessonPhases.where("lessonId").equals(copy).toArray()
    ).map((v) => v.id);
    expect(ids).not.toContain("phase-entry");
  });
  it("dupliziert keine Reflexion", async () => {
    await service.saveReflection(LESSON_SEED.lesson, { workedWell: "Gut" });
    const copy = await service.duplicate(LESSON_SEED.lesson);
    expect(
      await db.lessonReflections.where("lessonId").equals(copy).count(),
    ).toBe(0);
  });
  it("speichert Reflexion optional", async () => {
    await service.saveReflection(LESSON_SEED.lesson, {
      nextTimeChange: "Mehr Zeit",
    });
    expect(
      await db.lessonReflections
        .where("lessonId")
        .equals(LESSON_SEED.lesson)
        .first(),
    ).toMatchObject({ nextTimeChange: "Mehr Zeit" });
  });
  it("nimmt nur den Verweis von der Werkbank", async () => {
    await service.toggleWorkbench(LESSON_SEED.lesson, false);
    expect(await db.lessons.get(LESSON_SEED.lesson)).toBeTruthy();
    expect(
      await db.lessonWorkbenchRefs.get("lesson-ref-nomen-1"),
    ).toMatchObject({ isActive: false });
  });
  it("bearbeitet, dupliziert und entfernt Phasen", async () => {
    await service.updatePhase("phase-entry", {
      title: "Neuer Einstieg",
      durationMinutes: 12,
    });
    expect(await db.lessonPhases.get("phase-entry")).toMatchObject({
      title: "Neuer Einstieg",
      durationMinutes: 12,
    });
    const copy = await service.duplicatePhase("phase-entry");
    expect(await db.lessonPhases.get(copy)).toMatchObject({
      position: 1,
      title: "Neuer Einstieg – Kopie",
    });
    await service.removePhase(copy);
    expect(await db.lessonPhases.get(copy)).toBeUndefined();
  });
  it("sortiert echte Stunden unabhängig von der Gliederung", async () => {
    const second = await service.create({
      implementationId: SERIES_SEED.implementation,
      title: "Zweite Stunde",
      duration: 45,
    });
    await service.reorderLesson(second, -1);
    expect(await db.lessons.get(second)).toMatchObject({ position: 0 });
    expect(await db.seriesSequenceItems.get("sequence-nomen-0")).toMatchObject({
      position: 0,
    });
  });
  it("archiviert ohne physisches Löschen und entfernt den Werkbankverweis", async () => {
    await service.archiveLesson(LESSON_SEED.lesson);
    expect(await db.lessons.get(LESSON_SEED.lesson)).toMatchObject({
      archivedAt: expect.any(String),
    });
    expect(
      await db.lessonWorkbenchRefs.get("lesson-ref-nomen-1"),
    ).toMatchObject({ isActive: false });
  });
  it("lehnt beschädigte Daten ab", async () => {
    await db.lessons.put({ id: "bad" } as never);
    await fails(service.snapshot(), "LESSON_DATA_INVALID");
  });
});
const v1 = {
  schoolYears: "id,isActive,archivedAt",
  classes: "id,schoolYearId,isActive,archivedAt",
  subjects: "id,key,sortOrder",
  classSubjects: "id,classId,subjectId,[classId+subjectId],sortOrder",
  topics: "id,classId,subjectId,[classId+subjectId],status,sortOrder",
  meta: "id",
};
const v2 = {
  ...v1,
  seriesTemplates: "id,topicId,status,[topicId+title]",
  seriesImplementations: "id,templateId,classId,schoolYearId,status",
  seriesPlannings: "id,implementationId",
  seriesSequenceItems: "id,implementationId,[implementationId+position]",
  seriesWorkbenchRefs: "id,implementationId,isActive",
};
it("migriert v2 nach v3 und erhält Reihendaten", async () => {
  const n = `v2-${crypto.randomUUID()}`,
    old = new Dexie(n);
  old.version(2).stores(v2);
  await old.open();
  await old
    .table("seriesTemplates")
    .add({
      id: "kept-series",
      topicId: "t",
      title: "Bleibt",
      status: "active",
      createdAt: "2026-07-15T00:00:00.000Z",
      updatedAt: "2026-07-15T00:00:00.000Z",
    });
  old.close();
  const next = new DomainDatabase(n);
  await next.open();
  expect(await next.seriesTemplates.get("kept-series")).toBeTruthy();
  expect(next.verno).toBe(7);
  await next.delete();
});
it("migriert vollständig v1 über v2 nach v3", async () => {
  const n = `v1-${crypto.randomUUID()}`,
    old = new Dexie(n);
  old.version(1).stores(v1);
  await old.open();
  await old
    .table("topics")
    .add({
      id: "kept-topic",
      classId: "c",
      subjectId: "s",
      title: "Bleibt",
      sortOrder: 0,
      status: "active",
      createdAt: "2026-07-15T00:00:00.000Z",
      updatedAt: "2026-07-15T00:00:00.000Z",
    });
  old.close();
  const next = new DomainDatabase(n);
  await next.open();
  expect(await next.topics.get("kept-topic")).toBeTruthy();
  expect(next.verno).toBe(7);
  await next.delete();
});

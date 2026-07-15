import { domainDb, SEED_IDS, type DomainDatabase } from "./database";
import { clean, optional, DomainError } from "./model";
import {
  LESSON_TRANSITIONS,
  lessonPhaseSchema,
  lessonPlanningSchema,
  lessonReflectionSchema,
  lessonSchema,
  lessonWorkbenchRefSchema,
  phaseMinutes,
  type LessonPlanning,
  type LessonStatus,
  type PhaseType,
} from "./lesson-model";
import { SERIES_SEED } from "./series-service";
const now = () => new Date().toISOString(),
  id = () => crypto.randomUUID();
export const LESSON_SEED = {
  lesson: "lesson-nomen-1",
  planning: "lesson-planning-nomen-1",
};
const emptyPlanning = (lessonId: string, t = now()): LessonPlanning => ({
  id: id(),
  lessonId,
  learningPrerequisites: "",
  lessonGoal: "",
  differentiation: "",
  materialNeeds: "",
  preparation: "",
  createdAt: t,
  updatedAt: t,
});
export class LessonService {
  constructor(public db: DomainDatabase = domainDb) {}
  async ready() {
    if (await this.db.meta.get("seed-lessons-v3")) return;
    const seq = await this.db.seriesSequenceItems
      .where("implementationId")
      .equals(SERIES_SEED.implementation)
      .sortBy("position");
    if (!seq[0]) return;
    const t = now();
    await this.db.transaction(
      "rw",
      [
        this.db.lessons,
        this.db.lessonPlannings,
        this.db.lessonPhases,
        this.db.lessonWorkbenchRefs,
        this.db.meta,
      ],
      async () => {
        await this.db.lessons.add({
          id: LESSON_SEED.lesson,
          implementationId: SERIES_SEED.implementation,
          sequenceItemId: seq[0]!.id,
          position: 0,
          title: seq[0]!.title,
          shortDescription: "Künstliche Demonstrationsstunde",
          plannedDurationMinutes: 45,
          status: "planning",
          createdAt: t,
          updatedAt: t,
        });
        await this.db.lessonPlannings.add({
          ...emptyPlanning(LESSON_SEED.lesson, t),
          id: LESSON_SEED.planning,
          seriesContext: "Erster Gliederungspunkt der Reihe",
        });
        await this.db.lessonPhases.bulkAdd([
          {
            id: "phase-entry",
            lessonId: LESSON_SEED.lesson,
            position: 0,
            phaseType: "introduction",
            title: "Nomen im Klassenzimmer entdecken",
            durationMinutes: 15,
            teacherAction: "Gegenstände sichtbar machen",
            studentAction: "Begriffe sammeln",
            optional: false,
            createdAt: t,
            updatedAt: t,
          },
          {
            id: "phase-work",
            lessonId: LESSON_SEED.lesson,
            position: 1,
            phaseType: "development",
            title: "Nomen und Artikel ordnen",
            durationMinutes: 25,
            method: "Sortieraufgabe",
            socialForm: "Partnerarbeit",
            optional: false,
            createdAt: t,
            updatedAt: t,
          },
          {
            id: "phase-secure",
            lessonId: LESSON_SEED.lesson,
            position: 2,
            phaseType: "consolidation",
            title: "Ergebnisse sichern",
            durationMinutes: 10,
            optional: false,
            createdAt: t,
            updatedAt: t,
          },
        ]);
        await this.db.lessonWorkbenchRefs.add({
          id: "lesson-ref-nomen-1",
          lessonId: LESSON_SEED.lesson,
          implementationId: SERIES_SEED.implementation,
          templateId: SERIES_SEED.template,
          classId: SEED_IDS.class2a,
          subjectId: SEED_IDS.german,
          topicId: SEED_IDS.topicNouns,
          isActive: true,
          createdAt: t,
          updatedAt: t,
        });
        await this.db.meta.add({ id: "seed-lessons-v3", value: t });
      },
    );
  }
  async snapshot() {
    await this.ready();
    const [lessons, plannings, phases, reflections, refs] = await Promise.all([
      this.db.lessons.toArray(),
      this.db.lessonPlannings.toArray(),
      this.db.lessonPhases.toArray(),
      this.db.lessonReflections.toArray(),
      this.db.lessonWorkbenchRefs.toArray(),
    ]);
    try {
      return {
        lessons: lessons.map((v) => lessonSchema.parse(v)),
        plannings: plannings.map((v) => lessonPlanningSchema.parse(v)),
        phases: phases.map((v) => lessonPhaseSchema.parse(v)),
        reflections: reflections.map((v) => lessonReflectionSchema.parse(v)),
        refs: refs.map((v) => lessonWorkbenchRefSchema.parse(v)),
      };
    } catch {
      throw new DomainError(
        "LESSON_DATA_INVALID",
        "Lokale Stundendaten sind ungültig.",
      );
    }
  }
  async create(input: {
    implementationId: string;
    title: string;
    duration: number;
    sequenceItemId?: string | undefined;
    shortDescription?: string | undefined;
  }) {
    if (!Number.isInteger(input.duration) || input.duration <= 0)
      throw new DomainError(
        "LESSON_INVALID_DURATION",
        "Die Dauer muss eine positive ganze Zahl sein.",
      );
    return this.db.transaction(
      "rw",
      [
        this.db.lessons,
        this.db.lessonPlannings,
        this.db.lessonWorkbenchRefs,
        this.db.seriesImplementations,
        this.db.seriesTemplates,
        this.db.topics,
      ],
      async () => {
        const impl = await this.db.seriesImplementations.get(
          input.implementationId,
        );
        if (!impl)
          throw new DomainError(
            "LESSON_IMPLEMENTATION_MISMATCH",
            "Durchführung nicht gefunden.",
          );
        if (
          input.sequenceItemId &&
          (await this.db.lessons
            .where("sequenceItemId")
            .equals(input.sequenceItemId)
            .first())
        )
          throw new DomainError(
            "LESSON_DUPLICATE_SEQUENCE_LINK",
            "Dieser Gliederungspunkt ist bereits ausgearbeitet.",
          );
        const template = await this.db.seriesTemplates.get(impl.templateId),
          topic = template && (await this.db.topics.get(template.topicId));
        if (!template || !topic)
          throw new DomainError(
            "LESSON_IMPLEMENTATION_MISMATCH",
            "Fachlicher Kontext fehlt.",
          );
        const lessonId = id(),
          t = now(),
          position = await this.db.lessons
            .where("implementationId")
            .equals(impl.id)
            .count();
        await this.db.lessons.add({
          id: lessonId,
          implementationId: impl.id,
          sequenceItemId: input.sequenceItemId,
          position,
          title: clean(input.title),
          shortDescription: optional(input.shortDescription),
          plannedDurationMinutes: input.duration,
          status: "draft",
          createdAt: t,
          updatedAt: t,
        });
        await this.db.lessonPlannings.add(emptyPlanning(lessonId, t));
        await this.db.lessonWorkbenchRefs.add({
          id: id(),
          lessonId,
          implementationId: impl.id,
          templateId: template.id,
          classId: impl.classId,
          subjectId: topic.subjectId,
          topicId: topic.id,
          isActive: true,
          createdAt: t,
          updatedAt: t,
        });
        return lessonId;
      },
    );
  }
  async fromSequence(implementationId: string, sequenceItemId: string) {
    const existing = await this.db.lessons
      .where("sequenceItemId")
      .equals(sequenceItemId)
      .first();
    if (existing) return existing.id;
    const seq = await this.db.seriesSequenceItems.get(sequenceItemId);
    if (!seq || seq.implementationId !== implementationId)
      throw new DomainError(
        "LESSON_IMPLEMENTATION_MISMATCH",
        "Gliederungspunkt passt nicht zur Reihe.",
      );
    return this.create({
      implementationId,
      sequenceItemId,
      title: seq.title,
      duration: 45,
    });
  }
  async savePlanning(
    lessonId: string,
    patch: Partial<
      Omit<LessonPlanning, "id" | "lessonId" | "createdAt" | "updatedAt">
    >,
  ) {
    const p = await this.db.lessonPlannings
      .where("lessonId")
      .equals(lessonId)
      .first();
    if (!p)
      throw new DomainError(
        "LESSON_NOT_FOUND",
        "Stundenplanung nicht gefunden.",
      );
    try {
      await this.db.lessonPlannings.update(p.id, {
        ...patch,
        updatedAt: now(),
      });
    } catch {
      throw new DomainError(
        "LESSON_STORAGE_FAILED",
        "Die letzte Änderung konnte lokal nicht gespeichert werden.",
      );
    }
  }
  async addPhase(
    lessonId: string,
    input: { title: string; duration: number; phaseType: PhaseType },
  ) {
    if (input.duration <= 0)
      throw new DomainError(
        "LESSON_INVALID_DURATION",
        "Die Dauer ist ungültig.",
      );
    const t = now();
    await this.db.lessonPhases.add({
      id: id(),
      lessonId,
      position: await this.db.lessonPhases
        .where("lessonId")
        .equals(lessonId)
        .count(),
      title: clean(input.title),
      durationMinutes: input.duration,
      phaseType: input.phaseType,
      optional: false,
      createdAt: t,
      updatedAt: t,
    });
  }
  async reorderPhase(lessonId: string, phaseId: string, direction: -1 | 1) {
    const rows = await this.db.lessonPhases
        .where("lessonId")
        .equals(lessonId)
        .sortBy("position"),
      i = rows.findIndex((v) => v.id === phaseId),
      a = rows[i],
      b = rows[i + direction];
    if (!a)
      throw new DomainError("LESSON_PHASE_NOT_FOUND", "Phase nicht gefunden.");
    if (!b) return;
    await this.db.lessonPhases.bulkPut([
      { ...a, position: b.position, updatedAt: now() },
      { ...b, position: a.position, updatedAt: now() },
    ]);
  }
  async changeStatus(lessonId: string, next: LessonStatus) {
    const lesson = await this.db.lessons.get(lessonId);
    if (!lesson)
      throw new DomainError("LESSON_NOT_FOUND", "Stunde nicht gefunden.");
    if (lesson.archivedAt)
      throw new DomainError("LESSON_ARCHIVED", "Stunde ist archiviert.");
    if (!LESSON_TRANSITIONS[lesson.status].includes(next))
      throw new DomainError(
        "LESSON_INVALID_STATUS_TRANSITION",
        "Dieser Statuswechsel ist nicht möglich.",
      );
    await this.db.lessons.update(lessonId, {
      status: next,
      completedAt: next === "completed" ? now() : lesson.completedAt,
      updatedAt: now(),
    });
  }
  async duplicate(lessonId: string) {
    return this.db.transaction(
      "rw",
      [this.db.lessons, this.db.lessonPlannings, this.db.lessonPhases],
      async () => {
        const lesson = await this.db.lessons.get(lessonId),
          planning = await this.db.lessonPlannings
            .where("lessonId")
            .equals(lessonId)
            .first();
        if (!lesson || !planning)
          throw new DomainError("LESSON_NOT_FOUND", "Stunde nicht gefunden.");
        const newId = id(),
          t = now();
        await this.db.lessons.add({
          ...lesson,
          id: newId,
          sequenceItemId: undefined,
          title: `${lesson.title} – Kopie`,
          position: lesson.position + 1,
          status: "draft",
          createdAt: t,
          updatedAt: t,
          completedAt: undefined,
          archivedAt: undefined,
        });
        await this.db.lessonPlannings.add({
          ...planning,
          id: id(),
          lessonId: newId,
          createdAt: t,
          updatedAt: t,
        });
        const phases = await this.db.lessonPhases
          .where("lessonId")
          .equals(lessonId)
          .toArray();
        await this.db.lessonPhases.bulkAdd(
          phases.map((v) => ({
            ...v,
            id: id(),
            lessonId: newId,
            createdAt: t,
            updatedAt: t,
          })),
        );
        return newId;
      },
    );
  }
  async saveReflection(
    lessonId: string,
    patch: Partial<
      Omit<
        import("./lesson-model").LessonReflection,
        "id" | "lessonId" | "createdAt" | "updatedAt"
      >
    >,
  ) {
    const current = await this.db.lessonReflections
        .where("lessonId")
        .equals(lessonId)
        .first(),
      t = now();
    if (current)
      await this.db.lessonReflections.update(current.id, {
        ...patch,
        updatedAt: t,
      });
    else
      await this.db.lessonReflections.add({
        id: id(),
        lessonId,
        ...patch,
        createdAt: t,
        updatedAt: t,
      });
  }
  async toggleWorkbench(lessonId: string, active: boolean) {
    const r = await this.db.lessonWorkbenchRefs
      .where("lessonId")
      .equals(lessonId)
      .first();
    if (!r) throw new DomainError("LESSON_NOT_FOUND", "Werkbankverweis fehlt.");
    await this.db.lessonWorkbenchRefs.update(r.id, {
      isActive: active,
      updatedAt: now(),
    });
  }
  async updatePhase(
    phaseId: string,
    patch: {
      title?: string;
      durationMinutes?: number;
      phaseType?: PhaseType;
      teacherAction?: string;
      studentAction?: string;
      method?: string;
      socialForm?: string;
      differentiation?: string;
      materialNotes?: string;
      notes?: string;
      optional?: boolean;
    },
  ) {
    const phase = await this.db.lessonPhases.get(phaseId);
    if (!phase)
      throw new DomainError("LESSON_PHASE_NOT_FOUND", "Phase nicht gefunden.");
    if (patch.durationMinutes !== undefined && patch.durationMinutes <= 0)
      throw new DomainError(
        "LESSON_INVALID_DURATION",
        "Die Dauer ist ungültig.",
      );
    await this.db.lessonPhases.update(phaseId, {
      ...patch,
      ...(patch.title !== undefined ? { title: clean(patch.title) } : {}),
      updatedAt: now(),
    });
  }
  async duplicatePhase(phaseId: string) {
    const phase = await this.db.lessonPhases.get(phaseId);
    if (!phase)
      throw new DomainError("LESSON_PHASE_NOT_FOUND", "Phase nicht gefunden.");
    const rows = await this.db.lessonPhases
      .where("lessonId")
      .equals(phase.lessonId)
      .sortBy("position");
    const t = now(),
      copyId = id();
    await this.db.transaction("rw", this.db.lessonPhases, async () => {
      await this.db.lessonPhases.bulkPut(
        rows
          .filter((v) => v.position > phase.position)
          .map((v) => ({ ...v, position: v.position + 1, updatedAt: t })),
      );
      await this.db.lessonPhases.add({
        ...phase,
        id: copyId,
        title: `${phase.title} – Kopie`,
        position: phase.position + 1,
        createdAt: t,
        updatedAt: t,
      });
    });
    return copyId;
  }
  async removePhase(phaseId: string) {
    const phase = await this.db.lessonPhases.get(phaseId);
    if (!phase)
      throw new DomainError("LESSON_PHASE_NOT_FOUND", "Phase nicht gefunden.");
    await this.db.transaction("rw", this.db.lessonPhases, async () => {
      await this.db.lessonPhases.delete(phaseId);
      const rows = await this.db.lessonPhases
        .where("lessonId")
        .equals(phase.lessonId)
        .sortBy("position");
      await this.db.lessonPhases.bulkPut(
        rows.map((v, position) => ({ ...v, position, updatedAt: now() })),
      );
    });
  }
  async reorderLesson(lessonId: string, direction: -1 | 1) {
    const lesson = await this.db.lessons.get(lessonId);
    if (!lesson)
      throw new DomainError("LESSON_NOT_FOUND", "Stunde nicht gefunden.");
    const rows = (
        await this.db.lessons
          .where("implementationId")
          .equals(lesson.implementationId)
          .sortBy("position")
      ).filter((v) => !v.archivedAt),
      i = rows.findIndex((v) => v.id === lessonId),
      other = rows[i + direction];
    if (!other) return;
    await this.db.lessons.bulkPut([
      { ...lesson, position: other.position, updatedAt: now() },
      { ...other, position: lesson.position, updatedAt: now() },
    ]);
  }
  async archiveLesson(lessonId: string) {
    const lesson = await this.db.lessons.get(lessonId);
    if (!lesson)
      throw new DomainError("LESSON_NOT_FOUND", "Stunde nicht gefunden.");
    const t = now();
    await this.db.transaction(
      "rw",
      [this.db.lessons, this.db.lessonWorkbenchRefs],
      async () => {
        await this.db.lessons.update(lessonId, { archivedAt: t, updatedAt: t });
        await this.db.lessonWorkbenchRefs
          .where("lessonId")
          .equals(lessonId)
          .modify({ isActive: false, updatedAt: t });
      },
    );
  }
  async phaseTotal(lessonId: string) {
    return phaseMinutes(
      await this.db.lessonPhases.where("lessonId").equals(lessonId).toArray(),
    );
  }
}
export const lessonService = new LessonService();

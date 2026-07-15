import Dexie, { type EntityTable } from "dexie";
import {
  classSubjectSchema,
  schoolYearSchema,
  subjectSchema,
  teachingClassSchema,
  topicSchema,
  DomainError,
  type ClassSubject,
  type SchoolYear,
  type SubjectDefinition,
  type TeachingClass,
  type Topic,
} from "./model";
import type {
  SeriesTemplate,
  SeriesImplementation,
  SeriesPlanning,
  SeriesSequenceItem,
  SeriesWorkbenchRef,
} from "./series-model";
import type {
  Lesson,
  LessonPlanning,
  LessonPhase,
  LessonReflection,
  LessonWorkbenchRef,
} from "./lesson-model";
import type {CalendarEvent,CalendarEventHistory,TimetablePeriod,WeeklyScheduleSlot} from "./calendar-model";

type Meta = { id: string; value: string };
export class DomainDatabase extends Dexie {
  schoolYears!: EntityTable<SchoolYear, "id">;
  classes!: EntityTable<TeachingClass, "id">;
  subjects!: EntityTable<SubjectDefinition, "id">;
  classSubjects!: EntityTable<ClassSubject, "id">;
  topics!: EntityTable<Topic, "id">;
  meta!: EntityTable<Meta, "id">;
  seriesTemplates!: EntityTable<SeriesTemplate, "id">;
  seriesImplementations!: EntityTable<SeriesImplementation, "id">;
  seriesPlannings!: EntityTable<SeriesPlanning, "id">;
  seriesSequenceItems!: EntityTable<SeriesSequenceItem, "id">;
  seriesWorkbenchRefs!: EntityTable<SeriesWorkbenchRef, "id">;
  lessons!: EntityTable<Lesson, "id">;
  lessonPlannings!: EntityTable<LessonPlanning, "id">;
  lessonPhases!: EntityTable<LessonPhase, "id">;
  lessonReflections!: EntityTable<LessonReflection, "id">;
  lessonWorkbenchRefs!: EntityTable<LessonWorkbenchRef, "id">;
  timetablePeriods!:EntityTable<TimetablePeriod,"id">;
  weeklyScheduleSlots!:EntityTable<WeeklyScheduleSlot,"id">;
  calendarEvents!:EntityTable<CalendarEvent,"id">;
  calendarEventHistory!:EntityTable<CalendarEventHistory,"id">;
  constructor(name = "lehrerkompass-domain") {
    super(name);
    this.version(1).stores({
      schoolYears: "id,isActive,archivedAt",
      classes: "id,schoolYearId,isActive,archivedAt",
      subjects: "id,key,sortOrder",
      classSubjects: "id,classId,subjectId,[classId+subjectId],sortOrder",
      topics: "id,classId,subjectId,[classId+subjectId],status,sortOrder",
      meta: "id",
    });
    this.version(2).stores({
      schoolYears: "id,isActive,archivedAt",
      classes: "id,schoolYearId,isActive,archivedAt",
      subjects: "id,key,sortOrder",
      classSubjects: "id,classId,subjectId,[classId+subjectId],sortOrder",
      topics: "id,classId,subjectId,[classId+subjectId],status,sortOrder",
      meta: "id",
      seriesTemplates: "id,topicId,status,[topicId+title]",
      seriesImplementations: "id,templateId,classId,schoolYearId,status",
      seriesPlannings: "id,implementationId",
      seriesSequenceItems: "id,implementationId,[implementationId+position]",
      seriesWorkbenchRefs: "id,implementationId,isActive",
    });
    this.version(3).stores({
      schoolYears: "id,isActive,archivedAt",
      classes: "id,schoolYearId,isActive,archivedAt",
      subjects: "id,key,sortOrder",
      classSubjects: "id,classId,subjectId,[classId+subjectId],sortOrder",
      topics: "id,classId,subjectId,[classId+subjectId],status,sortOrder",
      meta: "id",
      seriesTemplates: "id,topicId,status,[topicId+title]",
      seriesImplementations: "id,templateId,classId,schoolYearId,status",
      seriesPlannings: "id,implementationId",
      seriesSequenceItems: "id,implementationId,[implementationId+position]",
      seriesWorkbenchRefs: "id,implementationId,isActive",
      lessons:
        "id,implementationId,sequenceItemId,[implementationId+position],status,archivedAt",
      lessonPlannings: "id,lessonId",
      lessonPhases: "id,lessonId,[lessonId+position]",
      lessonReflections: "id,lessonId",
      lessonWorkbenchRefs: "id,lessonId,isActive",
    });
    this.version(4).stores({
      schoolYears:"id,isActive,archivedAt",classes:"id,schoolYearId,isActive,archivedAt",subjects:"id,key,sortOrder",classSubjects:"id,classId,subjectId,[classId+subjectId],sortOrder",topics:"id,classId,subjectId,[classId+subjectId],status,sortOrder",meta:"id",
      seriesTemplates:"id,topicId,status,[topicId+title]",seriesImplementations:"id,templateId,classId,schoolYearId,status",seriesPlannings:"id,implementationId",seriesSequenceItems:"id,implementationId,[implementationId+position]",seriesWorkbenchRefs:"id,implementationId,isActive",
      lessons:"id,implementationId,sequenceItemId,[implementationId+position],status,archivedAt",lessonPlannings:"id,lessonId",lessonPhases:"id,lessonId,[lessonId+position]",lessonReflections:"id,lessonId",lessonWorkbenchRefs:"id,lessonId,isActive",
      timetablePeriods:"id,position,isActive,[startsAt+endsAt]",weeklyScheduleSlots:"id,schoolYearId,weekday,periodId,[schoolYearId+weekday+periodId],status",calendarEvents:"id,schoolYearId,date,periodId,lessonId,status,[date+periodId],archivedAt",calendarEventHistory:"id,eventId,action"
    });
  }
}
export const domainDb = new DomainDatabase("lehrerkompass-domain-v1");
const now = "2026-07-15T09:00:00.000Z";
const subjects = [
  ["deutsch", "Deutsch", "D"],
  ["mathematik", "Mathematik", "M"],
  ["sachunterricht", "Sachunterricht", "SU"],
  ["kunst", "Kunst", "Ku"],
  ["musik", "Musik", "Mu"],
  ["sport", "Sport", "Sp"],
  ["religion", "Religion", "Rel"],
  ["englisch", "Englisch", "E"],
  ["foerderunterricht", "Förderunterricht", "Fö"],
  ["weitere", "Weitere Fächer", "+"],
] as const;
export const SEED_IDS = {
  activeYear: "year-2026",
  oldYear: "year-2025",
  class2a: "class-2a",
  class3a: "class-3a",
  german: "subject-deutsch",
  math: "subject-mathematik",
  topicNouns: "topic-nomen",
};
export async function seedDomain(db = domainDb) {
  if (await db.meta.get("seed-v1")) return;
  await db.transaction(
    "rw",
    [
      db.schoolYears,
      db.classes,
      db.subjects,
      db.classSubjects,
      db.topics,
      db.meta,
    ],
    async () => {
      await db.schoolYears.bulkAdd([
        {
          id: SEED_IDS.oldYear,
          label: "2025/26",
          startsOn: "2025-08-01",
          endsOn: "2026-07-31",
          isActive: false,
          createdAt: now,
          updatedAt: now,
          archivedAt: now,
        },
        {
          id: SEED_IDS.activeYear,
          label: "2026/27",
          startsOn: "2026-08-01",
          endsOn: "2027-07-31",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ]);
      await db.classes.bulkAdd([
        {
          id: "class-old-2a",
          schoolYearId: SEED_IDS.oldYear,
          label: "2a",
          gradeLevel: 2,
          description: "Künstliche Vorjahresklasse",
          isActive: false,
          createdAt: now,
          updatedAt: now,
          archivedAt: now,
        },
        {
          id: SEED_IDS.class2a,
          schoolYearId: SEED_IDS.activeYear,
          label: "2a",
          gradeLevel: 2,
          description: "Künstliche Demonstrationsklasse",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: SEED_IDS.class3a,
          schoolYearId: SEED_IDS.activeYear,
          label: "3a",
          gradeLevel: 3,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ]);
      await db.subjects.bulkAdd(
        subjects.map(([key, label, shortLabel], sortOrder) => ({
          id: `subject-${key}`,
          key,
          label,
          shortLabel,
          iconKey: "book-open",
          sortOrder,
          isSystem: true,
        })),
      );
      const active = [
        "deutsch",
        "mathematik",
        "sachunterricht",
        "kunst",
        "foerderunterricht",
      ];
      await db.classSubjects.bulkAdd(
        active.map((key, sortOrder) => ({
          id: `cs-2a-${key}`,
          classId: SEED_IDS.class2a,
          subjectId: `subject-${key}`,
          isActive: true,
          sortOrder,
          createdAt: now,
          updatedAt: now,
        })),
      );
      const topicData: [[string, string], string[]][] = [
        [
          ["deutsch", "Deutsch"],
          ["Nomen", "Lesen und Textverständnis", "Rechtschreiben"],
        ],
        [
          ["mathematik", "Mathematik"],
          [
            "Zahlenraum bis 100",
            "Addition und Subtraktion",
            "Größen und Messen",
          ],
        ],
        [
          ["sachunterricht", "Sachunterricht"],
          ["Wasser", "Schwimmen und Sinken"],
        ],
        [["kunst", "Kunst"], ["Farben und Farbkreis"]],
      ];
      await db.topics.bulkAdd(
        topicData.flatMap(([[key], titles]) =>
          titles.map((title, sortOrder) => ({
            id:
              title === "Nomen"
                ? SEED_IDS.topicNouns
                : `topic-${key}-${sortOrder}`,
            classId: SEED_IDS.class2a,
            subjectId: `subject-${key}`,
            title,
            sortOrder,
            status: "active" as const,
            createdAt: now,
            updatedAt: now,
          })),
        ),
      );
      await db.meta.add({ id: "seed-v1", value: now });
    },
  );
}
export function validate<T>(
  schema: { safeParse: (v: unknown) => { success: boolean; data?: T } },
  value: unknown,
): T {
  const result = schema.safeParse(value);
  if (!result.success)
    throw new DomainError(
      "DOMAIN_DATA_INVALID",
      "Lokale Fachdaten sind ungültig.",
    );
  return result.data as T;
}
export const validators = {
  schoolYear: schoolYearSchema,
  teachingClass: teachingClassSchema,
  subject: subjectSchema,
  classSubject: classSubjectSchema,
  topic: topicSchema,
};

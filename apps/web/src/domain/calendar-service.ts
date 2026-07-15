import { domainDb, SEED_IDS, type DomainDatabase } from "./database";
import { DomainError, clean, optional } from "./model";
import { DomainService } from "./service";
import { getSeriesSnapshot } from "./series-service";
import { lessonService } from "./lesson-service";
import {
  calendarEventSchema,
  calendarHistorySchema,
  EVENT_TRANSITIONS,
  overlaps,
  timetablePeriodSchema,
  weeklyScheduleSlotSchema,
  type CalendarEventStatus,
} from "./calendar-model";

const now = () => new Date().toISOString(),
  id = () => crypto.randomUUID();
export const CALENDAR_SEED = {
  date: "2026-08-24",
  event: "calendar-event-nomen",
  schoolEvent: "calendar-event-project",
  period: "period-1",
};
const periodSeed = [
  ["1. Stunde", "08:00", "08:45"],
  ["2. Stunde", "08:45", "09:30"],
  ["3. Stunde", "10:00", "10:45"],
  ["4. Stunde", "10:45", "11:30"],
  ["5. Stunde", "11:45", "12:30"],
  ["6. Stunde", "12:30", "13:15"],
] as const;

export class CalendarService {
  constructor(public db: DomainDatabase = domainDb) {}
  async ready() {
    await new DomainService(this.db).ready();
    if (this.db === domainDb) {
      await getSeriesSnapshot();
      await lessonService.snapshot();
    }
    if (await this.db.meta.get("seed-calendar-v4")) return;
    const t = now();
    await this.db.transaction(
      "rw",
      [
        this.db.timetablePeriods,
        this.db.weeklyScheduleSlots,
        this.db.calendarEvents,
        this.db.calendarEventHistory,
        this.db.meta,
      ],
      async () => {
        await this.db.timetablePeriods.bulkAdd(
          periodSeed.map(([label, startsAt, endsAt], position) => ({
            id: `period-${position + 1}`,
            label,
            position,
            startsAt,
            endsAt,
            isActive: true,
            createdAt: t,
            updatedAt: t,
          })),
        );
        await this.db.weeklyScheduleSlots.bulkAdd([
          {
            id: "slot-mon-1",
            schoolYearId: SEED_IDS.activeYear,
            weekday: 1,
            periodId: "period-1",
            classId: SEED_IDS.class2a,
            subjectId: SEED_IDS.german,
            room: "R 2.1",
            status: "active",
            createdAt: t,
            updatedAt: t,
          },
          {
            id: "slot-tue-2",
            schoolYearId: SEED_IDS.activeYear,
            weekday: 2,
            periodId: "period-2",
            classId: SEED_IDS.class2a,
            subjectId: SEED_IDS.math,
            room: "R 2.1",
            status: "active",
            createdAt: t,
            updatedAt: t,
          },
        ]);
        await this.db.calendarEvents.bulkAdd([
          {
            id: CALENDAR_SEED.event,
            schoolYearId: SEED_IDS.activeYear,
            date: CALENDAR_SEED.date,
            periodId: "period-1",
            classId: SEED_IDS.class2a,
            subjectId: SEED_IDS.german,
            lessonId: "lesson-nomen-1",
            title: "Nomen kennenlernen",
            location: "R 2.1",
            eventType: "lesson",
            status: "planned",
            createdAt: t,
            updatedAt: t,
          },
          {
            id: CALENDAR_SEED.schoolEvent,
            schoolYearId: SEED_IDS.activeYear,
            date: "2026-08-26",
            periodId: "period-3",
            title: "Projekttag Lesen",
            location: "Schulbücherei",
            eventType: "school_event",
            status: "planned",
            createdAt: t,
            updatedAt: t,
          },
        ]);
        await this.db.calendarEventHistory.bulkAdd([
          {
            id: "history-seed-lesson",
            eventId: CALENDAR_SEED.event,
            action: "created",
            toDate: CALENDAR_SEED.date,
            toPeriodId: "period-1",
            createdAt: t,
          },
          {
            id: "history-seed-project",
            eventId: CALENDAR_SEED.schoolEvent,
            action: "created",
            toDate: "2026-08-26",
            toPeriodId: "period-3",
            createdAt: t,
          },
        ]);
        await this.db.meta.add({ id: "seed-calendar-v4", value: t });
      },
    );
  }
  async snapshot() {
    await this.ready();
    const [periods, slots, events, history] = await Promise.all([
      this.db.timetablePeriods.toArray(),
      this.db.weeklyScheduleSlots.toArray(),
      this.db.calendarEvents.toArray(),
      this.db.calendarEventHistory.toArray(),
    ]);
    try {
      return {
        periods: periods.map((v) => timetablePeriodSchema.parse(v)),
        slots: slots.map((v) => weeklyScheduleSlotSchema.parse(v)),
        events: events.map((v) => calendarEventSchema.parse(v)),
        history: history.map((v) => calendarHistorySchema.parse(v)),
      };
    } catch {
      throw new DomainError(
        "CALENDAR_DATA_INVALID",
        "Lokale Kalenderdaten sind ungültig.",
      );
    }
  }
  async createPeriod(input: {
    label: string;
    startsAt: string;
    endsAt: string;
  }) {
    if (input.startsAt >= input.endsAt)
      throw new DomainError(
        "CALENDAR_INVALID_TIME",
        "Die Startzeit muss vor der Endzeit liegen.",
      );
    const active = await this.db.timetablePeriods
      .filter((v) => v.isActive)
      .toArray();
    if (
      active.some((v) =>
        overlaps(input.startsAt, input.endsAt, v.startsAt, v.endsAt),
      )
    )
      throw new DomainError(
        "CALENDAR_PERIOD_OVERLAP",
        "Dieser Unterrichtsblock überschneidet sich mit einem aktiven Block.",
      );
    const t = now(),
      value = {
        id: id(),
        label: clean(input.label),
        position: await this.db.timetablePeriods.count(),
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        isActive: true,
        createdAt: t,
        updatedAt: t,
      };
    await this.db.timetablePeriods.add(value);
    return value;
  }
  async updatePeriod(
    periodId: string,
    patch: {
      label?: string;
      startsAt?: string;
      endsAt?: string;
      isActive?: boolean;
    },
  ) {
    const p = await this.db.timetablePeriods.get(periodId);
    if (!p)
      throw new DomainError(
        "CALENDAR_INACTIVE_PERIOD",
        "Unterrichtsblock nicht gefunden.",
      );
    const next = {
      ...p,
      ...patch,
      label: patch.label ? clean(patch.label) : p.label,
    };
    if (next.startsAt >= next.endsAt)
      throw new DomainError(
        "CALENDAR_INVALID_TIME",
        "Die Startzeit muss vor der Endzeit liegen.",
      );
    if (
      next.isActive &&
      (
        await this.db.timetablePeriods
          .filter((v) => v.id !== p.id && v.isActive)
          .toArray()
      ).some((v) => overlaps(next.startsAt, next.endsAt, v.startsAt, v.endsAt))
    )
      throw new DomainError(
        "CALENDAR_PERIOD_OVERLAP",
        "Dieser Unterrichtsblock überschneidet sich mit einem aktiven Block.",
      );
    await this.db.timetablePeriods.update(periodId, {
      ...patch,
      ...(patch.label ? { label: clean(patch.label) } : {}),
      updatedAt: now(),
    });
  }
  async reorderPeriod(periodId: string, direction: -1 | 1) {
    const rows = await this.db.timetablePeriods.orderBy("position").toArray(),
      i = rows.findIndex((v) => v.id === periodId),
      a = rows[i],
      b = rows[i + direction];
    if (!a || !b) return;
    await this.db.timetablePeriods.bulkPut([
      { ...a, position: b.position, updatedAt: now() },
      { ...b, position: a.position, updatedAt: now() },
    ]);
  }
  async createSlot(input: {
    schoolYearId: string;
    weekday: 1 | 2 | 3 | 4 | 5;
    periodId: string;
    classId?: string;
    subjectId?: string;
    label?: string;
    room?: string;
  }) {
    const period = await this.db.timetablePeriods.get(input.periodId);
    if (!period?.isActive)
      throw new DomainError(
        "CALENDAR_INACTIVE_PERIOD",
        "Der Unterrichtsblock ist nicht aktiv.",
      );
    if (
      await this.db.weeklyScheduleSlots
        .where("[schoolYearId+weekday+periodId]")
        .equals([input.schoolYearId, input.weekday, input.periodId])
        .filter((v) => v.status === "active")
        .first()
    )
      throw new DomainError(
        "CALENDAR_SLOT_CONFLICT",
        "Dieser Block ist im Wochenstundenplan bereits belegt.",
      );
    const t = now(),
      value = {
        id: id(),
        ...input,
        label: optional(input.label),
        room: optional(input.room),
        status: "active" as const,
        createdAt: t,
        updatedAt: t,
      };
    await this.db.weeklyScheduleSlots.add(value);
    return value;
  }
  async updateSlot(slotId:string,patch:{status?:"active"|"inactive";classId?:string;subjectId?:string;label?:string;room?:string}){const slot=await this.db.weeklyScheduleSlots.get(slotId);if(!slot)throw new DomainError("CALENDAR_SLOT_CONFLICT","Wochenstunde nicht gefunden.");if(patch.status==="active"&&await this.db.weeklyScheduleSlots.where("[schoolYearId+weekday+periodId]").equals([slot.schoolYearId,slot.weekday,slot.periodId]).filter(v=>v.id!==slot.id&&v.status==="active").first())throw new DomainError("CALENDAR_SLOT_CONFLICT","Dieser Block ist bereits belegt.");await this.db.weeklyScheduleSlots.update(slotId,{...patch,label:optional(patch.label??slot.label),room:optional(patch.room??slot.room),updatedAt:now()})}
  private async validateDate(schoolYearId: string, date: string) {
    const year = await this.db.schoolYears.get(schoolYearId);
    if (!year || date < year.startsOn || date > year.endsOn)
      throw new DomainError(
        "CALENDAR_DATE_OUTSIDE_YEAR",
        "Das Datum liegt außerhalb des Schuljahres.",
      );
  }
  private async validateEventConflict(
    input: {
      date: string;
      periodId?: string;
      startsAt?: string;
      endsAt?: string;
    },
    except?: string,
  ) {
    const events = (
      await this.db.calendarEvents.where("date").equals(input.date).toArray()
    ).filter(
      (v) =>
        v.id !== except &&
        !v.archivedAt &&
        ["planned", "moved"].includes(v.status),
    );
    if (input.periodId && events.some((v) => v.periodId === input.periodId))
      throw new DomainError(
        "CALENDAR_EVENT_CONFLICT",
        "Dieser Unterrichtsblock ist bereits belegt.",
      );
    if (
      input.startsAt &&
      input.endsAt &&
      events.some(
        (v) =>
          v.startsAt &&
          v.endsAt &&
          overlaps(input.startsAt!, input.endsAt!, v.startsAt, v.endsAt),
      )
    )
      throw new DomainError(
        "CALENDAR_EVENT_CONFLICT",
        "Die freie Uhrzeit überschneidet sich mit einem Termin.",
      );
  }
  async createEvent(input: {
    schoolYearId: string;
    date: string;
    periodId?: string;
    startsAt?: string;
    endsAt?: string;
    classId?: string;
    subjectId?: string;
    lessonId?: string;
    title: string;
    location?: string;
    notes?: string;
    eventType: "lesson" | "school_event" | "assessment" | "organization";
  }) {
    await this.validateDate(input.schoolYearId, input.date);
    if (input.startsAt && input.endsAt && input.startsAt >= input.endsAt)
      throw new DomainError(
        "CALENDAR_INVALID_TIME",
        "Die Startzeit muss vor der Endzeit liegen.",
      );
    if (
      input.periodId &&
      !(await this.db.timetablePeriods.get(input.periodId))?.isActive
    )
      throw new DomainError(
        "CALENDAR_INACTIVE_PERIOD",
        "Der Unterrichtsblock ist nicht aktiv.",
      );
    if (input.lessonId) {
      const lesson = await this.db.lessons.get(input.lessonId);
      if (!lesson)
        throw new DomainError(
          "LESSON_NOT_FOUND",
          "Unterrichtsstunde nicht gefunden.",
        );
      const active = await this.db.calendarEvents
        .where("lessonId")
        .equals(input.lessonId)
        .filter((v) => !v.archivedAt && ["planned", "moved"].includes(v.status))
        .first();
      if (active)
        throw new DomainError(
          "CALENDAR_LESSON_ALREADY_SCHEDULED",
          "Diese Unterrichtsstunde ist bereits eingeplant.",
        );
      const impl = await this.db.seriesImplementations.get(
        lesson.implementationId,
      );
      if (
        !impl ||
        impl.schoolYearId !== input.schoolYearId ||
        (input.classId && impl.classId !== input.classId)
      )
        throw new DomainError(
          "CALENDAR_CONTEXT_MISMATCH",
          "Klasse oder Schuljahr passen nicht zur Unterrichtsstunde.",
        );
    }
    await this.validateEventConflict(input);
    const t = now(),
      eventId = id(),
      value = {
        id: eventId,
        ...input,
        title: clean(input.title),
        location: optional(input.location),
        notes: optional(input.notes),
        status: "planned" as const,
        createdAt: t,
        updatedAt: t,
      };
    await this.db.transaction(
      "rw",
      [this.db.calendarEvents, this.db.calendarEventHistory],
      async () => {
        await this.db.calendarEvents.add(value);
        await this.db.calendarEventHistory.add({
          id: id(),
          eventId,
          action: "created",
          toDate: input.date,
          ...(input.periodId ? { toPeriodId: input.periodId } : {}),
          createdAt: t,
        });
      },
    );
    return eventId;
  }
  async moveEvent(
    eventId: string,
    input: {
      date: string;
      periodId?: string;
      startsAt?: string;
      endsAt?: string;
    },
  ) {
    const old = await this.db.calendarEvents.get(eventId);
    if (!old)
      throw new DomainError(
        "CALENDAR_EVENT_NOT_FOUND",
        "Termin nicht gefunden.",
      );
    if (!["planned", "moved"].includes(old.status))
      throw new DomainError(
        "CALENDAR_INVALID_STATUS_TRANSITION",
        "Dieser Termin kann nicht verschoben werden.",
      );
    await this.validateDate(old.schoolYearId, input.date);
    await this.validateEventConflict(input, eventId);
    const t = now(),
      newId = id();
    await this.db.transaction(
      "rw",
      [this.db.calendarEvents, this.db.calendarEventHistory],
      async () => {
      await this.db.calendarEvents.update(old.id, {
        status: "moved",
        archivedAt: t,
        updatedAt: t,
      });
        await this.db.calendarEvents.add({
          ...old,
          id: newId,
          ...input,
          status: "moved",
          movedFromEventId: old.id,
          createdAt: t,
          updatedAt: t,
        });
        await this.db.calendarEventHistory.add({
          id: id(),
          eventId: newId,
          action: "moved",
          fromDate: old.date,
          ...(old.periodId ? { fromPeriodId: old.periodId } : {}),
          toDate: input.date,
          ...(input.periodId ? { toPeriodId: input.periodId } : {}),
          createdAt: t,
        });
      },
    );
    return newId;
  }
  async changeStatus(
    eventId: string,
    next: CalendarEventStatus,
    alsoCompleteLesson = false,
  ) {
    const event = await this.db.calendarEvents.get(eventId);
    if (!event)
      throw new DomainError(
        "CALENDAR_EVENT_NOT_FOUND",
        "Termin nicht gefunden.",
      );
    if (!EVENT_TRANSITIONS[event.status].includes(next))
      throw new DomainError(
        "CALENDAR_INVALID_STATUS_TRANSITION",
        "Dieser Terminstatus kann nicht gesetzt werden.",
      );
    const t = now();
    await this.db.transaction(
      "rw",
      [this.db.calendarEvents, this.db.calendarEventHistory, this.db.lessons],
      async () => {
        await this.db.calendarEvents.update(eventId, {
          status: next,
          updatedAt: t,
        });
        await this.db.calendarEventHistory.add({
          id: id(),
          eventId,
          action: next === "cancelled" ? "cancelled" : "completed",
          createdAt: t,
        });
        if (alsoCompleteLesson && next === "completed" && event.lessonId) {
          const lesson = await this.db.lessons.get(event.lessonId);
          if (lesson && ["ready", "needs_revision"].includes(lesson.status))
            await this.db.lessons.update(lesson.id, {
              status: "completed",
              completedAt: t,
              updatedAt: t,
            });
        }
      },
    );
  }
  async unscheduledLessons() {
    const lessons = (await this.db.lessons.toArray()).filter(
        (v) =>
          !v.archivedAt && ["draft", "planning", "ready"].includes(v.status),
      ),
      active = new Set(
        (
          await this.db.calendarEvents
            .filter(
              (v) =>
                !v.archivedAt &&
                ["planned", "moved"].includes(v.status) &&
                Boolean(v.lessonId),
            )
            .toArray()
        ).map((v) => v.lessonId),
      );
    return lessons.filter((v) => !active.has(v.id)).slice(0, 4);
  }
  async dayOverview(date: string, substitute = false) {
    const events = (
        await this.db.calendarEvents.where("date").equals(date).toArray()
      ).filter((v) => !v.archivedAt && v.status !== "moved"),
      periods = await this.db.timetablePeriods.toArray();
    const rows = [];
    for (const event of events) {
      const lesson = event.lessonId
          ? await this.db.lessons.get(event.lessonId)
          : undefined,
        planning = lesson
          ? await this.db.lessonPlannings
              .where("lessonId")
              .equals(lesson.id)
              .first()
          : undefined,
        phases = lesson
          ? await this.db.lessonPhases
              .where("lessonId")
              .equals(lesson.id)
              .sortBy("position")
          : [],
        c = event.classId
          ? await this.db.classes.get(event.classId)
          : undefined,
        subject = event.subjectId
          ? await this.db.subjects.get(event.subjectId)
          : undefined,
        impl = lesson
          ? await this.db.seriesImplementations.get(lesson.implementationId)
          : undefined,
        template = impl
          ? await this.db.seriesTemplates.get(impl.templateId)
          : undefined,
        topic = template
          ? await this.db.topics.get(template.topicId)
          : undefined;
      rows.push({
        eventId: event.id,
        time:
          periods.find((v) => v.id === event.periodId)?.startsAt ??
          event.startsAt ??
          "",
        classLabel: c?.label,
        subjectLabel: subject?.label,
        topic: topic?.title,
        title: event.title,
        status: event.status,
        lessonGoal: planning?.lessonGoal,
        phases: phases.map((v) => `${v.title} (${v.durationMinutes} Min.)`),
        materialNeeds: planning?.materialNeeds,
        preparation: planning?.preparation,
        homework: planning?.homework,
        organizational: substitute ? undefined : event.notes,
      });
    }
    return rows;
  }
}
export const calendarService = new CalendarService();

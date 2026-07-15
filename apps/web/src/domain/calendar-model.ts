import { z } from "zod";

const iso = z.string().datetime(),
  date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
export const WEEKDAYS = [1, 2, 3, 4, 5] as const;
export const EVENT_TYPES = [
  "lesson",
  "school_event",
  "assessment",
  "organization",
] as const;
export const EVENT_STATUSES = [
  "planned",
  "completed",
  "cancelled",
  "moved",
] as const;
export type CalendarEventStatus = (typeof EVENT_STATUSES)[number];
export const EVENT_STATUS_LABELS: Record<CalendarEventStatus, string> = {
  planned: "Geplant",
  completed: "Durchgeführt",
  cancelled: "Ausgefallen",
  moved: "Verschoben",
};
export const EVENT_TRANSITIONS: Record<
  CalendarEventStatus,
  readonly CalendarEventStatus[]
> = {
  planned: ["completed", "cancelled", "moved"],
  moved: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export const timetablePeriodSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  position: z.number().int().nonnegative(),
  startsAt: time,
  endsAt: time,
  isActive: z.boolean(),
  createdAt: iso,
  updatedAt: iso,
});
export const weeklyScheduleSlotSchema = z.object({
  id: z.string().min(1),
  schoolYearId: z.string().min(1),
  weekday: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  periodId: z.string().min(1),
  classId: z.string().optional(),
  subjectId: z.string().optional(),
  label: z.string().optional(),
  room: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  createdAt: iso,
  updatedAt: iso,
});
export const calendarEventSchema = z.object({
  id: z.string().min(1),
  schoolYearId: z.string().min(1),
  date,
  periodId: z.string().optional(),
  startsAt: time.optional(),
  endsAt: time.optional(),
  classId: z.string().optional(),
  subjectId: z.string().optional(),
  lessonId: z.string().optional(),
  title: z.string().min(1),
  location: z.string().optional(),
  notes: z.string().optional(),
  eventType: z.enum(EVENT_TYPES),
  status: z.enum(EVENT_STATUSES),
  movedFromEventId: z.string().optional(),
  createdAt: iso,
  updatedAt: iso,
  archivedAt: iso.optional(),
});
export const calendarHistorySchema = z.object({
  id: z.string().min(1),
  eventId: z.string().min(1),
  action: z.enum(["created", "moved", "cancelled", "completed"]),
  fromDate: date.optional(),
  fromPeriodId: z.string().optional(),
  toDate: date.optional(),
  toPeriodId: z.string().optional(),
  createdAt: iso,
});
export type TimetablePeriod = z.infer<typeof timetablePeriodSchema>;
export type WeeklyScheduleSlot = z.infer<typeof weeklyScheduleSlotSchema>;
export type CalendarEvent = z.infer<typeof calendarEventSchema>;
export type CalendarEventHistory = z.infer<typeof calendarHistorySchema>;

export function overlaps(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
) {
  return aStart < bEnd && bStart < aEnd;
}
export function weekdayOf(value: string) {
  const day = new Date(`${value}T12:00:00`).getDay();
  return day === 0 ? 7 : day;
}
export function nextSchoolDay(value: string, direction: -1 | 1) {
  const d = new Date(`${value}T12:00:00`);
  do d.setDate(d.getDate() + direction);
  while ([0, 6].includes(d.getDay()));
  return d.toISOString().slice(0, 10);
}

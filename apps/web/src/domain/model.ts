import { z } from "zod";

export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const isoTime = z.string().datetime();
export const schoolYearSchema = z.object({ id:z.string().min(1), label:z.string().min(1), startsOn:isoDate, endsOn:isoDate, isActive:z.boolean(), createdAt:isoTime, updatedAt:isoTime, archivedAt:isoTime.optional() });
export const teachingClassSchema = z.object({ id:z.string().min(1), schoolYearId:z.string().min(1), label:z.string().min(1), gradeLevel:z.union([z.literal(1),z.literal(2),z.literal(3),z.literal(4)]), description:z.string().optional(), isActive:z.boolean(), createdAt:isoTime, updatedAt:isoTime, archivedAt:isoTime.optional() });
export const subjectSchema = z.object({ id:z.string().min(1), key:z.string().min(1), label:z.string().min(1), shortLabel:z.string().min(1), iconKey:z.string().min(1), sortOrder:z.number().int(), isSystem:z.boolean() });
export const classSubjectSchema = z.object({ id:z.string().min(1), classId:z.string().min(1), subjectId:z.string().min(1), isActive:z.boolean(), sortOrder:z.number().int(), createdAt:isoTime, updatedAt:isoTime });
export const topicSchema = z.object({ id:z.string().min(1), classId:z.string().min(1), subjectId:z.string().min(1), title:z.string().min(1), description:z.string().optional(), sortOrder:z.number().int(), status:z.enum(["active","archived"]), createdAt:isoTime, updatedAt:isoTime, archivedAt:isoTime.optional() });
export type SchoolYear=z.infer<typeof schoolYearSchema>; export type TeachingClass=z.infer<typeof teachingClassSchema>; export type SubjectDefinition=z.infer<typeof subjectSchema>; export type ClassSubject=z.infer<typeof classSubjectSchema>; export type Topic=z.infer<typeof topicSchema>;
export type GradeLevel=TeachingClass["gradeLevel"];
export const GRADE_LEVELS=[1,2,3,4] as const;
export function clean(value:string){return value.trim().replace(/\s+/g," ");}
export function optional(value?:string){const v=clean(value??""); return v||undefined;}

export const ERROR_CODES=["SCHOOL_YEAR_INVALID_RANGE","SCHOOL_YEAR_NOT_FOUND","CLASS_DUPLICATE_LABEL","CLASS_NOT_FOUND","CLASS_ARCHIVED","SUBJECT_NOT_FOUND","CLASS_SUBJECT_NOT_ACTIVE","TOPIC_DUPLICATE_TITLE","TOPIC_NOT_FOUND","TOPIC_ARCHIVED","DOMAIN_DATA_INVALID"] as const;
export type DomainErrorCode=(typeof ERROR_CODES)[number]|"SERIES_TEMPLATE_NOT_FOUND"|"SERIES_TEMPLATE_DUPLICATE_TITLE"|"SERIES_TEMPLATE_ARCHIVED"|"SERIES_IMPLEMENTATION_NOT_FOUND"|"SERIES_IMPLEMENTATION_ARCHIVED"|"SERIES_INVALID_STATUS_TRANSITION"|"SERIES_CLASS_TOPIC_MISMATCH"|"SERIES_INVALID_DATE_RANGE"|"SERIES_SEQUENCE_ITEM_NOT_FOUND"|"SERIES_DATA_INVALID"|"LESSON_NOT_FOUND"|"LESSON_ARCHIVED"|"LESSON_CANCELLED"|"LESSON_DUPLICATE_SEQUENCE_LINK"|"LESSON_INVALID_STATUS_TRANSITION"|"LESSON_IMPLEMENTATION_MISMATCH"|"LESSON_PHASE_NOT_FOUND"|"LESSON_INVALID_DURATION"|"LESSON_STORAGE_FAILED"|"LESSON_DATA_INVALID"|"CALENDAR_PERIOD_OVERLAP"|"CALENDAR_SLOT_CONFLICT"|"CALENDAR_EVENT_CONFLICT"|"CALENDAR_LESSON_ALREADY_SCHEDULED"|"CALENDAR_DATE_OUTSIDE_YEAR"|"CALENDAR_INVALID_TIME"|"CALENDAR_INACTIVE_PERIOD"|"CALENDAR_EVENT_NOT_FOUND"|"CALENDAR_INVALID_STATUS_TRANSITION"|"CALENDAR_CONTEXT_MISMATCH"|"CALENDAR_PRIVATE_EVENT"|"CALENDAR_DATA_INVALID";
export class DomainError extends Error { constructor(public code:DomainErrorCode,message:string){super(message);this.name="DomainError";} }

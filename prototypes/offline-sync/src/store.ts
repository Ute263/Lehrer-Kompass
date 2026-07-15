import { Dexie, type EntityTable } from "dexie";
import { z } from "zod";

export const SyncStatusSchema = z.enum(["lokal gespeichert", "ausstehend", "synchronisiert", "Konflikt", "fehlgeschlagen"]);
export type SyncStatus = z.infer<typeof SyncStatusSchema>;

export const LessonSchema = z.object({
  id: z.string(), title: z.string(), learningGoal: z.string(), duration: z.number().int().positive(),
  notes: z.string(), version: z.number().int().nonnegative(), status: SyncStatusSchema, updatedAt: z.string()
});
export type Lesson = z.infer<typeof LessonSchema>;

export interface QueueEntry { id?: number; lessonId: string; expectedVersion: number; createdAt: string }
export interface VersionConflict { lessonId: string; local: Lesson; server: Lesson }

export class OfflineDatabase extends Dexie {
  lessons!: EntityTable<Lesson, "id">;
  queue!: EntityTable<QueueEntry, "id">;
  conflicts!: EntityTable<VersionConflict, "lessonId">;

  constructor(name: string) {
    super(name);
    this.version(1).stores({ lessons: "id,status", queue: "++id,lessonId", conflicts: "lessonId" });
  }
}

export interface LessonServer {
  get(id: string): Promise<Lesson | undefined>;
  save(lesson: Lesson, expectedVersion: number): Promise<Lesson | { conflict: Lesson }>;
}

export class MemoryLessonServer implements LessonServer {
  private readonly data = new Map<string, Lesson>();
  online = true;

  seed(lesson: Lesson): void { this.data.set(lesson.id, structuredClone(lesson)); }
  async get(id: string): Promise<Lesson | undefined> { return structuredClone(this.data.get(id)); }
  async save(lesson: Lesson, expectedVersion: number): Promise<Lesson | { conflict: Lesson }> {
    if (!this.online) throw new Error("offline");
    const existing = this.data.get(lesson.id);
    if (existing && existing.version !== expectedVersion) return { conflict: structuredClone(existing) };
    const saved = LessonSchema.parse({ ...lesson, version: expectedVersion + 1, status: "synchronisiert", updatedAt: new Date().toISOString() });
    this.data.set(saved.id, saved);
    return structuredClone(saved);
  }
}

export class OfflineLessonService {
  constructor(readonly db: OfflineDatabase, readonly server: LessonServer) {}

  async edit(id: string, patch: Partial<Pick<Lesson, "notes" | "duration" | "learningGoal">>): Promise<Lesson> {
    const current = await this.db.lessons.get(id);
    if (!current) throw new Error("lesson missing");
    const local = LessonSchema.parse({ ...current, ...patch, status: "lokal gespeichert", updatedAt: new Date().toISOString() });
    await this.db.lessons.put(local);
    await this.db.queue.add({ lessonId: id, expectedVersion: current.version, createdAt: new Date().toISOString() });
    await this.db.lessons.update(id, { status: "ausstehend" });
    return (await this.db.lessons.get(id))!;
  }

  async sync(): Promise<void> {
    const entries = await this.db.queue.orderBy("id").toArray();
    for (const entry of entries) {
      const local = await this.db.lessons.get(entry.lessonId);
      if (!local) continue;
      try {
        const result = await this.server.save(local, entry.expectedVersion);
        if ("conflict" in result) {
          await this.db.conflicts.put({ lessonId: local.id, local: { ...local, status: "Konflikt" }, server: result.conflict });
          await this.db.lessons.update(local.id, { status: "Konflikt" });
        } else {
          await this.db.lessons.put(result);
          await this.db.queue.delete(entry.id!);
        }
      } catch {
        await this.db.lessons.update(local.id, { status: "fehlgeschlagen" });
      }
    }
  }
}

export const demoLesson: Lesson = LessonSchema.parse({
  id: "lesson-nomen-1", title: "Nomen mit Artikeln erkennen", learningGoal: "Nomen erkennen und passende Artikel zuordnen.",
  duration: 45, notes: "Künstliche Demo-Stunde", version: 1, status: "synchronisiert", updatedAt: "2026-07-15T08:00:00.000Z"
});

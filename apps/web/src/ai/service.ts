import type { DomainDatabase } from "../domain";
import {
  domainDb,
  lessonService as defaultLessonService,
  materialService as defaultMaterialService,
  LessonService,
  MaterialService,
} from "../domain";
import { capabilityFor } from "./capabilities";
import { buildBuddyContext, buddyContextPolicy } from "./context";
import {
  mockBuddyAdapter,
  preparedOpenAIAdapter,
  type BuddyAdapter,
} from "./adapters";
import {
  BuddyError,
  buddyRequestSchema,
  buddySuggestionChangeSchema,
  buddySuggestionSchema,
  buddyVersionSchema,
  changeSchema,
  suggestionPayloadSchema,
  type BuddyCapabilityKey,
  type BuddyChangeOperation,
  type BuddySourceReference,
  type BuddyTargetType,
} from "./contracts";
const id = () => crypto.randomUUID(),
  now = () => new Date().toISOString();
export class BuddyService {
  lesson: LessonService;
  material: MaterialService;
  constructor(public db: DomainDatabase = domainDb) {
    this.lesson =
      db === domainDb ? defaultLessonService : new LessonService(db);
    this.material =
      db === domainDb ? defaultMaterialService : new MaterialService(db);
  }
  async generate(input: {
    capabilityKey: BuddyCapabilityKey;
    targetType: BuddyTargetType;
    targetId: string;
    freeInstruction?: string;
    sources?: BuddySourceReference[];
    adapter?: "mock" | "openai";
  }) {
    const adapter: BuddyAdapter =
      input.adapter === "openai" ? preparedOpenAIAdapter : mockBuddyAdapter;
    buddyContextPolicy.assertAllowed(input.capabilityKey, input.targetType);
    if (
      input.freeInstruction &&
      buddyContextPolicy.detectInjection(input.freeInstruction)
    )
      throw new BuddyError(
        "BUDDY_PROMPT_INJECTION_DETECTED",
        "Die Anfrage enthält eine Anweisung, die Schutzregeln überschreiben würde.",
      );
    const built = await buildBuddyContext(
        this.db,
        input.capabilityKey,
        input.targetType,
        input.targetId,
        input.sources ?? [],
      ),
      requestId = id(),
      createdAt = now();
    await this.db.buddyRequests.add(
      buddyRequestSchema.parse({
        id: requestId,
        capabilityKey: input.capabilityKey,
        targetType: input.targetType,
        targetId: input.targetId,
        contextSummary: `Verwendet: ${built.used.join(", ")}. Ausgeschlossen: ${built.excluded.join(", ")}.`,
        adapterType: adapter.type,
        status: "pending",
        createdAt,
      }),
    );
    try {
      const raw = await adapter.generate({
          capabilityKey: input.capabilityKey,
          context: built.context,
          ...(input.freeInstruction
            ? { freeInstruction: input.freeInstruction }
            : {}),
        }),
        payload = suggestionPayloadSchema.parse(raw),
        suggestionId = id();
      await this.db.transaction(
        "rw",
        [
          this.db.buddyRequests,
          this.db.buddySuggestions,
          this.db.buddySuggestionChanges,
        ],
        async () => {
          await this.db.buddySuggestions.add(
            buddySuggestionSchema.parse({
              id: suggestionId,
              requestId,
              capabilityKey: input.capabilityKey,
              targetType: input.targetType,
              targetId: input.targetId,
              baseUpdatedAt: built.baseUpdatedAt,
              summary: payload.summary,
              ...(payload.rationale ? { rationale: payload.rationale } : {}),
              sourcesUsed: payload.sourcesUsed,
              uncertainties: [
                ...payload.uncertainties,
                ...built.safetyWarnings,
              ],
              safeguards: payload.safeguards,
              status: "generated",
              createdAt,
            }),
          );
          await this.db.buddySuggestionChanges.bulkAdd(
            payload.changes.map((operation, position) =>
              buddySuggestionChangeSchema.parse({
                id: id(),
                suggestionId,
                position,
                operation,
                selected: true,
                applied: false,
              }),
            ),
          );
          await this.db.buddyRequests.update(requestId, {
            status: "completed",
            completedAt: now(),
          });
        },
      );
      return suggestionId;
    } catch (error) {
      const code =
        error instanceof BuddyError ? error.code : "BUDDY_OUTPUT_INVALID";
      await this.db.buddyRequests.update(requestId, {
        status: "failed",
        completedAt: now(),
        errorCode: code,
      });
      if (error instanceof BuddyError) throw error;
      throw new BuddyError(
        code,
        "Der Vorschlag konnte nicht erstellt werden. Deine Planung wurde nicht verändert.",
      );
    }
  }
  async suggestion(idValue: string) {
    const suggestion = buddySuggestionSchema.parse(
        await this.db.buddySuggestions.get(idValue),
      ),
      changes = (
        await this.db.buddySuggestionChanges
          .where("suggestionId")
          .equals(idValue)
          .sortBy("position")
      ).map((v) => buddySuggestionChangeSchema.parse(v));
    return { suggestion, changes };
  }
  async setSelected(changeId: string, selected: boolean) {
    await this.db.buddySuggestionChanges.update(changeId, { selected });
  }
  async discard(suggestionId: string) {
    const s = await this.db.buddySuggestions.get(suggestionId);
    if (!s)
      throw new BuddyError("BUDDY_DATA_INVALID", "Vorschlag nicht gefunden.");
    await this.db.transaction(
      "rw",
      [this.db.buddySuggestions, this.db.buddyRequests],
      async () => {
        await this.db.buddySuggestions.update(suggestionId, {
          status: "discarded",
        });
        await this.db.buddyRequests.update(s.requestId, {
          status: "discarded",
        });
      },
    );
  }
  async targetUpdatedAt(type: BuddyTargetType, targetId: string) {
    if (type.startsWith("lesson")) {
      const lesson = await this.db.lessons.get(targetId);
      if (!lesson)
        throw new BuddyError(
          "BUDDY_TARGET_CHANGED",
          "Die Stunde ist nicht mehr verfügbar.",
        );
      const p = await this.db.lessonPlannings
          .where("lessonId")
          .equals(targetId)
          .first(),
        phases = await this.db.lessonPhases
          .where("lessonId")
          .equals(targetId)
          .toArray(),
        r = await this.db.lessonReflections
          .where("lessonId")
          .equals(targetId)
          .first();
      return [
        lesson.updatedAt,
        p?.updatedAt,
        ...phases.map((v) => v.updatedAt),
        r?.updatedAt,
      ]
        .filter(Boolean)
        .sort()
        .at(-1)!;
    }
    if (type.startsWith("material")) {
      const m = await this.db.materials.get(targetId);
      if (!m)
        throw new BuddyError(
          "BUDDY_TARGET_CHANGED",
          "Das Material ist nicht mehr verfügbar.",
        );
      const d = await this.db.materialDocuments
          .where("materialId")
          .equals(targetId)
          .first(),
        pages = d
          ? await this.db.materialPages
              .where("documentId")
              .equals(d.id)
              .toArray()
          : [],
        blocks = (
          await Promise.all(
            pages.map((p) =>
              this.db.materialBlocks.where("pageId").equals(p.id).toArray(),
            ),
          )
        ).flat();
      return [m.updatedAt, ...blocks.map((v) => v.updatedAt)].sort().at(-1)!;
    }
    if (type === "series_implementation" || type === "series_planning") {
      const implementation = await this.db.seriesImplementations.get(targetId), planning = await this.db.seriesPlannings.where("implementationId").equals(targetId).first();
      if (!implementation) throw new BuddyError("BUDDY_TARGET_CHANGED", "Die Reihe ist nicht mehr verfügbar.");
      return [implementation.updatedAt, planning?.updatedAt].filter(Boolean).sort().at(-1)!;
    }
    throw new BuddyError(
      "BUDDY_TARGET_NOT_SUPPORTED",
      "Ziel wird nicht unterstützt.",
    );
  }
  async snapshot(type: BuddyTargetType, targetId: string) {
    if (type.startsWith("lesson")) {
      const lesson = await this.db.lessons.get(targetId),
        planning = await this.db.lessonPlannings
          .where("lessonId")
          .equals(targetId)
          .first(),
        phases = await this.db.lessonPhases
          .where("lessonId")
          .equals(targetId)
          .toArray(),
        reflection = await this.db.lessonReflections
          .where("lessonId")
          .equals(targetId)
          .first();
      return { lesson, planning, phases, reflection };
    }
    if (type.startsWith("material")) return this.material.materialSnapshot(targetId);
    return { implementation: await this.db.seriesImplementations.get(targetId), planning: await this.db.seriesPlannings.where("implementationId").equals(targetId).first() };
  }
  async apply(suggestionId: string, selectedIds?: string[]) {
    const { suggestion, changes } = await this.suggestion(suggestionId);
    if (
      suggestion.status !== "generated" &&
      suggestion.status !== "partially_applied"
    )
      throw new BuddyError(
        "BUDDY_APPLY_CONFLICT",
        "Dieser Vorschlag kann nicht mehr übernommen werden.",
      );
    if (
      (await this.targetUpdatedAt(
        suggestion.targetType,
        suggestion.targetId,
      )) !== suggestion.baseUpdatedAt
    )
      throw new BuddyError(
        "BUDDY_TARGET_CHANGED",
        "Das Ziel wurde seit dem Vorschlag verändert. Bitte vergleiche oder erzeuge den Vorschlag neu.",
      );
    const selected = changes.filter(
      (v) =>
        !v.applied && (selectedIds ? selectedIds.includes(v.id) : v.selected),
    );
    if (!selected.length)
      throw new BuddyError(
        "BUDDY_APPLY_CONFLICT",
        "Wähle mindestens eine Änderung aus.",
      );
    const versionId = id();
    await this.db.buddyVersions.add(
      buddyVersionSchema.parse({
        id: versionId,
        targetType: suggestion.targetType,
        targetId: suggestion.targetId,
        suggestionId,
        snapshot: JSON.stringify(
          await this.snapshot(suggestion.targetType, suggestion.targetId),
        ),
        createdAt: now(),
      }),
    );
    try {
      await this.db.transaction(
        "rw",
        [
          this.db.lessonPlannings,
          this.db.lessonPhases,
          this.db.lessonReflections,
          this.db.materialBlocks,
          this.db.materialSolutions,
          this.db.materialVersions,
          this.db.buddySuggestions,
          this.db.buddySuggestionChanges,
        ],
        async () => {
          for (const row of selected)
            await this.applyOperation(
              suggestion.targetId,
              changeSchema.parse(row.operation),
            );
          await this.db.buddySuggestionChanges.bulkPut(
            selected.map((v) => ({ ...v, applied: true })),
          );
          const remaining = changes.some(
            (v) => !v.applied && !selected.some((s) => s.id === v.id),
          );
          await this.db.buddySuggestions.update(suggestionId, {
            status: remaining ? "partially_applied" : "applied",
            appliedAt: now(),
          });
        },
      );
      return versionId;
    } catch {
      throw new BuddyError(
        "BUDDY_APPLY_FAILED",
        "Die Änderungen konnten nicht übernommen werden. Der vorherige Stand blieb erhalten.",
      );
    }
  }
  private async applyOperation(targetId: string, op: BuddyChangeOperation) {
    switch (op.type) {
      case "replace_field":
        if (op.fieldPath.startsWith("lessonPlanning.")) {
          const field = op.fieldPath.split(".")[1] as
            "lessonGoal" | "differentiation";
          await this.lesson.savePlanning(targetId, { [field]: op.newValue });
        } else {
          const field = op.fieldPath.split(".")[1] as
            "workedWell" | "challenges" | "nextTimeChange";
          await this.lesson.saveReflection(targetId, { [field]: op.newValue });
        }
        break;
      case "update_lesson_phase":
        await this.lesson.updatePhase(op.phaseId, {
          ...(op.changes.durationMinutes !== undefined ? { durationMinutes: op.changes.durationMinutes } : {}),
          ...(op.changes.title !== undefined ? { title: op.changes.title } : {}),
          ...(op.changes.teacherAction !== undefined ? { teacherAction: op.changes.teacherAction } : {}),
          ...(op.changes.studentAction !== undefined ? { studentAction: op.changes.studentAction } : {}),
        });
        break;
      case "update_material_task":
        await this.material.updateBlock(op.blockId, op.changes);
        break;
      case "add_material_variant_plan":
      case "advisory_note":
        break;
      default:
        throw new BuddyError(
          "BUDDY_APPLY_CONFLICT",
          "Unbekannte Änderungsoperation.",
        );
    }
  }
  async rollback(versionId: string) {
    const v = buddyVersionSchema.parse(
        await this.db.buddyVersions.get(versionId),
      ),
      snap = JSON.parse(v.snapshot);
    if (v.targetType.startsWith("lesson")) {
      await this.db.transaction(
        "rw",
        [
          this.db.lessons,
          this.db.lessonPlannings,
          this.db.lessonPhases,
          this.db.lessonReflections,
        ],
        async () => {
          if (snap.lesson) await this.db.lessons.put(snap.lesson);
          if (snap.planning) await this.db.lessonPlannings.put(snap.planning);
          await this.db.lessonPhases
            .where("lessonId")
            .equals(v.targetId)
            .delete();
          await this.db.lessonPhases.bulkAdd(snap.phases);
          await this.db.lessonReflections
            .where("lessonId")
            .equals(v.targetId)
            .delete();
          if (snap.reflection)
            await this.db.lessonReflections.add(snap.reflection);
        },
      );
    } else {
      const mv = await this.db.materialVersions
        .where("materialId")
        .equals(v.targetId)
        .last();
      if (mv) await this.material.restoreVersion(mv.id);
      else
        throw new BuddyError(
          "BUDDY_APPLY_FAILED",
          "Materialversion nicht verfügbar.",
        );
    }
  }
  async history(type: BuddyTargetType, targetId: string) {
    return this.db.buddySuggestions
      .where("targetId")
      .equals(targetId)
      .filter((v) => v.targetType === type)
      .reverse()
      .sortBy("createdAt");
  }
  async clearHistory(type: BuddyTargetType, targetId: string) {
    const suggestions = await this.db.buddySuggestions
        .where("targetId")
        .equals(targetId)
        .filter((v) => v.targetType === type)
        .toArray(),
      ids = suggestions.map((v) => v.id),
      requests = suggestions.map((v) => v.requestId);
    await this.db.transaction(
      "rw",
      [
        this.db.buddySuggestions,
        this.db.buddySuggestionChanges,
        this.db.buddyRequests,
      ],
      async () => {
        await this.db.buddySuggestionChanges
          .where("suggestionId")
          .anyOf(ids)
          .delete();
        await this.db.buddySuggestions.bulkDelete(ids);
        await this.db.buddyRequests.bulkDelete(requests);
      },
    );
  }
}
export const buddyService = new BuddyService();

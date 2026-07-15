import type { DomainDatabase } from "../domain";
import { layoutIssues } from "../domain";
import {
  BuddyError,
  contextSchema,
  type BuddyCapabilityKey,
  type BuddyContext,
  type BuddySourceReference,
  type BuddyTargetType,
} from "./contracts";
import { capabilityFor } from "./capabilities";
const sensitive =
  /\b(?:diagnose|diagnosis|kind(?:er)?name|schülername|adhs|autismus|passwort|token|api[-_ ]?key)\b/i;
const injection =
  /ignoriere\s+(?:alle\s+)?(?:bisherigen\s+)?regeln|lösche\s+(?:die\s+)?stunde|system(?:prompt|regel)|offenlege\s+secrets/i;
export class BuddyContextPolicy {
  sanitize(value: string | undefined) {
    if (!value) return undefined;
    return sensitive.test(value)
      ? "[Sensible Angabe entfernt]"
      : value.slice(0, 1200);
  }
  filterSources(sources: BuddySourceReference[]) {
    return sources
      .filter((v) => v.aiUsageAllowed)
      .map((v) => ({ ...v, excerpt: this.sanitize(v.excerpt) }));
  }
  detectInjection(value: string) {
    return injection.test(value);
  }
  assertAllowed(key: BuddyCapabilityKey, type: BuddyTargetType) {
    const c = capabilityFor(key);
    if (!c)
      throw new BuddyError(
        "BUDDY_CAPABILITY_NOT_FOUND",
        "Diese Buddy-Fähigkeit ist nicht verfügbar.",
      );
    if (!c.allowedTargetTypes.includes(type))
      throw new BuddyError(
        "BUDDY_TARGET_NOT_SUPPORTED",
        "Diese Fähigkeit passt nicht zum aktuellen Arbeitskontext.",
      );
  }
}
export const buddyContextPolicy = new BuddyContextPolicy();
export async function buildBuddyContext(
  db: DomainDatabase,
  key: BuddyCapabilityKey,
  type: BuddyTargetType,
  id: string,
  sources: BuddySourceReference[] = [],
): Promise<{
  context: BuddyContext;
  baseUpdatedAt: string;
  used: string[];
  excluded: string[];
  safetyWarnings: string[];
}> {
  buddyContextPolicy.assertAllowed(key, type);
  const cap = capabilityFor(key)!;
  const allowed = new Set(cap.allowedContextSections),
    warnings: string[] = [];
  for (const s of sources)
    if (buddyContextPolicy.detectInjection(s.excerpt ?? ""))
      warnings.push(
        "Eingebettete Anweisung wurde als nicht vertrauenswürdiger Quellentext erkannt.",
      );
  if (type.startsWith("lesson")) {
    const lesson =
      (await db.lessons.get(id)) ??
      (type === "lesson_phase"
        ? (await db.lessonPhases.get(id)) &&
          (await db.lessons.get((await db.lessonPhases.get(id))!.lessonId))
        : undefined);
    if (!lesson)
      throw new BuddyError(
        "BUDDY_CONTEXT_DENIED",
        "Die Unterrichtsstunde ist nicht verfügbar.",
      );
    const planning = await db.lessonPlannings
        .where("lessonId")
        .equals(lesson.id)
        .first(),
      phases = await db.lessonPhases
        .where("lessonId")
        .equals(lesson.id)
        .sortBy("position"),
      reflection = await db.lessonReflections
        .where("lessonId")
        .equals(lesson.id)
        .first(),
      impl = await db.seriesImplementations.get(lesson.implementationId),
      template = impl && (await db.seriesTemplates.get(impl.templateId)),
      topic = template && (await db.topics.get(template.topicId)),
      klass = impl && (await db.classes.get(impl.classId)),
      subject = topic && (await db.subjects.get(topic.subjectId));
    const context: BuddyContext = {
      target: { type, id: lesson.id, title: lesson.title },
      ...(allowed.has("class")
        ? {
            classContext: {
              gradeLevel: klass?.gradeLevel,
              classLabel: klass?.label,
            },
          }
        : {}),
      ...(allowed.has("subject")
        ? {
            subjectContext: {
              subjectLabel: subject?.label,
              topicTitle: topic?.title,
            },
          }
        : {}),
      ...(allowed.has("series")
        ? {
            seriesContext: {
              templateTitle: template?.title,
              implementationTitle: impl?.titleOverride,
              planningSummary: buddyContextPolicy.sanitize(
                (
                  await db.seriesPlannings
                    .where("implementationId")
                    .equals(lesson.implementationId)
                    .first()
                )?.goalsAndCompetencies,
              ),
            },
          }
        : {}),
      ...(allowed.has("lesson")
        ? {
            lessonContext: {
              title: lesson.title,
              plannedDurationMinutes: lesson.plannedDurationMinutes,
              lessonGoal: buddyContextPolicy.sanitize(planning?.lessonGoal),
              differentiation: buddyContextPolicy.sanitize(
                planning?.differentiation,
              ),
              materialNeeds: buddyContextPolicy.sanitize(
                planning?.materialNeeds,
              ),
              ...(allowed.has("phases")
                ? {
                    phases: phases.map((p) => ({
                      id: p.id,
                      title: p.title,
                      durationMinutes: p.durationMinutes,
                      phaseType: p.phaseType,
                    })),
                  }
                : {}),
            },
          }
        : {}),
      ...(allowed.has("reflection") && reflection
        ? {
            reflectionContext: {
              workedWell: buddyContextPolicy.sanitize(reflection.workedWell),
              challenges: buddyContextPolicy.sanitize(reflection.challenges),
              nextTimeChange: buddyContextPolicy.sanitize(
                reflection.nextTimeChange,
              ),
              actualDurationMinutes: reflection.actualDurationMinutes,
            },
          }
        : {}),
      sourceContext: buddyContextPolicy.filterSources(sources),
    };
    return {
      context: contextSchema.parse(context),
      baseUpdatedAt: [
        lesson.updatedAt,
        planning?.updatedAt,
        ...phases.map((p) => p.updatedAt),
        reflection?.updatedAt,
      ]
        .filter(Boolean)
        .sort()
        .at(-1)!,
      used: [...allowed].filter((v) => v !== "sources"),
      excluded: [
        "Kindernamen",
        "Diagnosen",
        "private Notizen",
        ...(allowed.has("reflection") ? [] : ["persönliche Reflexion"]),
        "andere Materialien",
      ],
      safetyWarnings: warnings,
    };
  }
  if (type.startsWith("material")) {
    const material = await db.materials.get(id);
    if (!material)
      throw new BuddyError(
        "BUDDY_CONTEXT_DENIED",
        "Das Material ist nicht verfügbar.",
      );
    const variant = await db.materialVariants
        .where("materialId")
        .equals(id)
        .first(),
      doc = await db.materialDocuments.where("materialId").equals(id).first(),
      pages = doc
        ? await db.materialPages.where("documentId").equals(doc.id).toArray()
        : [],
      blocks = (
        await Promise.all(
          pages.map((p) =>
            db.materialBlocks.where("pageId").equals(p.id).toArray(),
          ),
        )
      ).flat(),
      solutions = await db.materialSolutions.toArray(),
      klass = material.classId
        ? await db.classes.get(material.classId)
        : undefined,
      subject = material.subjectId
        ? await db.subjects.get(material.subjectId)
        : undefined,
      topic = material.topicId
        ? await db.topics.get(material.topicId)
        : undefined;
    const context: BuddyContext = {
      target: { type, id, title: material.title },
      ...(allowed.has("class")
        ? {
            classContext: {
              gradeLevel: klass?.gradeLevel,
              classLabel: klass?.label,
            },
          }
        : {}),
      ...(allowed.has("subject")
        ? {
            subjectContext: {
              subjectLabel: subject?.label,
              topicTitle: topic?.title,
            },
          }
        : {}),
      materialContext: {
        title: material.title,
        materialType: material.materialType,
        variantLabel: variant?.label,
        tasks: blocks
          .filter((b) => b.blockType === "task")
          .map((b) => ({
            id: b.id,
            instruction: buddyContextPolicy.sanitize(b.instruction),
            prompt: buddyContextPolicy.sanitize(b.prompt),
          })),
        layoutWarnings: layoutIssues(blocks, solutions).map((v) => v.message),
      },
      sourceContext: buddyContextPolicy.filterSources(sources),
    };
    return {
      context: contextSchema.parse(context),
      baseUpdatedAt: [material.updatedAt, ...blocks.map((b) => b.updatedAt)]
        .sort()
        .at(-1)!,
      used: [...allowed],
      excluded: [
        "Kindernamen",
        "Diagnosen",
        "andere Materialien",
        "persönliche Reflexion",
      ],
      safetyWarnings: warnings,
    };
  }
  if (type === "series_implementation" || type === "series_planning") {
    const implementation = await db.seriesImplementations.get(id);
    if (!implementation)
      throw new BuddyError("BUDDY_CONTEXT_DENIED", "Die Unterrichtsreihe ist nicht verfügbar.");
    const template = await db.seriesTemplates.get(implementation.templateId),
      planning = await db.seriesPlannings.where("implementationId").equals(id).first(),
      topic = template ? await db.topics.get(template.topicId) : undefined,
      klass = await db.classes.get(implementation.classId),
      subject = topic ? await db.subjects.get(topic.subjectId) : undefined;
    const context: BuddyContext = {
      target: { type, id, title: implementation.titleOverride ?? template?.title ?? "Unterrichtsreihe" },
      classContext: { gradeLevel: klass?.gradeLevel, classLabel: klass?.label },
      subjectContext: { subjectLabel: subject?.label, topicTitle: topic?.title },
      seriesContext: { templateTitle: template?.title, implementationTitle: implementation.titleOverride, planningSummary: buddyContextPolicy.sanitize(planning?.goalsAndCompetencies) },
      sourceContext: buddyContextPolicy.filterSources(sources),
    };
    return { context: contextSchema.parse(context), baseUpdatedAt: [implementation.updatedAt, planning?.updatedAt].filter(Boolean).sort().at(-1)!, used: ["class", "subject", "series"], excluded: ["Kindernamen", "Diagnosen", "persönliche Reflexion", "Materialinhalte"], safetyWarnings: warnings };
  }
  throw new BuddyError(
    "BUDDY_TARGET_NOT_SUPPORTED",
    "Dieser Arbeitskontext ist noch nicht unterstützt.",
  );
}

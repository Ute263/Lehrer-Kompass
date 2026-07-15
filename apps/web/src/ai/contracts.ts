import { z } from "zod";

export const BUDDY_TARGET_TYPES = [
  "series_implementation",
  "series_planning",
  "lesson",
  "lesson_planning",
  "lesson_phase",
  "lesson_reflection",
  "material",
  "material_document",
  "material_task",
] as const;
export const BUDDY_CAPABILITY_KEYS = [
  "shorten_lesson",
  "structure_lesson",
  "formulate_lesson_goal",
  "show_other_perspective",
  "suggest_differentiation",
  "simplify_instruction",
  "create_support_variant_plan",
  "create_challenge_variant_plan",
  "check_material_quality",
  "reflect_lesson",
] as const;
export type BuddyTargetType = (typeof BUDDY_TARGET_TYPES)[number];
export type BuddyCapabilityKey = (typeof BUDDY_CAPABILITY_KEYS)[number];
export type BuddyContextSection =
  | "class"
  | "subject"
  | "series"
  | "lesson"
  | "phases"
  | "material"
  | "tasks"
  | "reflection"
  | "sources";
export type BuddyApplyStrategy =
  | "lesson_planning"
  | "lesson_phases"
  | "lesson_reflection"
  | "material_task"
  | "advisory";

export const sourceSchema = z.object({
  id: z.string(),
  type: z.enum([
    "lesson_context",
    "series_context",
    "material_context",
    "school_source",
    "teacher_experience",
    "general_model_knowledge",
  ]),
  title: z.string(),
  excerpt: z.string().optional(),
  trusted: z.boolean(),
  aiUsageAllowed: z.boolean(),
});
export type BuddySourceReference = z.infer<typeof sourceSchema>;
export const contextSchema = z.object({
  target: z.object({
    type: z.enum(BUDDY_TARGET_TYPES),
    id: z.string(),
    title: z.string(),
  }),
  classContext: z
    .object({
      gradeLevel: z.number().optional(),
      classLabel: z.string().optional(),
    })
    .optional(),
  subjectContext: z
    .object({
      subjectLabel: z.string().optional(),
      topicTitle: z.string().optional(),
    })
    .optional(),
  seriesContext: z
    .object({
      templateTitle: z.string().optional(),
      implementationTitle: z.string().optional(),
      planningSummary: z.string().optional(),
    })
    .optional(),
  lessonContext: z
    .object({
      title: z.string().optional(),
      plannedDurationMinutes: z.number().optional(),
      lessonGoal: z.string().optional(),
      phases: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
            durationMinutes: z.number(),
            phaseType: z.string(),
          }),
        )
        .optional(),
      differentiation: z.string().optional(),
      materialNeeds: z.string().optional(),
    })
    .optional(),
  materialContext: z
    .object({
      title: z.string().optional(),
      materialType: z.string().optional(),
      variantLabel: z.string().optional(),
      tasks: z
        .array(
          z.object({
            id: z.string(),
            instruction: z.string().optional(),
            prompt: z.string().optional(),
          }),
        )
        .optional(),
      layoutWarnings: z.array(z.string()).optional(),
    })
    .optional(),
  reflectionContext: z
    .object({
      workedWell: z.string().optional(),
      challenges: z.string().optional(),
      nextTimeChange: z.string().optional(),
      actualDurationMinutes: z.number().optional(),
    })
    .optional(),
  sourceContext: z.array(sourceSchema).optional(),
});
export type BuddyContext = z.infer<typeof contextSchema>;

export const changeSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("replace_field"),
    fieldPath: z.enum([
      "lessonPlanning.lessonGoal",
      "lessonPlanning.differentiation",
      "lessonReflection.workedWell",
      "lessonReflection.challenges",
      "lessonReflection.nextTimeChange",
    ]),
    oldValue: z.string(),
    newValue: z.string(),
    reason: z.string(),
  }),
  z.object({
    type: z.literal("update_lesson_phase"),
    phaseId: z.string(),
    changes: z.object({
      durationMinutes: z.number().int().positive().optional(),
      title: z.string().optional(),
      teacherAction: z.string().optional(),
      studentAction: z.string().optional(),
    }),
    reason: z.string(),
  }),
  z.object({
    type: z.literal("update_material_task"),
    blockId: z.string(),
    changes: z.object({
      instruction: z.string().optional(),
      prompt: z.string().optional(),
    }),
    reason: z.string(),
  }),
  z.object({
    type: z.literal("add_material_variant_plan"),
    variantType: z.enum(["support", "challenge"]),
    proposedChanges: z.array(
      z.object({
        blockId: z.string().optional(),
        description: z.string(),
        help: z.string().optional(),
        additionalRequirement: z.string().optional(),
      }),
    ),
    reason: z.string(),
  }),
  z.object({
    type: z.literal("advisory_note"),
    title: z.string(),
    content: z.string(),
    reason: z.string(),
  }),
]);
export type BuddyChangeOperation = z.infer<typeof changeSchema>;
export const suggestionPayloadSchema = z.object({
  summary: z.string().min(1),
  rationale: z.string().optional(),
  changes: z.array(changeSchema).min(1),
  sourcesUsed: z.array(sourceSchema),
  uncertainties: z.array(z.string()),
  safeguards: z.array(z.string()).min(1),
});
export type BuddySuggestionPayload = z.infer<typeof suggestionPayloadSchema>;

export const buddyRequestSchema = z.object({
  id: z.string(),
  capabilityKey: z.enum(BUDDY_CAPABILITY_KEYS),
  targetType: z.enum(BUDDY_TARGET_TYPES),
  targetId: z.string(),
  contextSummary: z.string(),
  adapterType: z.enum(["mock", "openai"]),
  status: z.enum(["pending", "completed", "failed", "discarded"]),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  errorCode: z.string().optional(),
});
export const buddySuggestionSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  capabilityKey: z.enum(BUDDY_CAPABILITY_KEYS),
  targetType: z.enum(BUDDY_TARGET_TYPES),
  targetId: z.string(),
  baseUpdatedAt: z.string().datetime(),
  summary: z.string(),
  rationale: z.string().optional(),
  sourcesUsed: z.array(sourceSchema),
  uncertainties: z.array(z.string()),
  safeguards: z.array(z.string()),
  status: z.enum([
    "generated",
    "partially_applied",
    "applied",
    "discarded",
    "invalid",
  ]),
  createdAt: z.string().datetime(),
  appliedAt: z.string().datetime().optional(),
});
export const buddySuggestionChangeSchema = z.object({
  id: z.string(),
  suggestionId: z.string(),
  position: z.number().int().nonnegative(),
  operation: changeSchema,
  selected: z.boolean(),
  applied: z.boolean(),
});
export const buddyVersionSchema = z.object({
  id: z.string(),
  targetType: z.enum(BUDDY_TARGET_TYPES),
  targetId: z.string(),
  suggestionId: z.string(),
  snapshot: z.string(),
  createdAt: z.string().datetime(),
});
export type BuddyRequestRecord = z.infer<typeof buddyRequestSchema>;
export type BuddySuggestionRecord = z.infer<typeof buddySuggestionSchema>;
export type BuddySuggestionChange = z.infer<typeof buddySuggestionChangeSchema>;
export type BuddyVersion = z.infer<typeof buddyVersionSchema>;

export class BuddyError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

import { z, type ZodSchema } from "zod";
import type {
  BuddyApplyStrategy,
  BuddyCapabilityKey,
  BuddyContextSection,
  BuddyTargetType,
} from "./contracts";
import { suggestionPayloadSchema } from "./contracts";
export interface BuddyCapabilityDefinition<
  TInput = unknown,
  TOutput = unknown,
> {
  key: BuddyCapabilityKey;
  title: string;
  description: string;
  group:
    | "Struktur"
    | "Ideen"
    | "Zeit"
    | "Differenzierung"
    | "Material"
    | "Qualität"
    | "Reflexion";
  allowedTargetTypes: BuddyTargetType[];
  inputSchema: ZodSchema<TInput>;
  outputSchema: ZodSchema<TOutput>;
  modelProfile: "fast" | "standard" | "deep";
  requiresVersionBeforeApply: boolean;
  allowedContextSections: BuddyContextSection[];
  applyStrategy: BuddyApplyStrategy;
}
const input = z.object({ freeInstruction: z.string().max(500).optional() });
const lesson: BuddyTargetType[] = ["lesson", "lesson_planning", "lesson_phase"];
const material: BuddyTargetType[] = [
  "material",
  "material_document",
  "material_task",
];
const make = (
  key: BuddyCapabilityKey,
  title: string,
  description: string,
  group: BuddyCapabilityDefinition["group"],
  allowedTargetTypes: BuddyTargetType[],
  modelProfile: BuddyCapabilityDefinition["modelProfile"],
  allowedContextSections: BuddyContextSection[],
  applyStrategy: BuddyApplyStrategy,
  requiresVersionBeforeApply = true,
): BuddyCapabilityDefinition => ({
  key,
  title,
  description,
  group,
  allowedTargetTypes,
  inputSchema: input,
  outputSchema: suggestionPayloadSchema,
  modelProfile,
  requiresVersionBeforeApply,
  allowedContextSections,
  applyStrategy,
});
export const BUDDY_CAPABILITIES = [
  make(
    "shorten_lesson",
    "Stunde kürzen",
    "Zeit reduzieren und Lernziel sowie Sicherung erhalten.",
    "Zeit",
    lesson,
    "standard",
    ["class", "subject", "series", "lesson", "phases"],
    "lesson_phases",
  ),
  make(
    "structure_lesson",
    "Stunde strukturieren",
    "Vorhandene Notizen didaktisch ordnen.",
    "Struktur",
    lesson,
    "standard",
    ["class", "subject", "series", "lesson", "phases"],
    "lesson_phases",
  ),
  make(
    "formulate_lesson_goal",
    "Lernziel formulieren",
    "Aktivität und Lernziel klar unterscheiden.",
    "Struktur",
    lesson,
    "standard",
    ["class", "subject", "series", "lesson"],
    "lesson_planning",
  ),
  make(
    "show_other_perspective",
    "Andere Sichtweise",
    "Alternative mit Chancen und Grenzen anbieten.",
    "Ideen",
    [...lesson, "series_implementation", "series_planning"],
    "deep",
    ["class", "subject", "series", "lesson", "phases"],
    "advisory",
    false,
  ),
  make(
    "suggest_differentiation",
    "Differenzierung vorschlagen",
    "Basis-, Standard- und Plus-Zugänge ohne Etikettierung.",
    "Differenzierung",
    lesson,
    "standard",
    ["class", "subject", "series", "lesson", "phases"],
    "lesson_planning",
  ),
  make(
    "simplify_instruction",
    "Arbeitsauftrag vereinfachen",
    "Kurze Kindersprache bei gleichem Fachinhalt.",
    "Material",
    material,
    "fast",
    ["class", "subject", "material", "tasks"],
    "material_task",
  ),
  make(
    "create_support_variant_plan",
    "Fördervariantenplan",
    "Konkrete Hilfen für eine bewusste spätere Variante.",
    "Differenzierung",
    material,
    "standard",
    ["class", "subject", "material", "tasks"],
    "advisory",
  ),
  make(
    "create_challenge_variant_plan",
    "Fordervariantenplan",
    "Qualitativ anspruchsvollere Erweiterungen planen.",
    "Differenzierung",
    material,
    "standard",
    ["class", "subject", "material", "tasks"],
    "advisory",
  ),
  make(
    "check_material_quality",
    "Materialqualität prüfen",
    "Fachlich-sprachliche Hinweise getrennt von Technik.",
    "Qualität",
    material,
    "standard",
    ["class", "subject", "material", "tasks"],
    "advisory",
    false,
  ),
  make(
    "reflect_lesson",
    "Reflexion strukturieren",
    "Vorhandene Notizen ordnen und nächste Änderung herausarbeiten.",
    "Reflexion",
    ["lesson", "lesson_reflection"],
    "standard",
    ["lesson", "reflection"],
    "lesson_reflection",
  ),
] as const;
export const capabilityFor = (key: string) =>
  BUDDY_CAPABILITIES.find((v) => v.key === key);
export const capabilitiesFor = (type: BuddyTargetType) =>
  BUDDY_CAPABILITIES.filter((v) => v.allowedTargetTypes.includes(type));
export const MODEL_PROFILES = {
  fast: { providerProfile: "fast" },
  standard: { providerProfile: "standard" },
  deep: { providerProfile: "deep" },
} as const;

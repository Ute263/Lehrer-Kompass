import { z } from "zod";
import { appError } from "../../shared/error.js";

const PhaseSchema = z.object({ id: z.string(), title: z.string(), minutes: z.number().int().positive(), content: z.string(), protected: z.boolean() });
export const LessonSchema = z.object({ id: z.string(), title: z.string(), learningGoal: z.string(), version: z.number().int(), phases: z.array(PhaseSchema) });
export type Lesson = z.infer<typeof LessonSchema>;

export const ProposalSchema = z.object({
  id: z.string(), lessonId: z.string(), summary: z.string(), targetMinutes: z.literal(45),
  changes: z.array(z.object({ phaseId: z.string(), oldMinutes: z.number().int(), newMinutes: z.number().int(), reason: z.string() })),
  sourcesUsed: z.array(z.object({ label: z.string(), kind: z.enum(["provided", "model-knowledge"]) })),
  uncertainties: z.array(z.string()), status: z.literal("Vorschlag")
});
export type Proposal = z.infer<typeof ProposalSchema>;

export const demoLesson: Lesson = LessonSchema.parse({
  id: "lesson-52", title: "Nomen mit Artikeln erkennen", learningGoal: "Nomen erkennen und passende Artikel zuordnen.", version: 3,
  phases: [
    { id: "start", title: "Einstieg", minutes: 8, content: "Nomen im Klassenraum sammeln", protected: false },
    { id: "learn", title: "Erarbeitung", minutes: 20, content: "Artikel zuordnen und begründen", protected: false },
    { id: "practice", title: "Übung", minutes: 16, content: "Vier Aufgaben bearbeiten", protected: false },
    { id: "secure", title: "Sicherung", minutes: 8, content: "Lernziel gemeinsam sichern", protected: true }
  ]
});

export interface BuddyAdapter { shortenLesson(lesson: Lesson, targetMinutes: 45, untrustedSources: string[]): Promise<Proposal>; }

export class MockBuddyAdapter implements BuddyAdapter {
  async shortenLesson(lessonInput: Lesson, targetMinutes: 45, untrustedSources: string[]): Promise<Proposal> {
    const lesson = LessonSchema.parse(lessonInput);
    const malicious = untrustedSources.some((source) => /ignore|system|lösche|secret|regel/i.test(source));
    return ProposalSchema.parse({
      id: "proposal-short-45", lessonId: lesson.id,
      summary: "Einstieg und Übungsphase werden gestrafft; Lernziel und Sicherung bleiben vollständig erhalten.", targetMinutes,
      changes: [
        { phaseId: "start", oldMinutes: 8, newMinutes: 6, reason: "Direkter Einstieg mit zwei statt vier Beispielen." },
        { phaseId: "practice", oldMinutes: 16, newMinutes: 11, reason: "Aufgabenmenge reduzieren, ohne das Lernziel zu verändern." }
      ],
      sourcesUsed: [],
      uncertainties: malicious ? ["Eine nicht vertrauenswürdige Quelle enthielt eine Anweisungsmanipulation und wurde nicht befolgt."] : ["Die tatsächliche Lerngruppendynamik ist unbekannt."],
      status: "Vorschlag"
    });
  }
}

export class OpenAiBuddyAdapter implements BuddyAdapter {
  async shortenLesson(_lesson: Lesson, _targetMinutes: 45, _untrustedSources: string[]): Promise<Proposal> {
    throw appError("OPENAI_NOT_CONFIGURED", "Echter serverseitiger OpenAI-Aufruf ist ohne Zugangsdaten blockiert.");
  }
}

export interface AppliedProposal { versionBeforeChange: Lesson; lesson: Lesson; appliedPhaseIds: string[] }

export function applyProposalPartially(originalInput: Lesson, proposalInput: Proposal, selectedPhaseIds: string[]): AppliedProposal {
  const original = LessonSchema.parse(originalInput);
  const proposal = ProposalSchema.parse(proposalInput);
  const selected = new Set(selectedPhaseIds);
  const changes = new Map(proposal.changes.filter((change) => selected.has(change.phaseId)).map((change) => [change.phaseId, change]));
  const lesson = LessonSchema.parse({ ...original, version: original.version + 1, phases: original.phases.map((phase) => {
    const change = changes.get(phase.id);
    return change ? { ...phase, minutes: change.newMinutes } : phase;
  }) });
  return { versionBeforeChange: structuredClone(original), lesson, appliedPhaseIds: [...changes.keys()] };
}


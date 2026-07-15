import {
  suggestionPayloadSchema,
  type BuddyCapabilityKey,
  type BuddyContext,
  type BuddySuggestionPayload,
  BuddyError,
} from "./contracts";
export interface BuddyAdapter {
  type: "mock" | "openai";
  generate(input: {
    capabilityKey: BuddyCapabilityKey;
    context: BuddyContext;
    freeInstruction?: string;
  }): Promise<unknown>;
}
const safe = [
  "Vorschlag – keine automatische Änderung.",
  "Keine Diagnose, Benotung oder Kalenderänderung.",
];
export class MockBuddyAdapter implements BuddyAdapter {
  type = "mock" as const;
  async generate({
    capabilityKey: key,
    context: c,
    freeInstruction,
  }: Parameters<BuddyAdapter["generate"]>[0]) {
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (freeInstruction?.includes("[adapter-error]"))
      throw new BuddyError(
        "BUDDY_REQUEST_TIMEOUT",
        "Der lokale Testadapter hat einen Fehler simuliert.",
      );
    const lesson = c.lessonContext,
      phase =
        lesson?.phases?.find((p) => p.phaseType !== "consolidation") ??
        lesson?.phases?.[0],
      secondPhase = lesson?.phases?.find((p) => p.id !== phase?.id && p.phaseType !== "consolidation"),
      task = c.materialContext?.tasks?.[0];
    let payload: BuddySuggestionPayload;
    switch (key) {
      case "shorten_lesson":
        payload = {
          summary: "Die Stunde lässt sich um fünf Minuten kürzen.",
          rationale: "Lernziel und Sicherung bleiben erhalten.",
          changes: phase
            ? [
                {
                  type: "update_lesson_phase",
                  phaseId: phase.id,
                  changes: {
                    durationMinutes: Math.max(1, phase.durationMinutes - (secondPhase ? 3 : 5)),
                  },
                  reason:
                    "Diese Phase bietet den klarsten zeitlichen Spielraum.",
                },
                ...(secondPhase ? [{ type: "update_lesson_phase" as const, phaseId: secondPhase.id, changes: { durationMinutes: Math.max(1, secondPhase.durationMinutes - 2) }, reason: "Eine zweite kleine Kürzung verteilt die Anpassung." }] : []),
              ]
            : [
                {
                  type: "advisory_note",
                  title: "Zeit prüfen",
                  content: "Es fehlen Phasen für eine konkrete Kürzung.",
                  reason: "Kontext ist unvollständig.",
                },
              ],
          sourcesUsed: [],
          uncertainties: [],
          safeguards: safe,
        };
        break;
      case "formulate_lesson_goal":
        payload = {
          summary: "Präziser Lernzielvorschlag",
          rationale:
            "Die beobachtbare Leistung wird von der Aktivität getrennt.",
          changes: [
            {
              type: "replace_field",
              fieldPath: "lessonPlanning.lessonGoal",
              oldValue: lesson?.lessonGoal ?? "",
              newValue:
                "Die Kinder erkennen Nomen in kurzen Sätzen und ordnen ihnen den passenden Artikel zu.",
              reason:
                "Das Ziel beschreibt eine beobachtbare fachliche Leistung.",
            },
          ],
          sourcesUsed: [],
          uncertainties: lesson?.lessonGoal
            ? [
                "Die konkrete Erfolgsschwelle bleibt von der Lehrkraft festzulegen.",
              ]
            : [],
          safeguards: safe,
        };
        break;
      case "suggest_differentiation":
        payload = {
          summary: "Drei Zugänge bei gemeinsamem Lernziel",
          changes: [
            {
              type: "replace_field",
              fieldPath: "lessonPlanning.differentiation",
              oldValue: lesson?.differentiation ?? "",
              newValue:
                "Basis: Artikelkarten und markierte Nomen. Standard: selbstständig zuordnen und begründen. Plus: Zweifelsfälle vergleichen und eigene Beispiele entwickeln.",
              reason:
                "Die Zugänge variieren Hilfe und Denktiefe statt Kinder zu etikettieren.",
            },
          ],
          sourcesUsed: [],
          uncertainties: ["Passung zur Lerngruppe bitte prüfen."],
          safeguards: safe,
        };
        break;
      case "simplify_instruction":
        payload = {
          summary: "Arbeitsauftrag in kurze Schritte gegliedert",
          changes: task
            ? [
                {
                  type: "update_material_task",
                  blockId: task.id,
                  changes: {
                    instruction:
                      "Lies die Wörter. Schreibe der, die oder das davor.",
                  },
                  reason: "Kurze Sätze erhalten den fachlichen Auftrag.",
                },
              ]
            : [
                {
                  type: "advisory_note",
                  title: "Keine Aufgabe gefunden",
                  content: "Eine konkrete Aufgabe ist erforderlich.",
                  reason: "Kein Aufgabenblock im Kontext.",
                },
              ],
          sourcesUsed: [],
          uncertainties: [],
          safeguards: safe,
        };
        break;
      case "create_support_variant_plan":
      case "create_challenge_variant_plan":
        payload = {
          summary: key.includes("support")
            ? "Plan für eine unterstützende Variante"
            : "Plan für eine vertiefende Variante",
          changes: [
            {
              type: "add_material_variant_plan",
              variantType: key.includes("support") ? "support" : "challenge",
              proposedChanges: [
                {
                  blockId: task?.id,
                  description: key.includes("support")
                    ? "Arbeitsauftrag in zwei Schritte teilen und Artikelkarten anbieten."
                    : "Begründungen und eigene Gegenbeispiele ergänzen.",
                  help: key.includes("support")
                    ? "Visuelle Artikelkarten"
                    : undefined,
                  additionalRequirement: key.includes("challenge")
                    ? "Eigene Zweifelsfälle erklären"
                    : undefined,
                },
              ],
              reason:
                "Die Variante wird nur geplant, nicht automatisch erzeugt.",
            },
          ],
          sourcesUsed: [],
          uncertainties: [
            "Die spätere Variante muss bewusst erstellt und geprüft werden.",
          ],
          safeguards: safe,
        };
        break;
      case "reflect_lesson":
        payload = {
          summary:
            "Reflexionsnotizen nach Beobachtung und nächstem Schritt geordnet",
          changes: [
            {
              type: "replace_field",
              fieldPath: "lessonReflection.nextTimeChange",
              oldValue: c.reflectionContext?.nextTimeChange ?? "",
              newValue:
                "Beim nächsten Mal die Erarbeitung früher beenden und fünf Minuten für die Sicherung reservieren.",
              reason: "Die nächste konkrete Planungsänderung wird sichtbar.",
            },
          ],
          sourcesUsed: [],
          uncertainties: [
            "Nur vorhandene Notizen und Zeitangaben wurden berücksichtigt.",
          ],
          safeguards: [...safe, "Keine Änderung der Stammreihe."],
        };
        break;
      case "check_material_quality":
        payload = {
          summary: "Fachlich-sprachliche Materialprüfung",
          changes: [
            {
              type: "advisory_note",
              title: "Aufgabenverständlichkeit",
              content:
                "Arbeitsauftrag, erwartete Antwort und verfügbarer Schreibraum sollten gemeinsam geprüft werden.",
              reason:
                "Dieser Hinweis ergänzt die getrennte technische Layoutprüfung.",
            },
          ],
          sourcesUsed: [],
          uncertainties: ["Keine Aussage über eine konkrete Lerngruppe."],
          safeguards: [
            ...safe,
            "Technische Prüfungen aus Paket 08 bleiben getrennt.",
          ],
        };
        break;
      case "show_other_perspective":
        payload = {
          summary: "Alternative methodische Sichtweise",
          changes: [
            {
              type: "advisory_note",
              title: "Vom Sortieren zum Begründen",
              content:
                "Die Kinder könnten zuerst Beispiele sortieren und ihre Regel anschließend gemeinsam formulieren. Chance: stärkeres Entdecken. Grenze: benötigt mehr Gesprächszeit.",
              reason: "Alternative ohne Abwertung der bestehenden Planung.",
            },
          ],
          sourcesUsed: [],
          uncertainties: ["Zeitbedarf hängt von der Lerngruppe ab."],
          safeguards: safe,
        };
        break;
      default:
        payload = {
          summary: "Vorhandene Planung strukturieren",
          changes: [
            {
              type: "advisory_note",
              title: "Offene Struktur",
              content:
                "Einstieg, Erarbeitung und Sicherung aus den vorhandenen Notizen kenntlich machen; fehlende Angaben offenlassen.",
              reason: "Es werden keine fehlenden Inhalte erfunden.",
            },
          ],
          sourcesUsed: [],
          uncertainties: ["Einzelne Planungsschritte sind noch offen."],
          safeguards: safe,
        };
    }
    return suggestionPayloadSchema.parse(payload);
  }
}
export class PreparedOpenAIAdapter implements BuddyAdapter {
  type = "openai" as const;
  async generate() {
    throw new BuddyError(
      "BUDDY_NOT_CONFIGURED",
      "Echte KI ist nicht konfiguriert. Der sichere Backend-Endpunkt ist nur vorbereitet.",
    );
  }
}
export const mockBuddyAdapter = new MockBuddyAdapter();
export const preparedOpenAIAdapter = new PreparedOpenAIAdapter();

import { suggestionPayloadSchema, type BuddyCapabilityKey, type BuddyContext, type BuddySuggestionPayload, BuddyError } from "./contracts";

export interface BuddyAdapter {
  type: "mock" | "openai";
  generate(input: { capabilityKey: BuddyCapabilityKey; context: BuddyContext; freeInstruction?: string }): Promise<unknown>;
}

const safeguards = ["Vorschlag – keine automatische Änderung.", "Keine Diagnose, Benotung oder Kalenderänderung."];

export class MockBuddyAdapter implements BuddyAdapter {
  type = "mock" as const;
  async generate({ capabilityKey:key, context:c, freeInstruction }: Parameters<BuddyAdapter["generate"]>[0]) {
    await new Promise(resolve=>setTimeout(resolve,30));
    if(freeInstruction?.includes("[adapter-error]")) throw new BuddyError("BUDDY_REQUEST_TIMEOUT","Der lokale Testadapter hat einen Fehler simuliert.");
    const lesson=c.lessonContext, phase=lesson?.phases?.find(p=>p.phaseType!=="consolidation")??lesson?.phases?.[0], second=lesson?.phases?.find(p=>p.id!==phase?.id&&p.phaseType!=="consolidation"), task=c.materialContext?.tasks?.[0];
    let payload:BuddySuggestionPayload;
    switch(key){
      case "shorten_lesson": payload={summary:"Die Stunde lässt sich um fünf Minuten kürzen.",rationale:"Lernziel und Sicherung bleiben erhalten.",changes:phase?[{type:"update_lesson_phase",phaseId:phase.id,changes:{durationMinutes:Math.max(1,phase.durationMinutes-(second?3:5))},reason:"Diese Phase bietet den klarsten zeitlichen Spielraum."},...(second?[{type:"update_lesson_phase" as const,phaseId:second.id,changes:{durationMinutes:Math.max(1,second.durationMinutes-2)},reason:"Eine zweite kleine Kürzung verteilt die Anpassung."}]:[])]:[{type:"advisory_note",title:"Zeit prüfen",content:"Es fehlen Phasen für eine konkrete Kürzung.",reason:"Kontext ist unvollständig."}],sourcesUsed:[],uncertainties:[],safeguards}; break;
      case "formulate_lesson_goal": payload={summary:"Präziser Lernzielvorschlag",rationale:"Die beobachtbare Leistung wird von der Aktivität getrennt.",changes:[{type:"replace_field",fieldPath:"lessonPlanning.lessonGoal",oldValue:lesson?.lessonGoal??"",newValue:"Die Kinder erkennen Nomen in kurzen Sätzen und ordnen ihnen den passenden Artikel zu.",reason:"Das Ziel beschreibt eine beobachtbare fachliche Leistung."}],sourcesUsed:[],uncertainties:lesson?.lessonGoal?["Die konkrete Erfolgsschwelle bleibt von der Lehrkraft festzulegen."]:[],safeguards}; break;
      case "suggest_differentiation": payload={summary:"Drei Zugänge bei gemeinsamem Lernziel",changes:[{type:"replace_field",fieldPath:"lessonPlanning.differentiation",oldValue:lesson?.differentiation??"",newValue:"Basis: Hilfekarten und markierte Beispiele. Standard: selbstständig bearbeiten und begründen. Plus: eigene Beispiele entwickeln.",reason:"Die Zugänge variieren Hilfe und Denktiefe statt Kinder zu etikettieren."}],sourcesUsed:[],uncertainties:["Passung zur Lerngruppe bitte prüfen."],safeguards}; break;
      case "simplify_instruction": payload={summary:"Arbeitsauftrag in kurze Schritte gegliedert",changes:task?[{type:"update_material_task",blockId:task.id,changes:{instruction:"Lies die Aufgabe. Bearbeite sie Schritt für Schritt. Prüfe dein Ergebnis."},reason:"Kurze Sätze erhalten den fachlichen Auftrag."}]:[{type:"advisory_note",title:"Keine Aufgabe gefunden",content:"Eine konkrete Aufgabe ist erforderlich.",reason:"Kein Aufgabenblock im Kontext."}],sourcesUsed:[],uncertainties:[],safeguards}; break;
      case "create_support_variant_plan":
      case "create_challenge_variant_plan": { const support=key==="create_support_variant_plan"; payload={summary:support?"Plan für eine unterstützende Variante":"Plan für eine vertiefende Variante",changes:[{type:"add_material_variant_plan",variantType:support?"support":"challenge",proposedChanges:[{blockId:task?.id,description:support?"Arbeitsauftrag in zwei Schritte teilen und visuelle Hilfe anbieten.":"Begründungen und eigene Gegenbeispiele ergänzen.",help:support?"Visuelle Hilfen":undefined,additionalRequirement:support?undefined:"Eigene Beispiele erklären"}],reason:"Die Variante wird nur geplant, nicht automatisch erzeugt."}],sourcesUsed:[],uncertainties:["Die spätere Variante muss bewusst erstellt und geprüft werden."],safeguards}; break; }
      case "reflect_lesson": payload={summary:"Reflexionsnotizen nach Beobachtung und nächstem Schritt geordnet",changes:[{type:"replace_field",fieldPath:"lessonReflection.nextTimeChange",oldValue:c.reflectionContext?.nextTimeChange??"",newValue:"Beim nächsten Mal die Erarbeitung früher beenden und mehr Zeit für die Sicherung reservieren.",reason:"Die nächste konkrete Planungsänderung wird sichtbar."}],sourcesUsed:[],uncertainties:["Nur vorhandene Notizen und Zeitangaben wurden berücksichtigt."],safeguards:[...safeguards,"Keine Änderung der Stammreihe."]}; break;
      case "check_material_quality": payload={summary:"Fachlich-sprachliche Materialprüfung",changes:[{type:"advisory_note",title:"Aufgabenverständlichkeit",content:"Arbeitsauftrag, erwartete Antwort und verfügbarer Schreibraum sollten gemeinsam geprüft werden.",reason:"Dieser Hinweis ergänzt die technische Layoutprüfung."}],sourcesUsed:[],uncertainties:["Keine Aussage über eine konkrete Lerngruppe."],safeguards}; break;
      case "show_other_perspective": payload={summary:"Alternative methodische Sichtweise",changes:[{type:"advisory_note",title:"Andere Perspektive",content:"Die Kinder könnten zunächst Beispiele ordnen und anschließend gemeinsam eine Regel formulieren.",reason:"Alternative ohne Abwertung der bestehenden Planung."}],sourcesUsed:[],uncertainties:["Zeitbedarf hängt von der Lerngruppe ab."],safeguards}; break;
      default: payload={summary:"Vorhandene Planung strukturieren",changes:[{type:"advisory_note",title:"Offene Struktur",content:"Einstieg, Erarbeitung und Sicherung aus den vorhandenen Notizen kenntlich machen; fehlende Angaben offenlassen.",reason:"Es werden keine fehlenden Inhalte erfunden."}],sourcesUsed:[],uncertainties:["Einzelne Planungsschritte sind noch offen."],safeguards};
    }
    return suggestionPayloadSchema.parse(payload);
  }
}

export class PreparedOpenAIAdapter implements BuddyAdapter {
  type = "openai" as const;
  async generate(input: Parameters<BuddyAdapter["generate"]>[0]) {
    let response:Response;
    try { response=await fetch("/api/buddy",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(input)}); }
    catch { throw new BuddyError("BUDDY_REQUEST_TIMEOUT","Die KI-Verbindung konnte nicht erreicht werden. Deine Planung wurde nicht verändert."); }
    const body=await response.json().catch(()=>({error:"Die KI-Antwort konnte nicht gelesen werden."})) as {error?:string};
    if(!response.ok) throw new BuddyError(response.status===503?"BUDDY_NOT_CONFIGURED":"BUDDY_REQUEST_TIMEOUT",body.error??"Die KI-Anfrage ist fehlgeschlagen.");
    return suggestionPayloadSchema.parse(body);
  }
}

export const mockBuddyAdapter=new MockBuddyAdapter();
export const preparedOpenAIAdapter=new PreparedOpenAIAdapter();

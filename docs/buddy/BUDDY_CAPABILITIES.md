# Fähigkeitsregister

`apps/web/src/ai/capabilities.ts` ist die einzige Quelle für Fähigkeiten, Zieltypen, erlaubte Kontextabschnitte, Modellprofile, Versionierungsbedarf und Übernahmestrategie.

| Schlüssel | Ziel | Wirkung |
| --- | --- | --- |
| `shorten_lesson` | Stunde | Phasen gezielt kürzen |
| `structure_lesson` | Stunde | Ablauf klarer strukturieren |
| `formulate_lesson_goal` | Stunde | Lernziel formulieren |
| `show_other_perspective` | Stunde/Reihe | beratende andere Sichtweise |
| `suggest_differentiation` | Stunde | Differenzierung ergänzen |
| `simplify_instruction` | Material | Arbeitsauftrag vereinfachen |
| `create_support_variant_plan` | Material | Fördervariantenplan vorschlagen |
| `create_challenge_variant_plan` | Material | Fordervariantenplan vorschlagen |
| `check_material_quality` | Material | Qualität beratend prüfen |
| `reflect_lesson` | Stunde | Reflexion strukturieren |

Die UI filtert das Register nach aktuellem Ziel. Adapter dürfen keine zusätzlichen Fähigkeiten oder Operationen erfinden.


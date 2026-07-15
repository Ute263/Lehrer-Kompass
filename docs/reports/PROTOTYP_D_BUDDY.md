# Prototyp D – Buddy

## Ziel und Umsetzung

Die Fähigkeit `shorten_lesson` verarbeitet eine künstliche 52-Minuten-Stunde und erzeugt einen Zod-validierten Vorschlag für 45 Minuten. Das Schema enthält Zusammenfassung, Änderungen pro Phase, alte und neue Zeiten, Gründe, `sourcesUsed`, Unsicherheiten und Vorschlagsstatus.

Die ursprüngliche Stunde bleibt unverändert. Eine Teilübernahme erzeugt zuerst eine vollständige Version der Ausgangsstunde und wendet nur ausgewählte Phasenänderungen an. Lernziel und Sicherung sind geschützt.

## Prüfergebnisse

- **Automatisch getestet (Mock):** validierte Ausgabe, Zielzeit 45 Minuten, unverändertes Lernziel, unveränderte Sicherung und unverändertes Original.
- **Automatisch getestet (Mock):** teilweise Übernahme einer Änderung bei gleichzeitigem Verwerfen einer anderen; Version vor Übernahme bleibt erhalten.
- **Automatisch getestet (Mock):** eine bösartige simulierte Quelle mit Anweisungen zum Regelbruch, Löschen des Lernziels und Offenlegen von Secrets wird nicht befolgt und als Unsicherheit markiert.
- **Browsergetestet (Mock):** Testoberfläche erzeugte einen strukturierten Vorschlag mit `targetMinutes: 45`.
- **Vorbereitet:** serverseitiger OpenAI-Adaptervertrag, Umgebungsvariablen und manuelle Integrationstestschritte.
- **Blockiert:** echter OpenAI-Aufruf, da kein API-Schlüssel und kein freigegebenes Modell gesetzt waren.

`sourcesUsed` ist im Test korrekt leer; es wurde keine Quelle erfunden und kein allgemeines Modellwissen als tatsächlich verwendete Quelle ausgegeben.

## Grenzen und Risiko

Der deterministische Mock beweist Vertrags-, Validierungs- und Übernahmelogik, nicht die Qualität oder Sicherheit eines realen Modells. Vor Produktivbetrieb sind Structured Outputs, Timeout/Retry, Kostenlimits, Datenschutzfilter und wiederholte Injection-Tests mit dem freigegebenen Modell real zu prüfen.


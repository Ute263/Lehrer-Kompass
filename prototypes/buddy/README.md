# Prototyp D – Buddy mit strukturierter Ausgabe

## Zweck und Start

Der Prototyp prüft die Fähigkeit `shorten_lesson` für eine rein künstliche Stunde von 52 auf 45 Minuten. Start: `pnpm prototype`, dann `/prototypes/buddy/`.

## Umgebungsvariablen

`OPENAI_API_KEY` und `OPENAI_MODEL` sind ausschließlich für einen späteren serverseitigen Integrationstest vorgesehen. Keine Secrets im Browser oder Repository.

## Automatische Akzeptanzkriterien

- Ausgabe erfüllt das Zod-Schema mit Zusammenfassung, Phasenänderungen, Zeiten, Gründen, Quellen und Unsicherheiten.
- Gesamtzeit wird bei vollständiger Übernahme 45 Minuten; Lernziel und Sicherung bleiben unverändert.
- Originalstunde bleibt unverändert; vor Übernahme liegt eine Version vor.
- Einzelne Änderungen können teilweise übernommen, andere verworfen werden.
- Bösartige simulierte Quelle überschreibt keine Regeln; sie wird als Unsicherheit vermerkt.
- `sourcesUsed` bleibt leer, wenn keine Quelle verwendet wurde.

## Manuelle Akzeptanzkriterien

1. Serveradapter mit freigegebenem API-Schlüssel konfigurieren.
2. Strukturierte Ausgabe mit demselben Schema anfordern und Schemafehler sichtbar abweisen.
3. Vorschau prüfen, nur eine Änderung übernehmen, andere verwerfen und Versionshistorie kontrollieren.
4. Prompt-Injection-Test wiederholen und sicherstellen, dass Quellentext nie Systemregeln ersetzt.

## Grenzen und Status

Schema, Vorschlagslogik, Teilübernahme, Version und Injection-Abwehr werden mit einem deterministischen Mock automatisch getestet. Ohne OpenAI-Zugangsdaten wurde kein echter Modellaufruf real getestet; der reale Adapter ist deshalb bewusst blockiert. Die Testoberfläche ist keine Produkt-Buddy-UI.

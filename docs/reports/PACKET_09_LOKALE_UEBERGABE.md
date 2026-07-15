# Paket 09 – lokale Übergabe

## Branch und Basisstand

- Arbeitsbranch: `feature/package-09-ai-buddy`
- Basisstand: `b97de9c` (`docs: complete package 08 local reports`)
- Implementierungscommit: `3f198b4` (`feat: implement controlled local AI buddy`)
- Berichtscommit: wird mit diesem Bericht lokal ergänzt.

## Neue und geänderte Dateien

- Buddy-Kern: `apps/web/src/ai/` (Verträge, Register, Kontext, Adapter, Service, Tests)
- Buddy-UI: `apps/web/src/features/buddy/` (Panel, CSS, UI- und Accessibility-Tests)
- Integration: `apps/web/src/app/AppShell.tsx`, `apps/web/src/design-system/components/overlays.tsx`
- Persistenz/Migration: `apps/web/src/domain/database.ts` und bestehende Migrationstests
- Testskript: `package.json`
- Dokumentation: neun Dateien unter `docs/buddy/` sowie `docs/app-shell/APP_SHELL.md`
- Artefakte: 22 JPEG-Dateien unter `artifacts/package-09/`
- Berichte: diese Übergabe und `PACKET_09_ABSCHLUSSBERICHT.md`

Der bereits vorher unversioniert vorhandene Bericht `docs/reports/CODEX_KICKOFF_VERSTAENDNISBERICHT.md` wurde nicht verändert und nicht committed.

## Startbefehl und lokale URLs

```bash
pnpm design-system
```

- Anwendung: `http://127.0.0.1:4173/`
- Beispiel Stunde: `http://127.0.0.1:4173/stunden/lesson-nomen-1`
- Beispiel Material: `http://127.0.0.1:4173/materialien/material-nomen-worksheet`

Falls Port 4173 belegt ist, nennt Vite den automatisch verwendeten Folgeport.

## Mock-Modus

Der lokale Mock-Adapter ist aktiv, deterministisch und netzwerkfrei. Die Oberfläche kennzeichnet ausdrücklich: „Lokaler Testmodus – keine echte KI-Anfrage.“

## Tests und Ergebnisse

Ausgeführt wurde `pnpm check`:

- TypeScript strict: erfolgreich
- Domain-, Sicherheits-, Policy-, Migrations- und UI-Tests: 230/230 erfolgreich
- Produktionsbuild: erfolgreich
- Accessibility-Basistests: 17/17 erfolgreich
- Dexie v5→v6 und v1→v2→v3→v4→v5→v6: erfolgreich

## Screenshots

22 visuelle Nachweise liegen unter `artifacts/package-09/`. Alle Dateien wurden als JPEG erzeugt und ihr tatsächliches Format wurde geprüft. Enthalten sind Stunden-, Material-, Mock-, Fehler- sowie Tablet-/Smartphone-Nachweise.

## Offene manuelle Prüfungen

- Keine fachliche Abschlussprüfung offen.
- Vor Produktivbetrieb: Datenschutz-/Betriebsfreigabe und reale serverseitige Adapterprüfung.
- Chunk-Aufteilung des 576,84-kB-Hauptchunks in einem späteren Performance-Paket bewerten.

## Vorbereitete echte API-Integration

Der `PreparedOpenAIAdapter` definiert den Clientvertrag, sendet aber bewusst nichts. Offen bleiben eigener authentifizierter Backend-Endpunkt, serverseitiger Schlüssel, Modellzuordnung, Timeout, maximal ein Retry, Rate-/Kostenlimit, Logging-/Löschkonzept und ein freigegebener Testschlüssel. Eine echte OpenAI-Anfrage wurde nicht ausgeführt.

## Spätere GitHub-Schritte

Erst nach ausdrücklicher Freigabe: Arbeitsbaum prüfen, Branch zu GitHub pushen, Pull Request gegen `main` öffnen, CI-Ergebnis prüfen und Review abarbeiten. In diesem Paket erfolgten keine Remote-Schreibaktionen.

**Übergabestatus: Paket 09 lokal abgeschlossen, nicht zu GitHub übergeben.**


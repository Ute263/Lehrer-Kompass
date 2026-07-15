# Paket 07 – Lokale Übergabe

## Status

Paket 07 ist lokal abgeschlossen. Es gab keine Push-, Pull-Request-, GitHub-Anmelde- oder sonstige Remote-Schreibaktion.

## Branch und Basisstand

- Branch: `feature/package-07-calendar`
- Basis: `c212a7a docs: complete package 06 local reports`
- `05e2ac1 fix: align package 06 screenshot formats`
- `8e4263f feat: add local timetable and calendar workspace`
- `a24f656 feat: complete calendar rescheduling choices`
- Abschlussbericht: wird mit diesem Bericht committed

## Neue und geänderte Dateien

Neu sind Kalender-Domainmodell, Service, Domain-/UI-/Accessibility-Tests, Kalenderseiten und CSS unter `apps/web/src/domain/` beziehungsweise `apps/web/src/features/calendar/`, vier Dexie-v4-Tabellen, sieben Dokumente unter `docs/calendar/`, 14 `.jpg`-Artefakte unter `artifacts/package-07/` und diese Berichte. Geändert wurden Router, Stundenverlinkung, Werkbankverweis, AppShell-Routingdokumentation, Migrationsstandtests und die Accessibility-Testkonfiguration.

Die fremde unversionierte Datei `docs/reports/CODEX_KICKOFF_VERSTAENDNISBERICHT.md` blieb unverändert und uncommitted.

## Startbefehl

```bash
PATH=/Users/utemacbook/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm design-system
```

## Lokale URLs

- `http://127.0.0.1:4173/stundenplan`
- `http://127.0.0.1:4173/stundenplan/tag/2026-08-24`
- `http://127.0.0.1:4173/stundenplan/einstellungen`
- `http://127.0.0.1:4173/kalender/termine/calendar-event-nomen`
- `http://127.0.0.1:4173/tagesuebersicht/2026-08-24`
- `http://127.0.0.1:4173/vertretungsuebersicht/2026-08-24`

## Tests und Ergebnisse

```bash
PATH=/Users/utemacbook/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm check
```

- Typecheck: erfolgreich
- Tests: 176/176 erfolgreich
- Migrationen v3→v4 und v1→v2→v3→v4: erfolgreich
- Produktionsbuild: erfolgreich
- Accessibility: 12/12 erfolgreich
- bekannte nicht blockierende Hinweise: jsdom Canvas; Vite-Chunk circa 552 kB

## Screenshots

`artifacts/package-07/` enthält 14 nummerierte JPEG-Aufnahmen mit `.jpg`-Endung. `file` bestätigt für jede Datei JPEG/JFIF. Tablet wurde mit 900×1100 als Wochenansicht, Smartphone mit 390×844 als Tagesansicht gerendert.

## Offene manuelle Prüfungen

Keine Abschlussprüfung ist blockiert. Sinnvolle spätere Produktprüfungen sind eine längere reale Bediensequenz mit mehreren künstlichen Wochen, subjektive Bewertung der verdichteten Tablet-Karten und eine explizite Entscheidung zur freien Wochenwahl.

## Spätere GitHub-Schritte

Erst nach gesonderter Freigabe:

1. Branchstatus und Commits prüfen,
2. `feature/package-07-calendar` pushen,
3. Pull Request nach `main` öffnen,
4. CI und Review kontrollieren,
5. erst danach zusammenführen.

Diese Schritte wurden nicht ausgeführt.

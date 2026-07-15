# Paket 11 – lokale Übergabe

## Branch und Basis
- Branch: `feature/package-11-local-app-backup`
- Basis: `600b59a` aus Paket 10
- Keine Remote-Schreibaktion, Registrierung oder Bereitstellung.

## Lokale Commits
Die Paket-11-Commits stehen im lokalen `git log`. Die vorbestehende unversionierte `docs/reports/CODEX_KICKOFF_VERSTAENDNISBERICHT.md` und die fremden unversionierten Einträge `FoerderKompass_Hotfix_v295.zip` sowie `foerderplan-assistent 3/` wurden nicht verändert oder aufgenommen.

## Neue und geänderte Dateien
- PWA: `apps/web/public/`, `apps/web/index.html`, `apps/web/src/main.tsx`
- Backup: `apps/web/src/backup/`
- UI: `apps/web/src/features/local-app/`, Router, AppShell, Brotkrumen
- Persistenz: `apps/web/src/domain/database.ts`, aktualisierte Migrationstests
- Dokumente: `docs/local-app/`, `docs/backup/`, ADR-002 und diese Berichte
- Artefakte: 24 JPEGs unter `artifacts/package-11/`

## Start und URLs
```bash
pnpm design-system
```
Vite nennt den lokalen Port. Relevante Routen: `/werkbank`, `/einstellungen/installation`, `/einstellungen/sicherung`, `/einstellungen/import`, `/einstellungen/daten`.

## Installationsweg
Produktionsbuild über HTTPS/localhost öffnen. Chromium: angebotene App-Installation verwenden. iPadOS: Safari → Teilen → Mehr → Zum Home-Bildschirm → Als Web-App öffnen.

## Offlineprüfung
Automatisierte Manifest-/Cache-/API-Ausschlusstests bestanden. Reale Offline-Neustartprüfung in der eingebetteten Browserumgebung nicht bestätigt; vor lokaler Abnahme in Chrome/Edge/Safari manuell wiederholen.

## Tests
- `pnpm check`: 265/265, Build, 22/22 Accessibility
- `pnpm test:backup`: 8/8
- `pnpm test:import`: 8/8
- `pnpm test:pwa`: 3/3
- `pnpm test:offline`: 3/3
- `pnpm test:secret-scan`: 2/2

## Screenshots
24 formatgeprüfte JPEGs unter `artifacts/package-11`. Desktop-, Tablet- und Smartphone-Viewports geprüft; iPad-Gerät nicht real geprüft.

## Offene manuelle Prüfungen
Realer Offline-Neustart, Worker-Update mit wartender Version, Safari/macOS, iPadOS, nativer Speicherdialog, großer Backupimport und vollständige Reihen-/Material-Austausch-UI.

## Spätere GitHub-Schritte
Erst nach Freigabe und nach Schließen der offenen Abnahmepunkte: Branch pushen, PR gegen `main`, CI/Preview mit HTTPS ausführen. Bisher keine Remote-Aktion.

**Übergabestatus: lokal implementiert und automatisch geprüft; Paket 11 noch nicht endgültig lokal abgeschlossen.**

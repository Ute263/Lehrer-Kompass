# LehrerKompass
## The Quiet Workspace

LehrerKompass ist ein ruhiger digitaler Arbeitsplatz zur Planung, Durchführung und Weiterentwicklung von Unterricht.

## Aktueller Stand

Die technische Machbarkeitsphase ist abgeschlossen. Die Pakete 00 bis 11 haben unter anderem folgende Grundlagen umgesetzt:

- App-Shell und Navigation
- Werkbank, Klassen, Reihen und Stundenplanung
- Kalender und Tagesübersichten
- Materialwerkstatt
- kontrollierter KI-Buddy
- vorbereitete Server- und Sicherheitsarchitektur
- lokale Version-1-Datenhaltung mit Dexie
- PWA-, Offline-, Backup- und Importgrundlage

Für Version 1 gilt weiterhin die Local-First-Entscheidung: kein verpflichtender Microsoft-Login, keine automatische OneDrive-Synchronisierung und kein Pflichtbackend.

## Nächster Auftrag

Paket 12 schließt die offenen Abnahmepunkte aus Paket 11 und richtet den weiteren Arbeitsablauf für iPad, ChatGPT-App, GitHub, Pull Requests und browserbasierte Vorschau ein.

Verbindlicher Auftrag:

[`CODEX_ARBEITSPAKET_12_IPAD_WORKFLOW_UND_ABNAHME.md`](CODEX_ARBEITSPAKET_12_IPAD_WORKFLOW_UND_ABNAHME.md)

## Noch offen

- realer Offline-Neustart auf einem Zielgerät
- realer Service-Worker-Updateablauf
- reale Installation und Prüfung auf iPad/Safari
- vollständige Oberflächen für Reihen- und Materialaustausch
- echte visuelle Fehler- und Konfliktzustände
- dauerhaft erreichbare HTTPS-Testvorschau

Diese Punkte dürfen erst nach tatsächlicher Prüfung als bestanden gelten.

## Start und Prüfung

```bash
pnpm install
pnpm prototype
```

Vollständige automatische Prüfung:

```bash
pnpm check
```

Zusätzliche Paket-11-Prüfungen:

```bash
pnpm test:backup
pnpm test:import
pnpm test:pwa
pnpm test:offline
pnpm test:secret-scan
```

## Verbindliche Projektdokumente

1. [`PROJECT_BIBLE.md`](PROJECT_BIBLE.md)
2. [`DONT.md`](DONT.md)
3. [`CODEX_MASTERPROMPT.md`](CODEX_MASTERPROMPT.md)
4. [`docs/README.md`](docs/README.md)
5. [`docs/reports/PACKET_11_ABSCHLUSSBERICHT.md`](docs/reports/PACKET_11_ABSCHLUSSBERICHT.md)
6. [`docs/reports/PACKET_11_LOKALE_UEBERGABE.md`](docs/reports/PACKET_11_LOKALE_UEBERGABE.md)

## Arbeitsregel

GitHub ist die verbindliche Projektquelle. Neue Arbeitspakete werden in einem eigenen Branch umgesetzt, über einen Pull Request geprüft und erst nach Abnahme in `main` zusammengeführt. ZIP-Dateien, manuelles Entpacken und erneutes Hochladen sind nicht der Standardworkflow.

## Leitsatz

> Ruhe schafft Raum für gute Ideen.

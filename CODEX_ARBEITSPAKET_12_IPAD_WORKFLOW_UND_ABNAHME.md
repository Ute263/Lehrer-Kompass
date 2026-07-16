# Arbeitspaket 12 – iPad-Workflow und Paket-11-Abnahme

## Ausgangslage
Paket 11 hat PWA, Offline-Grundlage, Backup, Import und lokale Datenhaltung umgesetzt. Die automatischen Tests waren erfolgreich. Offen sind reale Offline-, Update- und iPad-Prüfungen sowie vollständige Oberflächen für Reihen- und Materialaustausch.

Ab Samstag arbeitet die Auftraggeberin ausschließlich mit der ChatGPT-App auf einem iPad. Der weitere Ablauf muss deshalb browserbasiert, GitHub-zentriert und ohne lokale ZIP- oder Ordnerarbeit funktionieren.

## Ziel
Paket 12 schließt die offenen Pflichtpunkte aus Paket 11 und macht LehrerKompass zuverlässig auf dem iPad prüfbar. Es ist ein Stabilitäts-, Abnahme- und Arbeitsfähigkeits-Paket, kein neuer großer Fachbereich.

## Verbindlicher Umfang

### 1. Paket 11 vollständig abnehmen
- App über HTTPS bereitstellen.
- realen Offline-Neustart prüfen.
- vorhandene und neue lokale Daten offline lesen, bearbeiten und speichern.
- Service-Worker-Update ohne Eingabeverlust prüfen.
- Installationsablauf „Zum Home-Bildschirm“ auf iPad/Safari prüfen.
- Standalone-Start, Icon, Name und Installationsstatus prüfen.

### 2. Reihen- und Materialaustausch vervollständigen
- Reihe auswählen, enthaltene Stunden und Materialien anzeigen und exportieren.
- Reihenimport mit Vorschau, Zielklasse/Zielthema und ausdrücklicher Bestätigung.
- Materialexport und -import mit Aufgaben, Lösungen, Rechtehinweisen und Varianten.
- private Notizen, Klassenbezüge, Kalenderdaten und lokale Pfade entfernen.
- Konflikte je Datensatz behandeln: lokal behalten, importierte Kopie anlegen oder überspringen.
- niemals bestehende Daten still überschreiben.

### 3. iPad-taugliche Bedienung
- Hoch- und Querformat prüfen.
- keine abgeschnittenen Hauptaktionen.
- ausreichend große Touch-Ziele.
- keine nur per Hover erreichbaren Funktionen.
- Dialoge vollständig scrollbar.
- Dateiauswahl und Export über die Dateien-App ermöglichen.
- Safari-Einschränkungen verständlich erklären.

### 4. Browserbasierte Vorschau
- statischen Build ohne Geheimnisse erzeugen.
- Vorschau über festen HTTPS-Link ermöglichen.
- lokale Version ohne produktives Backend prüfbar machen.
- Branch- oder Pull-Request-Vorschau bevorzugen.
- `main` nur für abgenommene Stände verwenden.
- keinen zweiten Cloudflare-Account voraussetzen.

### 5. iPad-Arbeitsablauf dokumentieren
Erstelle `docs/ipad/IPAD_WORKFLOW.md` mit diesem einfachen Ablauf:
1. Änderung in der ChatGPT-App beauftragen.
2. Repository und Paket eindeutig nennen.
3. Änderungen in eigenem Branch ausführen.
4. Pull Request mit Vorschau erstellen.
5. Vorschau auf dem iPad prüfen.
6. Fehler mit Screenshot und genauer Beobachtung melden.
7. erst nach Abnahme in `main` zusammenführen.

GitHub bleibt die verbindliche Quelle. ZIP-Downloads, Entpacken und manuelles Wiederhochladen sind kein Standardworkflow.

### 6. Projektstatus korrigieren
README aktualisieren. Sie darf nicht mehr behaupten, dass keine App existiert oder der Machbarkeitscheck erst bevorsteht. Aufnehmen:
- Stand nach Paket 11,
- Local-First-Entscheidung,
- Paket 12 als nächster Auftrag,
- offene reale iPad-/Offline-Abnahme,
- Start- und Testbefehle,
- Verweise auf Berichte und iPad-Workflow.

## Tests
Mindestens ausführen:
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm test:a11y`
- `pnpm test:backup`
- `pnpm test:import`
- `pnpm test:pwa`
- `pnpm test:offline`
- `pnpm test:secret-scan`

Neue Tests für Austauschoberflächen, Konfliktentscheidung, Offline-/Updatehinweis sowie Datei- und Downloadfallback ergänzen.

## Reale manuelle Prüfungen
Verpflichtend dokumentieren:
- Safari auf iPad,
- Installation zum Home-Bildschirm,
- Standalone-Start,
- Offline-Neustart,
- Updateablauf,
- Backup-Export und -Import,
- Reihenexport und -Import,
- Materialexport und -Import,
- Konfliktentscheidung,
- Hoch- und Querformat.

Nicht real durchgeführte Prüfungen dürfen nicht als bestanden gelten.

## Visuelle Nachweise
Unter `artifacts/package-12/` echte Zustände dokumentieren: iPad Hoch-/Querformat, installierte PWA, Offlinezustand, Updatehinweis, Backup, Importvorschau, echter Konflikt, Reihen- und Materialaustausch, Erfolg und Fehlerzustand.

## Datenschutz
- keine echten Schülernamen,
- keine Geheimnisse im Repository,
- keine Microsoft- oder OpenAI-Schlüssel in der Web-App,
- lokale Daten bleiben standardmäßig lokal,
- Secret-Scan muss grün bleiben.

## Abschluss
Nach Umsetzung erstellen:
- `docs/reports/PACKET_12_ABSCHLUSSBERICHT.md`
- `docs/reports/PACKET_12_LOKALE_UEBERGABE.md`

Der Bericht trennt klar zwischen automatisch geprüft, real auf iPad geprüft und offen.

## Abnahme
Paket 12 ist abgeschlossen, wenn alle automatischen Tests grün sind, Austauschoberflächen vollständig bedienbar sind, echte Konflikte geprüft wurden, die HTTPS-Vorschau funktioniert, README und iPad-Anleitung aktuell sind und reale iPad-Prüfungen dokumentiert wurden.

Falls kein reales iPad im Ausführungsumfeld verfügbar ist, lautet der Status: **technisch vorbereitet, reale iPad-Abnahme offen**.

## Startauftrag für Codex
> Lies `PROJECT_BIBLE.md`, `DONT.md`, `CODEX_MASTERPROMPT.md`, diesen Auftrag und die Berichte von Paket 11. Prüfe zuerst den aktuellen Codebestand. Schließe die offenen Paket-11-Pflichtpunkte und richte danach den iPad- und browserbasierten Workflow ein. Erfinde keine bestandenen Gerätetests.
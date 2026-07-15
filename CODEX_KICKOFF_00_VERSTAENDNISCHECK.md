# Codex-Kickoff 00: Projektverständnis prüfen

## Ziel

Bevor produktiver Code oder technische Prototypen entstehen, soll Codex nachweisen, dass die verbindlichen Grundlagen von LehrerKompass verstanden wurden.

## Auftrag

1. Lies vollständig:
   - `PROJECT_BIBLE.md`
   - `DONT.md`
   - `CODEX_MASTERPROMPT.md`
   - `CODEX_ARBEITSPAKET_00_TECHNISCHER_MACHBARKEITSCHECK.md`
   - alle Dateien unter `docs/`
2. Analysiere das Repository und den aktuellen technischen Stand.
3. Verändere noch keinen Produktcode.
4. Erstelle ausschließlich den Bericht:
   - `docs/reports/CODEX_KICKOFF_VERSTAENDNISBERICHT.md`

## Pflichtinhalt des Berichts

### 1. Was ich verstanden habe

Fasse Mission, Zielgruppe, Kernablauf und Produktidentität von LehrerKompass zusammen.

### 2. Verbindliche fachliche Struktur

Erläutere insbesondere:

- Klasse → Fach → Thema → Unterrichtsreihe → Unterrichtsstunde → Material
- Trennung von Stammreihe und Durchführung
- Trennung von Unterrichtsstunde und Kalendereintrag
- Trennung von Material und Materialdatei
- Werkbank als Verweis auf aktive Arbeiten

### 3. Verbindliche technische Architektur

Fasse Frontend, Backend, Datenbank, IndexedDB, OneDrive, OpenAI, Materialmodell und Dokumentexport zusammen.

### 4. Schutzregeln

Nenne die wichtigsten Regeln aus `DONT.md`, die bei der Entwicklung keinesfalls verletzt werden dürfen.

### 5. Risiken und offene Punkte

Ordne Risiken nach:

- kritisch
- hoch
- mittel
- niedrig

Unterscheide dabei echte Blocker von Fragen, die im Machbarkeitscheck beantwortet werden sollen.

### 6. Was ich nicht eigenständig entscheiden werde

Liste Architektur-, Datenschutz- und Produktentscheidungen auf, die eine ausdrückliche Freigabe benötigen.

### 7. Prüfung von Arbeitspaket 00

Bewerte, ob der technische Machbarkeitscheck vollständig, widerspruchsfrei und ausführbar beschrieben ist.

### 8. Empfehlung

Schließe mit genau einer Aussage:

- `Arbeitspaket 00 kann unverändert beginnen.`
- `Arbeitspaket 00 kann nach kleinen dokumentierten Klarstellungen beginnen.`
- `Vor Arbeitspaket 00 ist eine zentrale Entscheidung erforderlich.`

## Grenzen

- Keine produktive App bauen.
- Keine Prototypen implementieren.
- Keine Dateien außerhalb des Berichts verändern.
- Keine Architektur eigenmächtig ändern.
- Fehlende Zugangsdaten nicht als Fehler der Spezifikation behandeln.
- Keine Funktion als getestet bezeichnen.

## Danach

Erst nach Prüfung dieses Verständnisberichts wird der Auftrag erteilt, `CODEX_ARBEITSPAKET_00_TECHNISCHER_MACHBARKEITSCHECK.md` auszuführen.

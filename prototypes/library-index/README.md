# Prototyp E – Bibliotheksindex und Suche

## Zweck und Start

Der Prototyp indexiert zehn ausschließlich künstliche Dateien aus Deutsch, Mathematik, Sachunterricht, Musik, Kunst und Sport. Dateien erzeugen: `pnpm artifacts`. Oberfläche: `pnpm prototype`, dann `/prototypes/library-index/`.

## Umgebungsvariablen

Keine.

## Automatische Akzeptanzkriterien

- Mindestens zehn Dateien; PDF, DOCX, TXT und PNG sind enthalten.
- Metadaten umfassen Titel, Typ, Klasse, Fach, Thema, Materialart, Bewertung, Speicherort, extrahierten Text und Indexstatus.
- Die fünf vorgegebenen Suchanfragen liefern passende Treffer.
- Filter nach Klasse, Fach und Materialart funktionieren.
- Ein Material besitzt mehrere Verknüpfungen, ohne dass die Originaldatei kopiert wird.
- Eine unklare Datei trägt `Zuordnung prüfen`; Bilddateien dokumentieren ihren eingeschränkten Indexstatus.

## Manuelle Akzeptanzkriterien

1. Alle zehn Dateien öffnen und künstlichen Inhalt kontrollieren.
2. Die fünf Suchanfragen in der Testoberfläche ausführen.
3. Filter kombinieren und Treffer-Metadaten, Speicherort sowie Mehrfachverknüpfung prüfen.
4. Bestätigen, dass keine Vektorsuche und keine automatische Änderung der Originale erfolgt.

## Grenzen und Status

Metadaten-, Filter- und einfache Volltextsuche werden real lokal automatisiert geprüft. Die Textextraktion wird für künstlich erzeugte PDF/DOCX/TXT-Dateien beim Fixture-Aufbau vorgegeben; eine produktionsreife Parser-Pipeline und OCR sind nicht umgesetzt. PNG wird nur über Metadaten indexiert oder als nicht automatisch lesbar markiert. Keine OneDrive-Datei wird verwendet.

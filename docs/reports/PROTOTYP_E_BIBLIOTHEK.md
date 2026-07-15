# Prototyp E – Bibliotheksindex und Suche

## Ziel und Umsetzung

Der Prototyp erzeugt zehn künstliche Dateien aus verschiedenen Fächern und Materialarten: drei PDF-, zwei DOCX-, drei TXT- und zwei PNG-Dateien. Der JSON-Index speichert Titel, Typ, Klasse, Fach, Thema, Materialart, Bewertung, Speicherort, extrahierten Text, Indexstatus, Lösungskennzeichen, Schreibumfang und Verknüpfungen.

Textstatus:

- PDF, DOCX und TXT: für den künstlichen Testbestand als `Text extrahiert` indexiert.
- PNG: `Nur Metadaten` oder `Nicht automatisch lesbar`; keine vorgetäuschte OCR.
- Unklare TXT-Datei: `Zuordnung prüfen`.

## Prüfergebnisse

- **Automatisch getestet:** zehn Dateien, alle vier Pflichtformate und alle Quelldateien vorhanden.
- **Automatisch getestet:** Treffer für „Nomen Klasse 2“, „wenig schreiben Nomen“, „bewährtes Arbeitsblatt“, „Wasser Versuch“ und „Lösung vorhanden“.
- **Automatisch getestet:** kombinierter Filter nach Fach, Klasse und Materialart.
- **Automatisch getestet:** Mehrfachverknüpfung eines Materials zu Stunde und Reihe, ohne Kopie der Originaldatei.
- **Browsergetestet:** Suche nach „Wasser Versuch“ zeigte den künstlichen Versuch als Treffer; Eingabe war beschriftet und Ergebnis wurde sichtbar aktualisiert.
- **Nicht umgesetzt:** Vektorsuche, OCR, produktionsreife PDF-/DOCX-Parserpipeline und OneDrive-Deltaindexierung.

## Grenzen und Risiko

Die lokale Metadaten- und einfache Volltextsuche ist für Version 1 grundsätzlich tragfähig. Die Qualität realer Textextraktion, große Bestände, Reindexierung, Dateifehler, Sprache/Stemming und PostgreSQL-Volltextsuche müssen in der Hauptentwicklung separat abgesichert werden.


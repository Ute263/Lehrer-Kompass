# Prototyp B – PDF und DOCX

## Ziel und Umsetzung

Aus einem Zod-validierten internen Materialmodell wurde das künstliche Arbeitsblatt „Nomen mit Artikeln erkennen“ für Klasse 2 erzeugt. Es enthält Name/Datum, Lernziel, vier Aufgaben, Schreibflächen, zwei neutrale Bildfelder und eine getrennte Lösungsseite.

Artefakte:

- `artifacts/machbarkeit/Nomen_mit_Artikeln_Test.pdf`
- `artifacts/machbarkeit/Nomen_mit_Artikeln_Test.docx`

Das Layout folgt einem ruhigen, reduzierten Arbeitsblattmuster. Als Dokument-Grundsystem dient der kompakte Referenzstil; A4, größere Schreibflächen, Arial und die getrennte Lösung sind benannte Arbeitsblatt-Overrides.

## Prüfergebnisse

- **Automatisch getestet:** Materialschema, genau vier Aufgaben, eindeutige IDs, Lösungen, Schreibflächen, Bildplatzhalter und vorhandene nichtleere Artefakte.
- **Real lokal geprüft – PDF:** `pdfinfo` meldet zwei A4-Seiten (595,28 × 841,89 pt). Beide Seiten wurden mit Poppler bei 144 dpi gerendert und vollständig visuell geprüft. Nach Korrektur eines verschobenen Aufgabenblocks und eines abgeschnittenen Lösungstitels bestehen keine sichtbaren Überlappungen, abgeschnittenen Inhalte oder fehlerhaften Seitenumbrüche. Die Ausgabe verwendet schwarze Schrift und Linien auf weißem Grund und ist für Schwarz-Weiß geeignet.
- **Real lokal geprüft – DOCX:** LibreOfficeDev 26.8.0.0.alpha0 öffnete und renderte beide Seiten. Alle Seiten wurden visuell geprüft. Der Dokumenttext liegt als echte bearbeitbare OOXML-Absätze vor. In einer temporären Kopie wurde „Der Testhund spielt.“ in Aufgabe 4 ergänzt, gespeichert und erneut fehlerfrei gerendert.
- **Manuell zu prüfen:** tatsächlicher A4-Ausdruck bei 100 Prozent sowie Öffnen, Bearbeiten und Speichern in Microsoft Word.
- **Blockiert:** die laut Arbeitspaket mindestens verlangte Microsoft-Word-Prüfung war in der automatisierten Umgebung nicht verfügbar. Sie wird nicht als bestanden gemeldet.

## Grenzen und Risiko

PDF ist die druckverbindliche Fassung; DOCX ist bewusst eine gut bearbeitbare, nicht pixelgleiche Fassung. Der Renderer ist ein Machbarkeitsprototyp, noch kein vollständiges Materialsystem. Barrierefreies Tagging des PDF und produktionsreife Vorlagenverwaltung sind nicht Bestandteil dieses Pakets.


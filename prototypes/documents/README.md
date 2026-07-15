# Prototyp B – PDF und DOCX

## Zweck und Start

Der Prototyp erzeugt aus einem Zod-validierten Materialmodell das künstliche Arbeitsblatt „Nomen mit Artikeln erkennen“. Erzeugen: `pnpm artifacts`. Testoberfläche: `pnpm prototype`, dann `/prototypes/documents/`.

## Umgebungsvariablen

Keine.

## Automatische Akzeptanzkriterien

- Modell enthält genau vier Aufgaben, eindeutige Aufgaben-IDs, Lösungen, Schreibflächen und neutrale Bildfelder.
- PDF und DOCX werden erzeugt, sind nicht leer und lassen sich strukturell öffnen.
- PDF besitzt A4-Seiten; Arbeitsblatt und Lösung sind getrennt.
- DOCX enthält bearbeitbare Textabsätze statt einer eingebetteten Seitenabbildung.

## Manuelle Akzeptanzkriterien

- Jede PDF- und DOCX-Seite als PNG bei 100 Prozent prüfen: keine Überlappung, kein Abschneiden, sinnvolle Seitenumbrüche.
- PDF in Schwarz-Weiß und bei 100-Prozent-Druck auf A4 kontrollieren.
- DOCX mindestens in Microsoft Word öffnen, Text in Aufgabe 4 ändern und erneut speichern. Falls verfügbar zusätzlich LibreOffice prüfen; Anwendung und Version im Bericht festhalten.

## Grenzen und Status

Die Artefakte sind Machbarkeitsausgaben, keine produktive Materialvorlage. Automatisches Rendern und LibreOffice-Prüfung sind lokal möglich. Die verpflichtende manuelle Prüfung in Microsoft Word bleibt blockiert, wenn Word nicht automatisiert verfügbar ist. PDF und DOCX werden nicht als pixelgleich bewertet.

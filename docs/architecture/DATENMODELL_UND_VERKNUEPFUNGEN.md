# Datenmodell und Verknüpfungslogik

## Fachliche Hierarchie
Schule → Schuljahr → konkrete Klasse/Lerngruppe.
Klassenstufe → Fach → Thema → Stammreihe → Durchführung → Unterrichtsstunde → Unterrichtsphase.

## Kernobjekte
- `User`, `School`, `SchoolYear`, `GradeLevel`, `ClassGroup`, `Subject`, `Topic`
- `SeriesTemplate` (Stammreihe), `SeriesImplementation` (Durchführung), `SeriesPlan`, `ContentBlock`
- `LessonTemplate`, `Lesson`, `LessonPhase`, `DifferentiationMeasure`
- `Material`, `MaterialFile`, `MaterialVariant`, `MaterialLink`, `LibraryEntry`, `Tag`
- `Textbook`, `TextbookChapter`, `PedagogicalSource`, `SourceLink`
- `Timetable`, `TimetableSlot`, `CalendarEvent`, `DailyOverview`, `SubstituteOverview`
- `ChildProfile`, `SupportGroup`, `SupportGoal`, `SupportSeries`, `SupportLesson`
- `Reflection`, `ExperienceEntry`, `Version`, `ChangeEvent`
- `OneDriveLink`, `LocalFile`, `BuddySkill`, `BuddyRequest`, `BuddyProposal`, `WorkbenchEntry`

## Zentrale Beziehungen
- Eine Stammreihe besitzt mehrere Durchführungen.
- Eine Durchführung gehört zu genau einer konkreten Klasse und einem Schuljahr.
- Eine konkrete Stunde gehört zu genau einer Durchführung.
- Eine Stunde kann mehrere historische Kalendereinträge, aber höchstens einen aktiven Termin besitzen.
- Materialien sind eigenständige Objekte und werden über `MaterialLink` mehrfach verknüpft.
- Ein Material kann mehrere Dateien und Varianten besitzen.
- OneDrive-Dateien werden primär über `driveId` und `itemId` identifiziert.
- Werkbankeinträge speichern nur Verweise.
- Buddy-Vorschläge verändern Fachdaten erst nach Bestätigung.

## Vererbung
Neue Durchführung übernimmt zunächst Ziele, Inhaltsstruktur, Stundenfolge, Materialien und Differenzierungsübersicht aus der Stammreihe. Änderungen bleiben lokal zur Durchführung. Eine bewusste Aktion kann Verbesserungen später in die Stammreihe übernehmen.

Neue konkrete Stunden übernehmen Inhalte aus Stundenvorlagen. Materialvarianten übernehmen Grundstruktur, bleiben danach aber unabhängig.

## Löschen
- Von Werkbank nehmen: nur Verweis entfernen.
- Verknüpfung entfernen: Zielbeziehung entfernen; Objekt bleibt.
- Ausblenden: Objekt bleibt gespeichert.
- Löschen: Soft Delete/Papierkorb.
- OneDrive-Datei löschen: eigene, ausdrücklich bestätigte Aktion.

## Statuslogik
Statuswerte werden zentral definiert. Typische Zustände: Entwurf, in Planung, einsatzbereit, durchgeführt, abgeschlossen, bewährt, überarbeiten, pausiert. Status wird mit Text, Symbol und Farbe dargestellt.

## Suche
Suchreihenfolge: aktueller Kontext → persönliche Bewertung → fachliche Übereinstimmung → erfolgreiche frühere Verwendung → Aktualität. Version 1 nutzt Metadaten, Tags, extrahierbaren Text und PostgreSQL-Volltextsuche; keine Vektorsuche erforderlich.
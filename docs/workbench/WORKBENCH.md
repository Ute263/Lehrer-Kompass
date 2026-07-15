# Werkbank

## Zweck

Die Werkbank ist der persönliche Schreibtisch für aktive Verweise. Sie zeigt nur, woran gerade gearbeitet wird, und ist ausdrücklich kein Dashboard, Archiv oder Aufgabenmanager.

## Seitenaufbau

`WorkbenchPage` läuft innerhalb der Paket-02-AppShell. Der Paket-01-`PageHeader` trägt eine primäre, klar als später verfügbar markierte Aktion und eine sekundäre Aktion. Darunter folgen der kompakte lokale Filter, optional eine Rückgängig-Meldung, „Angeheftet“, „Aktuelle Arbeiten“ und der standardmäßig geschlossene Bereich „Zuletzt abgeschlossen“.

## Karten und Aktionen

`WorkbenchCard` zeigt Typ, Titel, künstlichen Kontext, Textstatus mit Icon/Form, nächsten Schritt und optional Fortschrittstext oder Termin. „Weiterarbeiten“ ist die einzige primäre Kartenaktion. Anheften/Nicht mehr anheften und Von Werkbank nehmen verändern nur den Werkbankverweis. Das Mehr-Menü bietet Öffnen; Duplizieren, Übernehmen und Löschen sind eindeutig deaktiviert.

„Weiterarbeiten“ aktualisiert lokal den letzten Bearbeitungszeitpunkt und öffnet eine neutrale `/prototyp/...`-Seite. Sie zeigt Kontext und nächsten Schritt, implementiert aber keine Fachlogik.

## Entfernen und Rückgängig

Vor dem Ausblenden bestätigt ein ruhiger Designsystem-Dialog die Aktion. Es wird kein Fachobjekt gelöscht. Danach kündigt eine zugängliche Notice die Änderung an und bietet Rückgängig.

## Leere Werkbank und Filter

Ohne aktive Einträge erscheint „Deine Werkbank ist frei.“ mit höchstens drei Aktionen; nur „Klassen öffnen“ navigiert bereits. Der exklusive Filter bietet Alle, Reihen, Stunden, Materialien und Förderung und arbeitet nur lokal.

## Responsive

Desktop nutzt ein großzügiges Raster, Tablet eine Spalte mit kompakter AppShell-Navigation, Smartphone eine einspaltige Begleitansicht. Filter darf horizontal innerhalb seines eigenen Bereichs scrollen; die Seite erzeugt keine horizontale Überbreite.

# Werkbank-Datenmodell

## Typen und Status

`WorkbenchItemType`: `series`, `lesson`, `material`, `support-series`, `day-overview`.

`WorkbenchStatus`: `draft`, `planning`, `ready`, `completed`, `needs-revision`. Labels und Statuswerte sind zentral in `workbench-model.ts` definiert. Status bleibt durch Text und Symbol/Form verständlich.

## Verweisstruktur

Ein `WorkbenchItem` enthält eine technische ID, Typ, Titel, optionale Kontextlabels, Status, nächsten Schritt, optionalen Fortschrittstext/Termin, letzten Bearbeitungszeitpunkt, Pin-/Ausblendstatus und eine ausschließlich technische Zielroute. Das vollständige Objekt wird mit Zod validiert.

## Abgrenzung

Ein Werkbankeintrag ist ein Verweis und keine Kopie einer Unterrichtsreihe, Stunde, Materialdatei oder eines Kalendereintrags. Paket 03 enthält keine Fachobjekte. `removedFromWorkbench` bedeutet ausschließlich „auf diesem Schreibtisch nicht sichtbar“ und niemals gelöscht. Künstliche Demonstrationsdaten liegen getrennt in `workbench-data.ts`.

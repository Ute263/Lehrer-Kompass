# Werkbank-Speicherung

## Umfang und Schema

LocalStorage-Schlüssel: `lehrerkompass.workbench.v1`, Schema-Version `1`. Gespeichert werden ausschließlich Filter und Overrides pro Demo-ID: `pinned`, `removedFromWorkbench`, `lastEditedAt`. Titel, Kontext oder scheinbare Fachinhalte werden nicht gespeichert.

## Validierung und Fehlerverhalten

Zod prüft Version, Filter, IDs, boolesche Zustände und ISO-Zeitstempel. Nicht vorhandene, nicht lesbare, syntaktisch falsche oder schemafremde Daten werden vollständig ignoriert; sichere Demo-Standardwerte bleiben verfügbar. Schreibfehler blockieren den aktuellen UI-Zustand nicht.

## Entwicklungszustände

`?state=default` zeigt reproduzierbare Demo-Defaults, `?state=empty` die leere Werkbank und `?filter=material` eine gefilterte Ansicht. Diese Parameter sind keine Produktfunktion.

## Spätere Ablösung

Der Adapter ist bewusst gekapselt. Eine spätere serverseitige Werkbank ersetzt die Override-Quelle; dabei bleibt die Regel bestehen, dass Werkbankeinträge nur nutzergebundene Verweise und keine Fachobjektkopien sind.

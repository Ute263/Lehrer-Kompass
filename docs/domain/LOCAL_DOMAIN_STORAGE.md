# Lokale Fachpersistenz

Dexie-Datenbank: `lehrerkompass-domain-v1`, Schema-Version 1. Tabellen: `schoolYears`, `classes`, `subjects`, `classSubjects`, `topics`, `meta`. Indizes bilden die benötigten Fremdschlüssel-, Status-, Reihenfolge- und zusammengesetzten Klasse-Fach-Abfragen ab.

`seed-v1` wird innerhalb einer gemeinsamen Transaktion genau einmal gesetzt. Mehrtabellenänderungen wie Klassenanlage und Schuljahresaktivierung laufen transaktional. Vollständige Snapshots werden vor Anzeige mit Zod geprüft; ungültige Daten führen zu `DOMAIN_DATA_INVALID` und werden nicht als scheinbar gültige Fachdaten gezeigt.

Tests verwenden je Fall eine eigene `fake-indexeddb`-Datenbank und löschen sie anschließend. Eine spätere Schemaänderung erhält eine neue Dexie-Version mit getesteter Upgrade-Funktion; bestehende Versionen dürfen nicht umdefiniert oder irreversibel überschrieben werden.

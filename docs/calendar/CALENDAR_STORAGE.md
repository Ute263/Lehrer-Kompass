# Speicherung und Migration

Dexie v4 ergänzt `timetablePeriods`, `weeklyScheduleSlots`, `calendarEvents` und `calendarEventHistory`. Die Tabellen und Indizes der Versionen 1 bis 3 bleiben Bestandteil derselben Versionskette. Demo-Blöcke, zwei Wochen-Slots und künstliche Termine werden durch `seed-calendar-v4` genau einmal angelegt.

Migrationstests öffnen isolierte reale v3- und v1-Testdatenbanken anschließend mit dem v4-Schema. Zusätzlich wird ein Konflikt während einer Terminverschiebung geprüft; der Ausgangstermin bleibt dabei unverändert.

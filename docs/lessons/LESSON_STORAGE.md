# Lokale Speicherung und Migration

Dexie-Schema v3 ergänzt `lessons`, `lessonPlannings`, `lessonPhases`, `lessonReflections` und `lessonWorkbenchRefs`. Die v1- und v2-Tabellen bleiben in der Versionskette unverändert enthalten.

Automatisierte Migrationstests öffnen reale v1- beziehungsweise v2-Datenbanken anschließend mit `DomainDatabase` v3. Sie prüfen, dass Themen- und Reihendaten erhalten bleiben und die neue Schemaversion aktiv ist. Sämtliche Daten sind künstliche lokale Testdaten.

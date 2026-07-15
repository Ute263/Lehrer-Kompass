# Lokale Speicherung und Migration

Dexie v6 ergänzt die Tabellen `buddyRequests`, `buddySuggestions`, `buddySuggestionChanges` und `buddyVersions`. Die Änderung ist additiv; bestehende Tabellen und Daten aus v1 bis v5 bleiben erhalten.

Gespeichert werden lokale Anfrage-Metadaten, minimierter Kontext, validierte Vorschläge, einzelne Auswahlzustände und fachliche Snapshots für Rollback. Nicht gespeichert werden API-Schlüssel, Tokens, Anbieter-Anmeldedaten oder versteckte Systemprompts.

Die Migration ist sowohl direkt von v5 auf v6 als auch über die vollständige Kette v1→v2→v3→v4→v5→v6 automatisiert geprüft. Der Verlauf kann pro Ziel gelesen und ausdrücklich lokal gelöscht werden.


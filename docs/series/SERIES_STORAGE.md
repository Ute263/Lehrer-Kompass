# Reihenpersistenz und Migration

Dexie Schema v2 ergänzt `seriesTemplates`, `seriesImplementations`, `seriesPlannings`, `seriesSequenceItems` und `seriesWorkbenchRefs`. Die v1-Tabellen und Indizes bleiben unverändert. Der Migrationstest legt eine echte v1-Datenbank an, öffnet sie mit `DomainDatabase` v2 und prüft den Erhalt der vorhandenen Themen.

Der Reihen-Seed ist separat über `seed-series-v2` geschützt. Stammreihe, erste Durchführung, Grundplanung, Stundenfolge und Werkbankreferenz entstehen atomar. Zod validiert vollständige Lese-Snapshots; beschädigte Reihendaten führen zu `SERIES_DATA_INVALID`.

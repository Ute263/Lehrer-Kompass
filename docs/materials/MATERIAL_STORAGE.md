# Persistenz und Migration

Dexie-Schema v5 ergänzt `materialFamilies`, `materials`, `materialVariants`, `materialDocuments`, `materialPages`, `materialBlocks`, `materialSolutions`, `materialLinks` und `materialVersions`. Die Version baut additiv auf v1 bis v4 auf.

Migrationstests decken v4→v5 und v1→v2→v3→v4→v5 ab und bestätigen den Erhalt vorhandener Kalender- bzw. Themendaten. Strukturänderungen und Statusfreigaben erzeugen JSON-Snapshots. Vor einer Wiederherstellung wird eine zusätzliche Sicherungsversion angelegt.

Die größeren Bereiche Designsystem, Kalender und Materialwerkstatt/Vorschau werden route-basiert per `React.lazy` geladen. Produktionsbuild nach Paket 08: Hauptchunk 541,44 kB (gzip 162,45 kB), Materialchunk 19,67 kB (gzip 6,18 kB), Kalenderchunk 30,75 kB (gzip 8,71 kB), Designsystemchunk 7,96 kB (gzip 3,06 kB). Paket-07-Ausgangswert des Hauptchunks: 552,31 kB (gzip 165,45 kB).

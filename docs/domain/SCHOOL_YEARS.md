# Schuljahre

`SchoolYear` enthält ID, Bezeichnung, Beginn, Ende, Aktivstatus, Zeitstempel und optionalen Archivzeitpunkt. Beginn muss vor Ende liegen. `activateSchoolYear` deaktiviert in einer Dexie-Transaktion alle bisherigen Jahre und aktiviert genau das gewählte. Das Aktivieren verschiebt keine Klassen. Das aktive Jahr kann nicht archiviert werden.

Seed: 2025/26 archiviert/inaktiv, 2026/27 aktiv. Weitere Jahre werden zunächst inaktiv angelegt.

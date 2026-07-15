# Themen

`Topic` gehört zu genau einer Klasse und einem Fach. Es enthält Titel, optionale Beschreibung, Sortierung, Status `active|archived` und Zeitstempel. Normalisierte Titel sind nur innerhalb derselben Klasse-Fach-Kombination eindeutig.

Services unterstützen Anlegen, Umbenennen, Archivieren, Wiederherstellen und zugängliches Auf-/Ab-Sortieren. Archivieren ist Soft Delete; Wiederherstellen prüft erneut auf Duplikate. Unterthemen und Unterrichtsreihen gehören nicht zu Paket 04.

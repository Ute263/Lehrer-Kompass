# Übernahme, Version und Rollback

Generieren und Anzeigen sind schreibgeschützt gegenüber Fachdaten. Erst eine bewusste Auswahl aktiviert die Übernahme. Änderungen werden innerhalb einer Dexie-Transaktion über `LessonService` beziehungsweise `MaterialService` ausgeführt; React-Komponenten enthalten keine fachliche Mutationslogik.

Vor größeren Änderungen speichert `BuddyService` einen Snapshot in `buddyVersions`. Nicht ausgewählte Teiländerungen bleiben unverändert. Beratende Hinweise verändern keine Fachdaten. Ist das Ziel seit Erzeugung geändert worden, bricht die Übernahme mit `BUDDY_TARGET_STALE` ab.

Rollback stellt den Stunden-Snapshot beziehungsweise eine vorhandene Materialversion über den zuständigen Domainservice wieder her. Jede Übernahme und jeder Rollback bleibt im lokalen Verlauf nachvollziehbar.


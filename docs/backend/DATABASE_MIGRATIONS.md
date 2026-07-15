# Datenbankmigrationen

Initiale Migration: `prisma/migrations/20260715220000_initial_secure_backend/migration.sql`. Lokal wird sie nur gegen eine leere, isolierte Testdatenbank ausgeführt. Produktion darf ausschließlich nach Backup, Review und expliziter Freigabe `prisma migrate deploy` ausführen.

Wiederherstellung: Anwendung stoppen, fehlgeschlagene Migration nicht als erfolgreich markieren, Datenbank aus geprüftem Backup wiederherstellen, Migrationsursache korrigieren und gegen eine Kopie erneut testen. Keine automatische Kaskadenlöschung und kein produktives `db push`.


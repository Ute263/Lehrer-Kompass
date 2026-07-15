# PostgreSQL und Prisma

`prisma/schema.prisma` beschreibt Benutzer, Workspace, Session und alle geforderten Fachobjekttypen mit `workspaceId`. Die geprüfte initiale SQL-Migration setzt echte Fremdschlüssel, zusammengesetzten Ressourcenschlüssel, Restrict-Löschung, Teilindex für aktive Titel und Audit-/Importtabellen um.

Lokale Integrationstests starten einen isolierten echten PostgreSQL-18-Prozess über das plattformspezifische `embedded-postgres`-Binärpaket. SQLite und `db push` werden nicht verwendet.


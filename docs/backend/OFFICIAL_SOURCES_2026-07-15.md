# Geprüfte offizielle Dokumentationen – 15.07.2026

- Microsoft Identity: Authorization Code mit PKCE, unterstützte Kontotypen, OIDC Discovery/JWKS und Graph Auth (Links in `docs/auth/MICROSOFT_IDENTITY.md`).
- [Fastify 5 Server](https://fastify.dev/docs/latest/Reference/Server/), [Validierung](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/), [Hooks](https://fastify.dev/docs/latest/Reference/Hooks/), [Logging](https://fastify.dev/docs/latest/Reference/Logging/).
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate), [PostgreSQL Connector](https://www.prisma.io/docs/orm/core-concepts/supported-databases/postgresql), [Relation mode/FKs](https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/relation-mode).
- [PostgreSQL 18 Data Definition](https://www.postgresql.org/docs/current/ddl.html).
- OpenAI: Structured Outputs, Production, Safety und Data Controls (Links in `docs/buddy/OPENAI_SERVER_ADAPTER.md`).

Konsequenzen: keine eigene Tokenkryptografie, PKCE/OIDC, echte PostgreSQL-FKs, versionierte SQL-Migration, validierte API-/Providerdaten, redigierte Logs und ausschließlich serverseitige Secrets.

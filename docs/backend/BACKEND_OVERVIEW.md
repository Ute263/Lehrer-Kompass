# Backend-Überblick

Paket 10 ergänzt ein modulares Fastify-5-Backend unter `apps/api`. Module trennen Konfiguration, Identität, Session-/Workspace-Policy, Import, Buddyprovider und Verträge. `Store` ist der deterministische Testadapter; PostgreSQL/Prisma bilden das verbindliche Persistenzschema. Routen vertrauen niemals einer Client-Workspace-ID.

Betriebsarten: lokale Dexie-App ohne Backend, lokaler Server mit Mock-Identität/Mock-Buddy, isolierter Integrationstest mit PostgreSQL sowie ausschließlich vorbereitete Produktion.


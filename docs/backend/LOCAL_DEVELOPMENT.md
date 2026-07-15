# Lokale Entwicklung

```bash
pnpm api
pnpm design-system
pnpm test:api
pnpm test:db-migrations
```

API: `http://127.0.0.1:4180`; Web: standardmäßig `http://127.0.0.1:4173`; Modusansicht: `/server-test`. Reale Secrets gehören in eine ignorierte `.env`, niemals in `.env.example`. Die Datenbanktests starten und entfernen ihre isolierte PostgreSQL-Instanz automatisch unter `tmp/`.


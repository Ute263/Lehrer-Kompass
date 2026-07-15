# Secrets

Secrets existieren nur in serverseitigen Umgebungsvariablen oder einem späteren Secret Store. `.env` ist ignoriert; `.env.example` enthält leere Platzhalter. API-Schlüssel, Microsoft-Client-Secret, Sessions und Providerantworten dürfen weder Bundle, Dexie, Export, Screenshot noch Log erreichen. `pnpm test:secret-scan` prüft Quellcode und Platzhalter.


# API-Verträge

Versionierte Routen liegen unter `/api/v1`. Health und Readiness sind öffentlich; alle übrigen Routen benötigen eine serverseitige Sitzung. Schreibzugriffe benötigen erlaubten Origin und CSRF-Token. Zod validiert Import-, Ressourcen- und Buddy-Eingaben. Fehler folgen `{ error: { code, message, requestId } }` und verraten bei IDOR nicht, ob ein fremdes Objekt existiert.

Der vertikale Schnitt umfasst Bootstrap, Workbench, Klassen, Reihe, Stunde, Material, Ressourcenänderungen, Soft-Archivierung, Importvorschau/-commit, Audit und Buddy-Mock.


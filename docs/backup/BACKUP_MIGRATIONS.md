# Sicherungsmigrationen
`backupMigrations` ist das zentrale, sequenzielle Register. Aktuell ist Formatversion 1 gültig; neuere Versionen werden ruhig abgelehnt. Eine zukünftige Migration arbeitet auf `structuredClone` und verändert die Originaldatei nicht. Dexie wurde additiv v6→v7 erweitert; die vollständige Versionskette bleibt definiert und getestet.

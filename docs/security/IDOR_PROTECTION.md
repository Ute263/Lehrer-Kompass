# IDOR-Schutz

Ressourcen werden immer als Objekt-ID plus autorisierter Workspace geladen. Fremde IDs liefern denselben ruhigen `RESOURCE_NOT_FOUND`-Fehler wie fehlende IDs. Automatisiert geprüft sind Lesen, Ändern, Archivieren, Verknüpfen, Import, Buddy-Kontext, Audit, erratene IDs und manipulierte Workspace-IDs mit zwei Nutzern.


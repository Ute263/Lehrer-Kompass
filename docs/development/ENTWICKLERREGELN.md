# Entwicklerregeln für Codex

## Struktur
Monorepo mit `apps/web`, `apps/api`, optional `apps/worker` sowie Paketen für Domain, Datenbank, Validierung, Designsystem, Materialmodell, Dokumentrenderer und KI-Verträge.

## Codierregeln
- TypeScript Strict Mode; keine unbegründeten `any`.
- Fachlogik nicht in React-Komponenten.
- API-Ein- und Ausgaben sowie Imports, KI- und OneDrive-Daten mit Zod validieren.
- Statuswerte zentral definieren.
- UTC für Zeitstempel; reine Schultage als Datum.
- echte Fremdschlüssel, Transaktionen für komplexe Vorgänge, Soft Delete/Papierkorb.
- keine Secrets, echten personenbezogenen Daten oder Produktionslinks im Repository.

## Migrationen
Jede Schemaänderung benötigt eine Prisma-Migration. Riskante Änderungen schrittweise: neue Struktur ergänzen, Daten migrieren, Anwendung umstellen, alte Struktur später entfernen. Bericht mit Zweck, betroffenen Tabellen, Datenumwandlung und Rückrollmöglichkeit.

## Autosave und Offline
Lokale Änderung sofort in IndexedDB, gebündeltes Speichern zum Server, geordnete Warteschlange pro Objekt, Version beim Speichern mitsenden, Konflikte nicht überschreiben. Beim Arbeitsplatzwechsel offene Änderungen sofort sichern.

## OneDrive
Nur Testordner in automatisierten/manuellen Integrationsprüfungen. Primär `driveId`/`itemId`, nicht nur Pfad. Keine Löschung, Verschiebung, Überschreibung oder Freigabe ohne Bestätigung.

## KI
Alle Aufrufe serverseitig. Fähigkeiten zentral registrieren. Systemanweisung, Nutzerauftrag und untrusted Quelleninhalt trennen. Schema validieren, Vorschlag speichern, Vorschau anzeigen, erst nach Bestätigung anwenden.

## Material
Strukturiertes Dokumentmodell; kein vollständiges HTML als alleinige Fachdaten. Lösungen an Aufgaben-IDs binden. PDF auf A4, Seitenumbrüche, Überlappungen und Öffnung prüfen. DOCX auf Bearbeitbarkeit und Struktur prüfen.

## Tests
- Unit: Fachlogik, Status, Vererbung, Zeiten, Lösungen, Versionen, Warteschlange.
- Integration: API/Datenbank, Durchführung, Terminierung, Buddy-Übernahme, Materialverknüpfung, Import, Papierkorb.
- E2E: neue Reihe, Stunde, Kalender, Material, Export, Tagesübersicht, Reflexion, Abschluss, Wiederherstellung.
- visuell: AppShell, Werkbank, Reihe, Stunde, Material, PDF, Vertretungsübersicht.
- Accessibility-Basistests und Migrationstests in CI.

Tests nicht entfernen oder abschwächen, um Builds erfolgreich erscheinen zu lassen.

## Definition of Done
UI, echte Aktion, Speicherung, Validierung, Berechtigung, Lade- und Fehlerzustand, Tests, Dokumentation und manuelle Prüfschritte. Keine Attrappe.

## Berichte
Nach jedem Paket `docs/reports/PACKET_XX_ABSCHLUSSBERICHT.md` mit: Ziel, umgesetzt, nicht umgesetzt, Dateien, Migrationen, Umgebungsvariablen, Tests, Ergebnisse, manuelle Prüfung, Einschränkungen, Risiken, nächster Schritt.

## Stop-Regeln
Stoppen bei Datenverlustrisiko, unsicherer Migration, unklarer Berechtigung, Datenschutzkonflikt, zentralem Widerspruch, notwendiger Architekturänderung oder fehlenden Zugangsdaten, die eine echte Prüfung verhindern.
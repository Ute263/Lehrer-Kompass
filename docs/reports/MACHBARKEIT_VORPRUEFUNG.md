# Machbarkeit – Vorprüfung

## Ausgangslage

- Branch: `codex/arbeitspaket-00-personal-accounts`, erstellt vom aktualisierten `main` nach Aufnahme von ADR-001 und DEC-031 bis DEC-034.
- Repository vor Paketbeginn: ausschließlich Produkt-, Architektur- und Arbeitsdokumentation; kein Produktcode.
- Vorhandene Integrationen: keine.
- Vorhandene Tests, Migrationen und Paketkonfiguration: keine.
- Lokale Laufzeit: Node.js 24.14.0, pnpm 11.7.0 und Python 3.12.13 aus der Codex-Arbeitsumgebung.
- Dokumentwerkzeuge: LibreOffice/soffice sowie Poppler (`pdftoppm`, `pdfinfo`) verfügbar.

## Zugangsdaten

Zum Prüfzeitpunkt waren keine Umgebungsvariablen für Microsoft Graph/OneDrive, OpenAI oder PostgreSQL gesetzt. Deshalb gelten:

- OneDrive: echter Adaptervertrag für persönliche Microsoft-Konten (`consumers`), ausführbarer Smoke-Test und Testanleitung werden vorbereitet; Funktionsabläufe und Nutzertrennung werden mit sicheren Mocks geprüft. Reale Anmeldung und Graph-Aufrufe sind ohne persönliche Testkonfiguration blockiert. Das Schulkonto wird nicht verwendet.
- OpenAI: echter serverseitiger Adaptervertrag und Testanleitung werden vorbereitet; die Fähigkeit `shorten_lesson` wird mit einem deterministischen Mock geprüft. Ein echter Modellaufruf ist blockiert.
- PostgreSQL: für die fünf abgegrenzten Risikoprototypen ist keine produktive Datenbank erforderlich. Eine reale API-/Datenbankintegration ist nicht Gegenstand der isolierten Prototypen und wird nicht als getestet gemeldet.

## Geplanter Prüfaufbau

Jeder Prototyp liegt getrennt unter `prototypes/`, besitzt ein README mit automatischen und manuellen Kriterien und verwendet ausschließlich künstliche Daten. Gemeinsame Verträge nutzen TypeScript Strict Mode, Zod und ein einheitliches Fehlerformat. Lokale Artefakte werden unter `artifacts/machbarkeit/` erzeugt.

## Schutzmaßnahmen

- Keine echten Unterrichts-, Kinder- oder Produktionsdaten.
- Keine Secrets im Frontend oder Repository; `.env.example` enthält nur leere Platzhalter.
- Kein realer OneDrive-Zugriff ohne explizite Testordner-IDs.
- Der Mock verweigert Operationen außerhalb seines ausgewiesenen Testordners und unterstützt keine Löschung.
- Persönliche Workspaces werden aus der authentifizierten Identität bestimmt; clientseitige Nutzerkennungen bestimmen niemals den Datenzugriff.
- Mehrere Personen werden ausschließlich als voneinander getrennte Einzelarbeitsplätze geprüft; es gibt keine Zusammenarbeit oder gemeinsamen Fachdaten.
- Keine produktive LehrerKompass-App oder endgültige Produkt-UI.

## Status

Die lokale Prototypentwicklung ist ausführbar. Reale Microsoft- und OpenAI-Integrationsprüfungen bleiben wegen fehlender Zugangsdaten blockiert und werden durch Adapter, Mock, automatisierte Tests und exakte manuelle Testschritte ersetzt.

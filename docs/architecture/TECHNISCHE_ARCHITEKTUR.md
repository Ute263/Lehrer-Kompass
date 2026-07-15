# Technische Architektur

## Zielbild
Offlinefähige PWA mit serverseitiger Fachlogik, PostgreSQL-Datenbank, OneDrive-Dateispeicher und kontrollierter OpenAI-Integration.

## Stack
Frontend: React, TypeScript, Vite, React Router, TanStack Query, Zustand, Dexie/IndexedDB, React Hook Form, Zod, dnd-kit.
Backend: Node.js, TypeScript, Fastify, Prisma, PostgreSQL.
Dateien: Microsoft Graph/OneDrive.
KI: OpenAI API ausschließlich serverseitig.

## Empfohlene Struktur
```text
apps/
├── web/
├── api/
└── worker/
packages/
├── domain/
├── database/
├── validation/
├── design-system/
├── material-model/
├── document-renderer/
├── ai-contracts/
└── configuration/
```

## Speicherung
- PostgreSQL: Hauptdaten, Beziehungen, Versionen, Kalender, Bibliotheksmetadaten.
- IndexedDB: lokale Arbeitskopien, Entwürfe, Offline-Warteschlange, Vorschauen.
- OneDrive: PDF, DOCX, Bilder, Präsentationen, Exporte.

## Synchronisation
Optimistische UI, Objektversionsnummern und geordnete lokale Warteschlange. Konflikte werden nicht automatisch überschrieben. Unterschiedliche Felder dürfen sicher zusammengeführt werden; komplexe Dokumente werden als getrennte Fassungen erhalten.

## OneDrive
Nur ausgewählte Ordner. Speicherung von `driveId`, `itemId`, ETag, Web-URL, Pfad und Syncstatus. Delta-Abfragen für Änderungen. Bestehende Dateien standardmäßig verknüpfen; Bearbeitung als Kopie oder Variante.

## Buddy
Zentrales Fähigkeitsregister mit Zod-Schemata, begrenzten Kontextpaketen, Structured Outputs und kontrollierten Anwendungsschritten. Dokumentinhalte gelten als nicht vertrauenswürdige Daten und dürfen Systemregeln nicht überschreiben.

## Materialsystem
Internes JSON-Dokumentmodell mit Seiten und Blocktypen. PDF serverseitig über HTML/CSS und Browser-Rendering; DOCX über eigenen Renderer. Aufgaben enthalten strukturierte Lösungsdefinitionen.

## Sicherheit
HTTPS, sichere Sitzungen, serverseitige Validierung, minimale Graph-Berechtigungen, keine Secrets im Browser, keine sensiblen Inhalte in Logs, Rate Limits und Datenschutzfilter.

## Hosting
Frontend kann auf Cloudflare Pages liegen. API, Worker und Dokumentrendering benötigen voraussichtlich einen klassischen Node-Host; PostgreSQL wird verwaltet betrieben. Der technische Machbarkeitscheck bestätigt oder korrigiert diese Annahme.
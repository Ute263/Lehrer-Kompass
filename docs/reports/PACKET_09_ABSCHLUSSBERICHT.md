# Paket 09 – Abschlussbericht

## 1. Ziel

Ein kontrollierter, kontextbezogener KI-Buddy, der Vorschläge vorbereitet und Fachdaten ausschließlich nach bewusster Auswahl über bestehende Domainservices verändert.

## 2. Ausgangslage

Basis ist Paket 08 auf Commit `b97de9c` mit AppShell, Dexie v5, Unterrichtsstunden, Reihendurchführungen und Materialien.

## 3. Umgesetzter Umfang

Zentrales Fähigkeitsregister, minimierter Kontext, Quellen- und Datenschutzregeln, Zod-validierte Vorschläge, Mock-Adapter, vorbereiteter OpenAI-Adapter, Drawer, Vorschau, Vergleich, Voll-/Teilübernahme, Version, Rollback, Aktualitätsprüfung, Injection-Schutz und lokaler Verlauf sind umgesetzt.

## 4. Nicht umgesetzt

Keine produktive KI-Ausführung, kein Backend, kein API-Schlüssel, keine automatische Änderung, keine Bild-/Websuche und keine fachlichen Funktionen außerhalb Paket 09.

## 5. Fähigkeitsregister

Alle zehn geforderten Fähigkeiten sind in `apps/web/src/ai/capabilities.ts` zentral mit Zieltypen, Kontextabschnitten, Modellprofil, Versionsbedarf und Übernahmestrategie registriert.

## 6. Kontextmodell

Kontext wird je Fähigkeit durch Positivlisten minimiert. Vollständiger Datenbestand, andere Arbeitsplätze, private Notizen und nicht erforderliche Reflexionen sind ausgeschlossen.

## 7. Quellenmodell

Quellen besitzen Typ, Bezeichnung, Herkunft und Freigabestatus. Nicht freigegebene sowie fremde Quellen werden entfernt; der Mock erfindet keine externen Quellen.

## 8. Vorschlagsmodell

Anfragen, Antworten, Vorschläge und Änderungen werden mit Zod validiert. Freitext allein ist nicht anwendbar.

## 9. Änderungsoperationen

Erlaubt sind begrenzte Feldersetzung, Stundenphasenänderung, Materialaufgabenänderung, Variantenplan und beratender Hinweis. Unbekannte Operationen werden abgewiesen.

## 10. Vorschau und Vergleich

Vor dem Start zeigt der Drawer verwendete und ausgeschlossene Kontextkategorien. Danach erscheinen Zusammenfassung, Begründung sowie menschlich lesbare Bisher-/Vorgeschlagen-Vergleiche.

## 11. Teilübernahme

Jede Änderung ist einzeln auswählbar. Nur ausgewählte IDs werden innerhalb einer Transaktion angewendet.

## 12. Versionierung und Rollback

Vor fachlichen Änderungen entsteht ein `buddyVersions`-Snapshot. Stunden werden aus dem Snapshot, Materialien über ihre vorhandene Versionierung zurückgesetzt.

## 13. Sicherheit und Prompt Injection

Eingaben, Fachdaten und Quellen werden auf eingebettete Instruktionen geprüft. Positivlisten, doppelte Schema-Prüfung, Zielbindung und strukturierte Fehlercodes begrenzen Adapterausgaben.

## 14. Datenschutzfilter

Typische Namens-, Diagnose- und private Angaben werden blockiert. Es wurden ausschließlich künstliche lokale Demodaten verwendet.

## 15. Mock-Adapter

Der Mock-Modus ist vollständig implementiert und real lokal getestet. Er arbeitet deterministisch, ohne Netzwerkzugriff, und unterstützt alle zehn Fähigkeiten.

## 16. OpenAI-Adaptervorbereitung

Der Clientadapter ist vorbereitet, aber absichtlich nicht ausführend. Eine echte Ausführung ist wegen fehlendem sicheren Backend-Endpunkt und freigegebenem Testschlüssel blockiert und wurde nicht als getestet gemeldet.

## 17. Buddy-Drawer und UI

Der vorhandene AppShell-Drawer wurde wiederverwendet. Ziel, Mock-Kennzeichnung, maximal fünf passende Fähigkeiten, Kontextvorschau, Lade-, Vorschlags-, Erfolgs- und Fehlerzustände sind integriert.

## 18. Material- und Stundenintegration

Stundenänderungen laufen über `LessonService`, Materialänderungen über `MaterialService`. Reihendurchführungen erhalten beratende Vorschläge. Generierung selbst mutiert keine Fachdaten.

## 19. Persistenz und Migration

Dexie v6 ergänzt `buddyRequests`, `buddySuggestions`, `buddySuggestionChanges` und `buddyVersions`. v5→v6 sowie v1→v2→v3→v4→v5→v6 wurden mit Datenerhalt getestet.

## 20. Responsive Verhalten

Drawer-Verhalten wurde auf Desktop sowie mit Tablet- und Smartphone-Viewport geprüft. Der Hauptarbeitsplatz bleibt visuell nachgeordnet abgedunkelt; der Drawer bleibt bedienbar.

## 21. Accessibility

Der Drawer nutzt Dialogsemantik, Fokusfalle, Escape und Fokusrückgabe. Die Buddy-Basistests mit axe bestehen auf Stunden- und Materialziel.

## 22. Tests

Geprüft wurden Register, zehn Fähigkeiten, Kontextminimierung, Datenschutz, Quellen, Injection, ungültige Ausgaben/Operationen, Adapterfehler, Nichtmutation, Voll-/Teilübernahme, Version, Rollback, Aktualitätskonflikt, Migration, UI und Accessibility.

## 23. Testergebnisse

`pnpm check` am 15.07.2026: TypeScript strict erfolgreich; 33 Testdateien mit 230 Tests erfolgreich; Produktionsbuild erfolgreich; 9 Accessibility-Dateien mit 17 Tests erfolgreich. Die jsdom-Canvas-Hinweise sind erwartete Hinweise aus bestehenden Materialtests, keine Fehler.

## 24. Visuelle Prüfungen

22 JPEG-Artefakte liegen unter `artifacts/package-09/`; Endung und JFIF/JPEG-Format wurden mit `file` geprüft. Drawer-, Material-, Kein-Kontext- und Responsive-Routen wurden real im lokalen Browser geöffnet. Die fachlichen Zwischenzustände sind zusätzlich durch die UI-Tests reproduzierbar abgesichert.

## 25. Neue Abhängigkeiten

Keine.

## 26. Bekannte Einschränkungen

Die echte OpenAI-Ausführung ist nur vorbereitet. Der Vite-Build meldet den bestehenden Haupt-Chunk mit 576,84 kB als größer als 500 kB; die bereits vorhandenen großen Routen bleiben getrennte Chunks.

## 27. Risiken

Vor Produktivbetrieb sind ein gehärteter Serverendpunkt, Authentifizierung, Rate-/Kostenlimits, Löschkonzept, Datenschutzfreigabe und reale Adaptertests erforderlich. Providerantworten müssen weiterhin als unvertrauenswürdig gelten.

## 28. Empfehlung für Paket 10

Die lokale Architektur kann als kontrollierte Buddy-Basis dienen. Paket 10 sollte keine Client-Schlüssel ergänzen, sondern zuerst den sicheren Serververtrag, Auditierbarkeit und freigegebene Testdaten verbindlich machen.

**Status: Paket 09 lokal abgeschlossen.**


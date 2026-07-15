# Technischer Machbarkeitscheck – Gesamtbericht

## Repository-Ausgangslage

Das aktualisierte `main` enthielt nur verbindliche Projekt- und Architekturdokumentation einschließlich ADR-001 und DEC-031 bis DEC-034. Für die aktualisierte Ausführung wurde der Branch `codex/arbeitspaket-00-personal-accounts` angelegt. Produktcode, Tests, Integrationen, Migrationen und Paketkonfiguration bestanden zuvor nicht.

Umgesetzt wurden ausschließlich fünf getrennte technische Prototypen, künstliche Testdaten, lokale Artefakte und Paketberichte. Es entstand keine produktive LehrerKompass-App.

## Ergebnisübersicht

### A – OneDrive

Adaptervertrag, sicherer Testordner-Mock, reale Graph-Requestimplementierung, stabile IDs, Dateiabläufe, Überschreibschutz und persönlicher Smoke-Test sind umgesetzt und automatisch geprüft. Die Authority ist auf persönliche Konten (`consumers`) festgelegt. `/me` wird gegen die freigegebene persönliche Konto-ID geprüft. Echte Microsoft-Anmeldung und reale OneDrive-Operationen sind mangels persönlicher Test-App, Token und privater Ordner-IDs blockiert; das Schulkonto wurde nicht verwendet.

Zwei simulierte persönliche Identitäten erhalten getrennte serverseitige `userId`-/Workspace-Werte, App-Daten und OneDrive-Verknüpfungen. Clientseitig vorgegebene fremde Nutzerkennungen werden ignoriert. Ein Kontowechsel legt keine Daten des vorherigen Kontos offen. Es wurden keine Team-, Rollen- oder Zusammenarbeitsfunktionen gebaut.

### B – Dokumente

PDF und DOCX wurden aus einem strukturierten Modell real lokal erzeugt. PDF ist A4, beide Fassungen besitzen eine getrennte Lösung und wurden vollständig als PNG geprüft. DOCX wurde in LibreOffice geöffnet, bearbeitet, gespeichert und erneut gerendert. Die verpflichtende Microsoft-Word-Prüfung und ein physischer 100-Prozent-Ausdruck bleiben manuell offen.

### C – Offline/Autosave

Dexie-Arbeitskopie, Warteschlange, Wiederverbindung und Konflikterhalt sind implementiert und automatisch getestet. Browser-IndexedDB wurde real lokal angesteuert; Netzwerk/API/PostgreSQL sind simuliert.

### D – Buddy

Zod-Vertrag, 52→45-Minuten-Vorschlag, Schutz von Lernziel/Sicherung, Version vor Übernahme, Teilübernahme und Injection-Test sind mit Mock automatisch geprüft. Ein echter OpenAI-Aufruf ist mangels Zugangsdaten blockiert.

### E – Bibliothek

Zehn künstliche Dateien, Pflichtformate, Metadatenindex, fünf Suchanfragen, Filter, Mehrfachverknüpfung und unklare Zuordnung sind lokal umgesetzt und getestet. Produktive Extraktion/OCR und OneDrive-Indexierung sind nicht Bestandteil des Prototyps.

## Tests und Prüfnachweise

- TypeScript Strict Build: bestanden.
- Vitest: 7 Testdateien, 23 Tests, alle bestanden.
- Coverage: 84,65 % Statements, 79,51 % Branches, 85,48 % Funktionen, 89,01 % Zeilen. Der nicht ausgeführte reale Graph-I/O-Pfad senkt die Abdeckung transparent.
- Browserprüfung: OneDrive-Mock, Offline-Status, Buddy-Mock, Bibliothekssuche und Dokumentlinks funktionierten. Basisa11y: deutsche Dokumentsprache, je Oberfläche eine Hauptüberschrift, beschriftete Formfelder und Text auf Schaltflächen.
- PDF: zwei A4-Seiten, Poppler-Render aller Seiten visuell geprüft.
- DOCX: zwei Seiten mit LibreOfficeDev 26.8.0.0.alpha0 gerendert und visuell geprüft; editierte temporäre Kopie erneut erfolgreich gerendert.
- Microsoft Word, reale persönliche Microsoft Graph API und reale OpenAI API: nicht getestet.

## Architekturfolgen

- Die vorgesehenen Adaptergrenzen für OneDrive und OpenAI sind sinnvoll und müssen serverseitig bleiben.
- Authentifizierte persönliche Identität, interne `userId` und persönlicher Workspace müssen serverseitig verknüpft werden; der Client darf den Workspace niemals bestimmen.
- Dieselbe App kann mehrere vollständig getrennte Einzelarbeitsplätze bedienen. Dies begründet keine Zusammenarbeit und keine geteilten Fachdaten.
- Zod-Verträge und ein gemeinsames Fehlerformat sollten als eigene Pakete übernommen werden.
- Das Materialmodell muss Renderer-unabhängig bleiben; PDF und DOCX benötigen getrennte Renderer und getrennte Abnahmekriterien.
- Offline-Synchronisation braucht Objektversionen, eine dauerhafte Queue und explizite Konfliktobjekte; automatische Überschreibung ist auszuschließen.
- Bibliotheksobjekt und Datei müssen getrennt bleiben; Mehrfachverknüpfung funktioniert ohne Kopien.

## Hosting-Empfehlung

Das Frontend kann als PWA statisch bereitgestellt werden. Fastify-API, Microsoft-/OpenAI-Secrets, Prisma/PostgreSQL und serverseitiges Dokumentrendering benötigen einen klassischen Node-Host bzw. getrennten Worker mit verwalteter PostgreSQL-Datenbank. Cloudflare Pages allein reicht für die Gesamtarchitektur nicht. Dokumentrendering sollte wegen CPU-/Speicherbedarf, Timeouts und nativen Browserabhängigkeiten isoliert betreibbar sein.

## Sicherheit und Datenschutz

Alle Testdaten sind künstlich. Es wurden keine echten Unterrichts-, Kinder- oder OneDrive-Daten verwendet. Keine Secrets wurden gespeichert. OneDrive-Mock und Graph-Adapter erzwingen persönliches Konto, freigegebenes Drive und ausgewählte private Testordner; Löschen ist ausgeschlossen. Workspace-Tests verhindern kontoübergreifende Daten- und Verknüpfungssichtbarkeit. Buddy-Quellen werden als nicht vertrauenswürdig behandelt, und Vorschläge ändern Originale nicht automatisch.

Vor Produktivbetrieb fehlen reale Nachweise für Microsoft-Berechtigungen, Tokenhaltung, Datenschutzfilter im OpenAI-Adapter, Rate Limits, Logbereinigung, Backup/Wiederherstellung und serverseitige Autorisierung.

## Kosten- und Betriebsrisiken

- Node-Host und Browser-Dokumentrendering verursachen mehr Betriebsaufwand als rein statisches Hosting.
- PostgreSQL, Dateiextraktion und Hintergrundindexierung benötigen Überwachung und Backup.
- OpenAI-Kosten müssen pro Fähigkeit begrenzt und beobachtet werden; der Betrieb darf nicht von KI abhängen.
- Microsoft Graph kann durch Berechtigungen, Tenantregeln, Drosselung und Tokenablauf beeinflusst werden.
- PDF/DOCX-Renderer benötigen reproduzierbare Fonts und Regressionstests.

## Offene Zugangsdaten und manuelle Gates

- Persönliche Microsoft-Test-App mit `consumers`, temporärer serverseitiger Zugriffstoken, persönliche Konto-ID und explizite private OneDrive-Testordner-IDs. Das Schulkonto ist ausgeschlossen.
- OpenAI-Testschlüssel und freigegebenes Modell für serverseitigen Structured-Output-Test.
- Spätere Testdatenbank für echte API-/Prisma-Integration.
- Microsoft Word für die verpflichtende DOCX-Bearbeitungsprüfung.
- Physischer A4-Testdruck bei 100 Prozent.

## Wiederverwendbarer Code

Wiederverwendbar sind Zod-Domänenverträge, gemeinsames Fehlerformat, persönliche Sitzungs-/Workspace-Trennung, OneDrive-Graph-Adapter und Dateischutz-Mock, Materialmodell, Offline-Queue-/Konfliktprinzip, Buddy-Vorschlags-/Versionslogik sowie Bibliotheksmetadaten und Suchtests. Die einfachen HTML-Oberflächen sind ausdrücklich nur Prüfoberflächen.

## Schlussentscheidung

Hauptentwicklung kann nach Anpassungen beginnen.

Erforderliche Anpassungen sind der reale Graph-Test mit dem persönlichen Konto und ausschließlich privatem OneDrive-Testordner, der reale OpenAI-Test, die Microsoft-Word-/Druckabnahme sowie die Überführung der Workspace- und Prototypverträge in die geplante Monorepo-Paketstruktur. Bis dahin dürfen Cloud-Integrationen und Dokumentkompatibilität nicht als produktionsreif bezeichnet werden.

# CODEX-Kickoff 00 – Verständnisbericht

## Ausgangslage und Prüfrahmen

Dieser Bericht dokumentiert ausschließlich den in `CODEX_KICKOFF_00_VERSTAENDNISCHECK.md` geforderten Verständnischeck. Grundlage waren `CODEX_MASTERPROMPT.md`, `PROJECT_BIBLE.md`, `DONT.md`, `CODEX_ARBEITSPAKET_00_TECHNISCHER_MACHBARKEITSCHECK.md` sowie alle Dateien unter `docs/`.

Das Repository befindet sich auf dem Branch `main` und liegt im geprüften Stand ausschließlich als Konzeptions- und Dokumentationsrepository vor. Es enthält noch keinen Produktcode, keine Prototypen, keine Paket- oder Buildkonfiguration, keine Datenbankmigrationen, keine Tests, keine Umgebungsvariablen und keine vorhandenen Integrationen. Der technische Machbarkeitscheck wurde im Rahmen dieses Berichts nicht begonnen. Es wurde keine Funktion implementiert oder als getestet bezeichnet.

## 1. Was ich verstanden habe

LehrerKompass ist ein privater, ruhiger digitaler Arbeitsplatz für eine einzelne Lehrkraft. Er unterstützt die Planung, Durchführung, Wiederverwendung und Reflexion von Unterricht sowie die Erstellung und Verwaltung von Material. Ziel ist nicht die maximale Anzahl sichtbarer Funktionen, sondern weniger Arbeitsaufwand, sichere Ordnung und ein fachlich nachvollziehbarer Planungsweg.

Die fachliche Arbeit beginnt nicht bei einem beliebigen Thema oder einem vorschnell erzeugten Arbeitsblatt. Sie folgt dem verbindlichen didaktischen Weg Vorgaben und Thema → Lernvoraussetzungen → Lernziel → fachlicher Aufbau → Methodik → Differenzierung → Material → Durchführung → Reflexion. Material ist das Ergebnis der Planung.

Die Hauptarbeitsplätze sind Werkbank, Unterrichtsreihe, Unterrichtsstunde, Materialwerkstatt, Bibliothek und Suche, Stundenplan/Kalender/Tagesübersicht sowie Förderunterricht. Der Buddy unterstützt kontextbezogen als freundliche, kreative Kollegin, bleibt aber kontrollierbar und visuell nachgeordnet. Die pädagogische Entscheidung liegt immer bei der Lehrkraft.

Die Produktidentität „The Quiet Workspace“ verlangt eine ruhige, hochwertige und zugängliche Oberfläche mit einem dominanten Hauptarbeitsplatz, viel Weißraum, dezenten Farben und einklappbaren Nebenbereichen. LehrerKompass ist ausdrücklich kein allgemeines Projektmanagement-, Schulverwaltungs-, Lernmanagement- oder Notensystem, kein Datei-Explorer, keine öffentliche Materialplattform und kein dominanter KI-Chat.

## 2. Verbindliche fachliche Struktur

Die sichtbare fachliche Hauptstruktur lautet:

**Klasse → Fach → Thema → Unterrichtsreihe → Unterrichtsstunde → Material.**

Im Datenmodell wird sie präzisiert durch Schule, Schuljahr und konkrete Klasse/Lerngruppe sowie durch die Trennung von Stammreihe (`SeriesTemplate`) und Durchführung (`SeriesImplementation`).

- **Stammreihe und Durchführung:** Die Stammreihe bewahrt den langfristig wiederverwendbaren fachlichen Grundaufbau. Eine Durchführung bindet diesen Aufbau an eine konkrete Klasse, ein Schuljahr, einen Zeitraum, Termine, Anpassungen und Reflexionen. Eine neue Klasse oder ein neues Schuljahr erzeugt eine neue Durchführung. Lokale Änderungen verändern die Stammreihe nicht automatisch; eine spätere Rückübernahme muss bewusst erfolgen. Frühere Durchführungen bleiben erhalten.
- **Unterrichtsstunde und Kalendereintrag:** Die Stunde enthält die pädagogische Planung. Der Kalendereintrag verwaltet ausschließlich ihre zeitliche Einordnung. Eine Stunde kann historische Termine, aber höchstens einen aktiven Termin haben. Ausfall oder Verschiebung darf den Stundeninhalt nicht automatisch verändern.
- **Material und Materialdatei:** `Material` ist das fachlich strukturierte Objekt mit Aufgaben, Lösungen, Varianten, Metadaten und Beziehungen. `MaterialFile` ist eine konkrete Datei oder Repräsentation. Ein Material kann mehrere Dateien und Varianten besitzen. Eine Datei kann über Verknüpfungen mehrfach genutzt werden, ohne für jeden Einsatz kopiert zu werden.
- **Werkbank:** Ein `WorkbenchEntry` ist nur ein Verweis auf eine aktive Arbeit. „Von Werkbank nehmen“ entfernt diesen Verweis und löscht weder das Fachobjekt noch seine Dateien. Die Werkbank zeigt nur aktive Werkstücke und unterstützt Unterbrechungen sowie späteres Weiterarbeiten.

Weitere verbindliche Konsequenzen sind echte Beziehungen und Fremdschlüssel, Soft Delete/Papierkorb, Versionen, bewusste Vererbung und keine unsicheren Kaskaden. Buddy-Vorschläge bleiben eigene Vorschlagsobjekte, bis sie bestätigt werden.

## 3. Verbindliche technische Architektur

- **Frontend:** installierbare, offlinefähige PWA mit React, TypeScript im Strict Mode, Vite, React Router, TanStack Query, Zustand, Dexie/IndexedDB, React Hook Form, Zod und dnd-kit.
- **Backend:** Node.js und TypeScript mit Fastify. Fachlogik, Validierung, Integrationen, KI-Aufrufe und sicherheitsrelevante Vorgänge laufen serverseitig.
- **Datenbank:** PostgreSQL ist die serverseitige Hauptdatenbank; Prisma verwaltet Schema und Migrationen. Beziehungen, Versionen, Kalenderdaten und Bibliotheksmetadaten gehören in diese Datenbank.
- **IndexedDB:** Dexie/IndexedDB enthält lokale Arbeitskopien, Entwürfe, Vorschauen und die geordnete Offline-Warteschlange. Lokale Speicherung erfolgt sofort. Die Synchronisation verwendet Objektversionen und darf Konflikte nicht automatisch überschreiben.
- **OneDrive:** OneDrive speichert Dateien, nicht die pädagogische Hauptstruktur. Der Zugriff ist auf ausdrücklich ausgewählte Ordner begrenzt. Dateien werden primär über `driveId` und `itemId` sowie ergänzend ETag, Web-URL, Pfad und Synchronisationsstatus identifiziert. Originale werden standardmäßig verknüpft; Bearbeitungen erfolgen als Kopie oder Variante.
- **OpenAI/Buddy:** Die OpenAI API wird ausschließlich über das Backend aufgerufen. Buddy-Fähigkeiten werden zentral registriert, erhalten definierte Ein- und Ausgabeschemata und begrenzte Kontextpakete. Quelleninhalte gelten als nicht vertrauenswürdig. Strukturierte Ausgaben werden mit Zod validiert und als Vorschlag gespeichert; sie ändern Fachdaten erst nach Vorschau und Bestätigung. Vor großen Änderungen wird eine Version erzeugt.
- **Materialmodell:** Materialien werden als internes strukturiertes JSON-Dokumentmodell aus Seiten und Blocktypen gespeichert; vollständiges HTML ist nicht das alleinige Fachdatum. Aufgaben und Lösungen bleiben über IDs verbunden. Varianten werden aus einer Grundstruktur abgeleitet und danach eigenständig weitergeführt.
- **Dokumentexport:** PDF wird serverseitig aus HTML/CSS per Browser-Rendering erzeugt und ist druckverbindlich. DOCX erhält einen eigenen Renderer und soll gut bearbeitbar bleiben. Ein Export gilt erst nach Prüfung von A4-Layout, Seitenumbrüchen, Überlappungen, Druckdarstellung, Öffnung und bei DOCX zusätzlich Bearbeitbarkeit und Struktur als erfolgreich.
- **Struktur und Betrieb:** Vorgesehen ist ein Monorepo mit `apps/web`, `apps/api`, optional `apps/worker` und klar getrennten Paketen für Domain, Datenbank, Validierung, Designsystem, Materialmodell, Dokumentrenderer, KI-Verträge und Konfiguration. Frontend-Hosting auf Cloudflare Pages ist eine Annahme; API, Worker, Dokumentrendering und verwaltetes PostgreSQL müssen im Machbarkeitscheck bewertet werden.

## 4. Schutzregeln

Folgende Regeln dürfen bei der Entwicklung keinesfalls still verletzt werden:

- Produktgrenzen bewahren: kein allgemeines Verwaltungs-, Projektmanagement-, LMS-, Noten-, Datei-Explorer- oder öffentliches Plattformprodukt.
- Die ruhige Oberfläche schützen: kein Statistik- oder Aufgaben-Dashboard, keine Schuld erzeugenden Anzeigen, keine überladene Navigation, keine grellen Normalzustände, keine rein farbbasierte Bedeutung und kein dauerhaft dominanter Buddy.
- Planung vor Materialerzeugung; KI weder als Autorität, Diagnoseinstanz noch Benotung einsetzen.
- Keine ungefragten KI-Änderungen, keine unvalidierten KI-Ausgaben in Fachdaten und keine erfundenen Quellenbehauptungen.
- Stammreihe/Durchführung, Stunde/Kalendereintrag und Material/Materialdatei nicht zusammenführen.
- Keine früheren Durchführungen oder Konfliktfassungen überschreiben; keine unsicheren Kaskadenlöschungen.
- OneDrive nur nach Ordnerauswahl verwenden; vorhandene Dateien nicht ungefragt verändern, verschieben, umbenennen, überschreiben, freigeben oder löschen.
- Keine Klarnamen als Standard, keine Kinderfotos und keine Diagnosen oder sensiblen Daten in Suche, Vertretungsansicht, Buddy-Kontext oder Logs. Inhalte dürfen nur bei gesetztem `allowAiUse` an KI gehen.
- Keine ungeklärten Bildquellen, stigmatisierenden Differenzierungsbegriffe oder falschen Aussagen zur Gleichheit bzw. erfolgreichen Erzeugung von PDF und DOCX.
- Keine Secrets oder Zugriffstoken in Frontend, Repository oder normalen Exporten; alle externen und importierten Daten validieren.
- Keine heimliche Stack- oder Architekturänderung, keine Fachlogik in React-Komponenten, keine monolithischen Dateien und keine irreversiblen Migrationen ohne Sicherung und Test.
- Keine Tests entfernen oder abschwächen, keine Attrappe als fertige Funktion melden und keine stillen Synchronisationsfehler zulassen.
- Ausschließlich im aktuellen Arbeitspaket arbeiten; funktionierende Bereiche und andere Kompass-Produkte nicht ohne eigenen Auftrag verändern.

Bei einem Konflikt haben Datenschutz, Original- und Datensicherheit, pädagogische Kontrolle, Ruhe der Oberfläche und tatsächliche Arbeitsentlastung Vorrang. Der Konflikt ist zu dokumentieren und eine sichere Alternative vorzuschlagen.

## 5. Risiken und offene Punkte

Die folgenden Punkte sind eine Dokumentenanalyse, keine technische Machbarkeitsprüfung.

### Kritisch

**Echte Blocker:** Im aktuellen Verständnischeck besteht kein zentraler Dokumentwiderspruch, der Arbeitspaket 00 grundsätzlich unausführbar macht. Ein später erkannter Datenschutzkonflikt, ein Datenverlustrisiko, eine notwendige Architekturänderung oder eine nicht sicher eingrenzbare OneDrive-Berechtigung wäre für den jeweils betroffenen Teil ein Stop-Grund.

**Im Machbarkeitscheck zu beantworten:** Sichere Microsoft-Anmeldung, minimale Graph-Berechtigungen, belastbare Beschränkung auf einen OneDrive-Testordner und Schutz bestehender Dateien.

### Hoch

**Echte Blocker:** Für reale Integrationsnachweise fehlende Zugangsdaten blockieren nur den echten Integrationstest, nicht die spezifikationskonforme Erstellung von Adapter, Mock und Testanleitung. Ergebnisse dürfen dann nicht als real getestet gemeldet werden.

**Im Machbarkeitscheck zu beantworten:**

- belastbare Offline-/Autosave-Synchronisation mit Versionierung, Warteschlange und Konflikterhalt;
- Qualität, Bearbeitbarkeit und Drucktauglichkeit der PDF-/DOCX-Erzeugung;
- serverseitige, schema-validierte Buddy-Ausgabe einschließlich Prompt-Injection-Schutz und kontrollierter teilweiser Übernahme;
- sichere Wiederverwendung von OneDrive-Dateien ohne Kopien oder Verlust der Identität;
- Tragfähigkeit der vorgesehenen Hosting-Aufteilung für API, Worker und Browser-Rendering.

### Mittel

**Kleine dokumentierte Klarstellungen vor oder zu Beginn des Machbarkeitschecks:**

- Die Abschlussbedingung „keine Datei außerhalb des Testordners verändert“ sollte eindeutig als Schutz des ausgewiesenen OneDrive-Testordners formuliert werden, da das Arbeitspaket selbst lokale Dateien unter `prototypes/`, `artifacts/` und `docs/reports/` verlangt.
- Für den DOCX-Nachweis sollte festgelegt werden, mit welcher Anwendung bzw. welchen Anwendungen die manuelle Bearbeitbarkeit geprüft wird. PDF und DOCX müssen nicht pixelgleich sein.
- Für die zehn künstlichen Bibliotheksdateien sollten die erwarteten Dateiformate und die Mindestanforderung an Textextraktion bzw. Indexstatus festgehalten werden.
- Die für Prototyp D verlangte Eigenschaft `sources` sollte bei fehlenden tatsächlich verwendeten Quellen ausdrücklich eine leere Liste zulassen; Quellen dürfen nicht erfunden werden.
- Für „Unit- und Integrationstests, soweit automatisierbar“ sollten je Prototyp die automatisch und manuell zu erfüllenden Akzeptanzkriterien im jeweiligen README vor Implementierungsbeginn festgehalten werden.

**Im Machbarkeitscheck zu beantworten:** Qualität der Metadaten-/Volltextsuche ohne Vektorsuche, Mehrfachverknüpfung, Status „Zuordnung prüfen“ und sinnvolle Suchrangfolge.

### Niedrig

- Konkrete UI-Ausprägung der bewusst einfachen und eindeutig als Prototyp markierten Testoberflächen.
- Benennung interner Testdaten, solange sie künstlich, anonym und eindeutig vom Produktivbetrieb getrennt bleiben.
- Exakte lokale Entwicklungsbefehle und Portwahl, die in den Prototyp-READMEs zu dokumentieren sind.

## 6. Was ich nicht eigenständig entscheiden werde

Ohne ausdrückliche Freigabe werde ich insbesondere nicht:

- den verbindlichen Technologie-Stack oder die vorgesehene Monorepo-Architektur ändern;
- PostgreSQL, IndexedDB oder OneDrive durch eine andere Speicherrolle ersetzen oder OneDrive zur Hauptdatenbank machen;
- die Trennungen von Stammreihe/Durchführung, Stunde/Kalendereintrag, Material/Datei, lokaler Arbeitskopie/Hauptversion oder Vorschlag/bestätigter Änderung aufheben;
- Authentifizierungsmodell, Microsoft-Tenantstrategie, Graph-Berechtigungen, Hostinganbieter oder Betriebsmodell endgültig festlegen;
- OneDrive-Zugriff über einen ausdrücklich gewählten Ordner hinaus erweitern;
- vorhandene Dateien automatisch verändern, verschieben, umbenennen, löschen oder freigeben;
- Konflikte, historische Durchführungen oder Versionen automatisch überschreiben;
- die Verarbeitung personenbezogener oder sensibler Daten, eine Abweichung von Anonymisierung oder eine Übermittlung an KI freigeben;
- `allowAiUse`, Aufbewahrungsfristen, Logging sensibler Inhalte oder Datenschutzfilter eigenmächtig lockern;
- Buddy-Vorschläge automatisch anwenden oder KI für Diagnose, Benotung oder verbindliche Entscheidungen einsetzen;
- Produktgrenzen von Version 1 erweitern, etwa um Mehrbenutzerbetrieb, Schülerzugänge, öffentliche Freigaben, Notenfunktionen oder vollautomatische Verbindungen zu anderen Kompass-Apps;
- die Design-DNA in Richtung Admin-Dashboard, dominanter KI-Oberfläche oder überladener Navigation verändern;
- riskante Datenmigrationen, Löschregeln oder Architekturänderungen ohne Entscheidungsbericht, Sicherung, Tests und Freigabe einführen.

## 7. Prüfung von Arbeitspaket 00

Arbeitspaket 00 ist in Ziel, Umfang und Sicherheitsgrenzen weitgehend vollständig und mit den übrigen Projektdokumenten vereinbar. Es isoliert die fünf zentralen technischen Risiken OneDrive, Dokumentexport, Offline/Autosave, Buddy und Bibliothek in getrennten Prototypen. Für jeden Bereich sind konkrete Testdaten, Kernfälle und Berichtspflichten benannt. Gemeinsame technische Mindestanforderungen, Abschlussberichte sowie ehrliche Zustände bei fehlenden Zugangsdaten sind festgelegt.

Das Paket ist auch aus dem derzeit dokumentationsreinen Repository heraus grundsätzlich ausführbar: Die fehlende Codebasis ist der erwartete Ausgangspunkt der Machbarkeitsphase. Externe Zugangsdaten sind keine Voraussetzung für die Vorbereitung von Adaptern, Mocks und exakten Testanleitungen; sie begrenzen lediglich, welche Aussagen als echte Integrationstests zulässig sind.

Es besteht kein zentraler Widerspruch zur Produktarchitektur. Die unter Abschnitt 5 genannten Punkte sind jedoch vor bzw. bei der Vorprüfung ausdrücklich zu dokumentieren, damit Dateischutz, Akzeptanzkriterien, Quellenfeld, Bibliotheksformate und manuelle DOCX-Prüfung eindeutig ausgelegt werden. Diese Klarstellungen ändern weder Produktarchitektur noch Umfang der fünf Prototypen.

Im Rahmen dieses Kickoffs wurden keine Prototypen angelegt, keine technische Vorprüfung ausgeführt, keine Abhängigkeiten ausgewählt, keine Integrationen aufgerufen und keine Tests durchgeführt.

## 8. Empfehlung

Arbeitspaket 00 kann nach kleinen dokumentierten Klarstellungen beginnen.

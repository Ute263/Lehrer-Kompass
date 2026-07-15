# CODEX_ARBEITSPAKET_00
## Technischer Machbarkeitscheck LehrerKompass

## Auftrag
Baue noch nicht die vollständige App. Prüfe fünf technisch riskante Bereiche als voneinander getrennte Prototypen:
1. Microsoft-Anmeldung und OneDrive
2. PDF- und DOCX-Erstellung
3. Offline-Arbeiten und Autospeicherung
4. Buddy mit strukturierter KI-Ausgabe
5. Bibliotheksindex und Suche

Verwende ausschließlich Demo-Daten, Mocks und einen ausdrücklich ausgewiesenen OneDrive-Testordner. Keine produktiven Daten oder echten Unterrichtsmaterialien verändern.

## Verbindliche Konten- und Nutzerentscheidung
Der erste reale Microsoft-Graph- und OneDrive-Test erfolgt mit Utes persönlichem Microsoft-Konto und ihrem privaten OneDrive. Das Schulkonto ist keine Voraussetzung und wird in diesem Paket nicht getestet.

Die technische Lösung muss dennoch so entworfen werden, dass dieselbe installierbare App später von weiteren Lehrkräften mit deren jeweils eigenem Microsoft-Konto genutzt werden kann. Jede Person erhält einen vollständig getrennten persönlichen Arbeitsbereich. Es gibt keine gemeinsame Bearbeitung, keine Kolleginnenrollen und keine geteilten Fachdaten.

Prüfe deshalb im Authentifizierungs- und Datenzugriffskonzept ausdrücklich:
- Die angemeldete Identität bestimmt die interne `userId` beziehungsweise den persönlichen Workspace.
- Der Client darf keine fremde `userId` vorgeben.
- OneDrive-Token, Ordner-IDs und Dateiverknüpfungen werden nur dem aktuell angemeldeten Konto zugeordnet.
- Ein Kontowechsel darf keine Daten oder OneDrive-Verknüpfungen des vorherigen Kontos sichtbar machen.
- Persönliche Microsoft-Konten müssen unterstützt werden. Arbeits- und Schulkonten dürfen später optional ergänzt werden, werden aber nicht vorausgesetzt.

Beachte zusätzlich `docs/decisions/ADR-001_PERSONAL_MICROSOFT_ACCOUNTS.md`.

## Vorprüfung
Analysiere Repository, Stack, Tests, vorhandene Integrationen und Umgebungsvariablen. Erstelle `docs/reports/MACHBARKEIT_VORPRUEFUNG.md`.

Lege Prototypen getrennt ab, beispielsweise unter:

```text
prototypes/
├── onedrive/
├── documents/
├── offline-sync/
├── buddy/
└── library-index/
```

Jeder Prototyp benötigt README, Startanleitung, Umgebungsvariablen, automatisch prüfbare Akzeptanzkriterien, manuelle Prüfschritte und bekannte Grenzen.

## A – OneDrive
Prüfe Anmeldung/Adapter, Ordnerauswahl, Auflistung, Upload, Abruf, Identifikation über `driveId` und `itemId`, Umbenennung und Verschiebung innerhalb des Testordners sowie Öffnen des tatsächlichen Speicherorts. Bestehende Dateien nicht überschreiben oder löschen. Fehlen Zugangsdaten: Mock und exakte Testanleitung erstellen. Bericht: `docs/reports/PROTOTYP_A_ONEDRIVE.md`.

Der Dateischutz bezieht sich auf OneDrive: Keine OneDrive-Datei außerhalb des ausdrücklich ausgewiesenen OneDrive-Testordners darf erstellt oder verändert werden. Lokale Projektdateien unter `prototypes/`, `artifacts/` und `docs/reports/` dürfen und müssen für dieses Arbeitspaket angelegt werden.

## B – PDF und DOCX
Erzeuge aus einem strukturierten internen Materialmodell ein Demo-Arbeitsblatt „Nomen mit Artikeln erkennen“ für Klasse 2 mit vier Aufgaben, Name/Datum, ausreichenden Schreibflächen, neutralen Bildplatzhaltern und separater Lösung. Prüfe A4, 100-Prozent-Druck, Überlappungen, Seitenumbrüche und Schwarz-Weiß. DOCX muss bearbeitbar sein. Erzeuge:
- `artifacts/machbarkeit/Nomen_mit_Artikeln_Test.pdf`
- `artifacts/machbarkeit/Nomen_mit_Artikeln_Test.docx`

Die manuelle DOCX-Prüfung erfolgt mindestens in Microsoft Word. Falls verfügbar, darf zusätzlich LibreOffice geprüft werden. Dokumentiere Anwendungen und Versionen. PDF und DOCX müssen nicht pixelgleich sein: PDF ist druckverbindlich, DOCX möglichst gut bearbeitbar.

Bericht: `docs/reports/PROTOTYP_B_DOKUMENTE.md`.

## C – Offline und Autosave
Nutze die Demo-Stunde „Nomen mit Artikeln erkennen“. Prüfe lokale Arbeitskopie in IndexedDB/Dexie, Bearbeitung bei simulierter Trennung, Neuladen, Synchronisationswarteschlange, Wiederverbindung und Versionskonflikt. Keine Fassung automatisch überschreiben. Status: lokal gespeichert, ausstehend, synchronisiert, Konflikt, fehlgeschlagen. Bericht: `docs/reports/PROTOTYP_C_OFFLINE_AUTOSAVE.md`.

## D – Buddy
Implementiere die Fähigkeit `shorten_lesson`. Ausgang: 52 Minuten, Ziel: 45 Minuten; Lernziel und Sicherung müssen erhalten bleiben. Ausgabe muss ein Zod-validiertes strukturiertes Schema mit Zusammenfassung, Änderungen pro Phase, Zeiten, Gründen, Quellen und Unsicherheiten erfüllen. Ursprüngliche Stunde bleibt unverändert; Vorschlag kann teilweise übernommen oder verworfen werden; vor Übernahme Version erzeugen. Führe einen Prompt-Injection-Test mit einer bösartigen simulierten Quelle durch. Fehlt API-Zugang: echten Adapter vorbereiten und Mock testen. Bericht: `docs/reports/PROTOTYP_D_BUDDY.md`.

`sourcesUsed` darf eine leere Liste sein, wenn keine konkrete Quelle verwendet wurde. Quellen dürfen niemals erfunden werden. Allgemeines Modellwissen ist nur dann als Quelle anzugeben, wenn es tatsächlich verwendet und als solches gekennzeichnet wurde.

## E – Bibliothek
Erzeuge mindestens zehn künstliche Testdateien aus verschiedenen Fächern und Materialarten. Der Testbestand muss mindestens PDF, DOCX, TXT und eine Bilddatei enthalten. Für jeden Dateityp ist zu dokumentieren, ob Text direkt extrahiert, nur über Metadaten indexiert oder als „nicht automatisch lesbar“ markiert wurde.

Speichere Titel, Typ, Klasse, Fach, Thema, Materialart, Bewertung, Speicherort, extrahierten Text und Indexstatus. Prüfe Suche nach „Nomen Klasse 2“, „wenig schreiben Nomen“, „bewährtes Arbeitsblatt“, „Wasser Versuch“ und „Lösung vorhanden“. Prüfe Filter und Mehrfachverknüpfung, ohne Originale zu kopieren. Eine unklare Datei erhält „Zuordnung prüfen“. Noch keine Vektorsuche. Bericht: `docs/reports/PROTOTYP_E_BIBLIOTHEK.md`.

## Gemeinsame Anforderungen
- TypeScript Strict Mode
- Zod-Validierung
- einheitliches Fehlerformat
- keine Secrets im Frontend
- `.env.example` ohne echte Werte
- Unit- und Integrationstests, soweit automatisierbar
- je Prototyp vor Implementierungsbeginn klare Trennung zwischen automatischen und manuellen Akzeptanzkriterien im README
- einfache, klar als Prototyp gekennzeichnete Testoberfläche; keine fertige Produkt-UI bauen

## Gesamtbericht
Erstelle `docs/reports/TECHNISCHER_MACHBARKEITSCHECK_GESAMTBERICHT.md` mit Repository-Ausgangslage, Ergebnis jedes Prototyps, Architekturfolgen, Hosting-Empfehlung, Sicherheits- und Datenschutzbewertung, Kosten-/Betriebsrisiken, offenen Zugangsdaten, wiederverwendbarem Code und einer eindeutigen Schlussentscheidung:
- Hauptentwicklung kann beginnen.
- Hauptentwicklung kann nach Anpassungen beginnen.
- Ein weiterer Prototyp ist erforderlich.
- Die Architektur ist zentral nicht tragfähig.

Erstelle außerdem `docs/reports/PACKET_00_ABSCHLUSSBERICHT.md`.

## Abschlussbedingungen
Das Paket ist erst abgeschlossen, wenn alle fünf Bereiche umgesetzt oder transparent blockiert dokumentiert sind, keine OneDrive-Datei außerhalb des ausgewiesenen OneDrive-Testordners verändert wurde, alle automatisierbaren Tests liefen, PDF/DOCX-Artefakte vorliegen und eine klare Startempfehlung abgegeben wurde. Melde nichts als echt getestet, das nur vorbereitet, simuliert oder gemockt wurde.
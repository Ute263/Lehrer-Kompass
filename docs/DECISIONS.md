# LehrerKompass – Entscheidungsregister

Dieses Dokument hält die wichtigsten verbindlichen Produkt- und Architekturentscheidungen fest. Es ergänzt die Project Bible, ersetzt sie aber nicht.

## DEC-001 – Werkbank statt Dashboard
Die Startseite zeigt nur aktive Werkstücke und wenige nächste Schritte. Keine Statistiken, Produktivitätswerte oder Aufgabenflut.

## DEC-002 – Unterrichtsreihe als Herzstück
Die Reihe bündelt fachliche Grundlagen, Stundenfolge, Material, Zeitrahmen und Reflexion.

## DEC-003 – Stammreihe und Durchführung trennen
Die Stammreihe enthält den wiederverwendbaren Grundaufbau. Jede konkrete Klasse und jedes Schuljahr erhält eine eigene Durchführung.

## DEC-004 – Stunde und Termin trennen
Die Unterrichtsstunde speichert Inhalt. Der Kalendereintrag speichert Zeit. Verschieben oder Ausfall verändert die Planung nicht automatisch.

## DEC-005 – Material und Datei trennen
Material ist das pädagogische Objekt. PDF, DOCX, Bild oder Quelldatei sind technische Repräsentationen.

## DEC-006 – Verknüpfen vor Kopieren
Vorhandenes Material wird mehrfach verknüpft. Kopien entstehen nur bei eigenständiger Bearbeitung.

## DEC-007 – OneDrive speichert Dateien
OneDrive ist Dateiablage. Pädagogische Zusammenhänge, Versionen und Verknüpfungen liegen in der App-Datenbank.

## DEC-008 – PostgreSQL als Hauptdatenbank
Strukturierte App-Daten werden serverseitig relational gespeichert. OneDrive-JSON-Dateien ersetzen die Datenbank nicht.

## DEC-009 – IndexedDB für lokale Arbeitskopien
Dexie/IndexedDB speichert Entwürfe, Offline-Arbeitskopien und die Synchronisationswarteschlange.

## DEC-010 – Offlinefähigkeit mit Konfliktschutz
Lokale Arbeit ist möglich. Konflikte werden nie automatisch überschrieben; beide Fassungen bleiben prüfbar.

## DEC-011 – Buddy als Kollegin
Der Buddy unterstützt, hinterfragt und bringt Ideen ein, entscheidet aber nicht für die Lehrkraft.

## DEC-012 – KI-Änderungen nur nach Vorschau
Buddy-Vorschläge verändern Fachdaten erst nach ausdrücklicher Bestätigung. Größere Änderungen erzeugen vorher eine Version.

## DEC-013 – Fähigkeiten statt verstreuter Prompts
KI-Funktionen werden zentral registriert und besitzen validierte Ein- und Ausgabeschemata.

## DEC-014 – Quellen bleiben sichtbar
Lehrplan, Arbeitsplan, Leistungskonzept, Lehrwerk, eigene Planung und allgemeines KI-Wissen müssen unterscheidbar bleiben.

## DEC-015 – Lerngruppe vor Standardlösung
Lehrplan, Arbeitsplan und Lehrwerk geben den Rahmen. Die tatsächliche Lerngruppe bestimmt die konkrete Ausgestaltung.

## DEC-016 – Pädagogische Erfahrung ist eine Quelle
Bewährte Methoden, tatsächlicher Zeitbedarf und frühere Reflexionen gehören zum pädagogischen Gedächtnis.

## DEC-017 – Reflexion dient der nächsten Durchführung
Wichtig ist nicht nur, was gut lief, sondern was beim nächsten Mal anders geplant werden soll.

## DEC-018 – Material folgt dem Lernziel
Arbeitsblätter und andere Materialien werden aus Planung, Lernziel, Phase und Zeitrahmen entwickelt.

## DEC-019 – Internes Materialmodell
Materialien werden als strukturierte Seiten und Blöcke gespeichert, nicht nur als Freitext oder fertiges HTML.

## DEC-020 – PDF ist druckverbindlich
PDF muss A4, Seitenumbrüche und Druckgröße zuverlässig abbilden. DOCX ist die möglichst gut bearbeitbare Fassung.

## DEC-021 – Originalschutz
Bestehende Dateien werden nicht ungefragt überschrieben, umbenannt, verschoben, freigegeben oder gelöscht.

## DEC-022 – Datenminimierung
Kinderbezogene Informationen bleiben standardmäßig anonymisiert und werden nicht automatisch an KI, Suche oder Vertretungsansichten weitergegeben.

## DEC-023 – The Quiet Workspace
Der Hauptarbeitsplatz dominiert. Navigation, Buddy und Bibliothek sind einklappbar und visuell nachgeordnet.

## DEC-024 – Unterbrechungen sind normal
Die App merkt letzten Bearbeitungsort und Entwürfe. Planung muss nicht in einer Sitzung abgeschlossen werden.

## DEC-025 – Keine erzwungene Vollständigkeit
Wichtige Lücken werden ruhig angezeigt, blockieren den Arbeitsweg aber nicht.

## DEC-026 – FörderKompass bleibt eigenständig
LehrerKompass plant praktische Förderung; FörderKompass bleibt für den ausführlichen Förderplan zuständig.

## DEC-027 – Version 1 ist privat und einbenutzerorientiert
Keine Schülerzugänge, Kolleginnenrollen, öffentliche Materialplattform oder gemeinsame Bearbeitung.

## DEC-028 – Entwicklung in prüfbaren Paketen
Jedes Arbeitspaket erhält Branch, Tests, Bericht und klare Abnahme. Keine großflächigen Nebenarbeiten.

## DEC-029 – Machbarkeit vor Hauptentwicklung
OneDrive, Dokumentexport, Offline-Sync, Buddy und Bibliothek werden vor der produktiven App prototypisch geprüft.

## DEC-030 – Ehrliche technische Berichte
Gemockt, vorbereitet, automatisch getestet und manuell geprüft werden ausdrücklich unterschieden.

## DEC-031 – Persönliches Microsoft-Konto als erste Referenz
Der erste reale OneDrive- und Microsoft-Graph-Test erfolgt mit Utes persönlichem Microsoft-Konto und einem privaten, ausschließlich dafür bestimmten Testordner. Das Schulkonto ist keine Voraussetzung.

## DEC-032 – Eine App, getrennte persönliche Arbeitsbereiche
Mehrere Lehrkräfte können dieselbe installierbare App verwenden, melden sich jedoch jeweils mit dem eigenen Konto an und erhalten vollständig getrennte App-Daten und OneDrive-Verknüpfungen.

## DEC-033 – Keine Zusammenarbeit in Version 1
Es gibt keine gemeinsamen Klassen, Bibliotheken, Rollen, Freigabeworkflows oder gleichzeitige Bearbeitung. Ein späterer Austausch erfolgt bewusst über Export und Import.

## DEC-034 – Nutzertrennung von Beginn an
Jedes serverseitige Fachobjekt wird einer aus der authentifizierten Sitzung bestimmten `userId` beziehungsweise einem persönlichen Workspace zugeordnet. Fremde Daten dürfen niemals durch clientseitig übermittelte Nutzerkennungen erreichbar sein.
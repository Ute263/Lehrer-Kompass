# Paket 07 – Abschlussbericht

## 1. Ziel

Paket 07 ergänzt einen vollständig lokalen Stundenplan-, Kalender- und Tagesarbeitsplatz. Unterrichtsstunden bleiben pädagogische Inhaltsobjekte; Kalendereinträge verwalten ausschließlich konkrete Schulzeit.

## 2. Ausgangslage

Basis war der vollständige Paket-06-Stand `c212a7a` auf dem neu angelegten Branch `feature/package-07-calendar`. Dexie lag in Version 3 vor. GitHub und andere Remote-Schreibziele wurden nicht verwendet.

## 3. Technische Bereinigung aus Paket 06

Alle 14 Paket-06-Screenshots enthielten JPEG-Daten unter `.png`-Namen. Sie wurden ohne Bildänderung nach `.jpg` umbenannt. `file` bestätigt JPEG/JFIF; Endung und tatsächliches Format stimmen überein. Beide Paket-06-Berichte dokumentieren die Korrektur. Es wurde keine Paket-06-Fachlogik verändert.

## 4. Umgesetzter Umfang

Umgesetzt sind Unterrichtsblöcke, fester Wochenstundenplan, Kalendertermine, Wochen- und Tagesansicht, Einplanen echter Stunden, Konfliktprüfung, Verschieben, Ausfall, Durchführung, ungeplante Stunden, Sondertermine, Tages- und Vertretungsübersicht sowie Werkbank- und Stundenverweise.

## 5. Nicht umgesetzt

Nicht umgesetzt wurden private Termine, Outlook/Google Calendar, Microsoft Graph, OneDrive, PDF/DOCX, Backend, PostgreSQL, KI, Benachrichtigungen und automatische Neuverteilung.

## 6. Unterrichtsblöcke

Sechs künstliche Blöcke werden einmalig angelegt. Anlegen, Bearbeiten, Aktivieren, Deaktivieren und Sortieren sind möglich. Zeiten werden als lokale `HH:mm`-Werte behandelt. Aktive Blöcke dürfen sich nicht überschneiden.

## 7. Fester Wochenstundenplan

Slots gehören zu Schuljahr, Montag bis Freitag und Unterrichtsblock. Klasse, Fach, Raum und Kurzbezeichnung sind getrennte Kontextfelder. Doppelte aktive Belegung wird abgelehnt; Slots können deaktiviert und wieder aktiviert werden.

## 8. Kalendereinträge

`CalendarEvent` enthält Schuljahr, Schuldatum, Block oder freie Zeit, optionale Klasse/Fach/Stunde, Titel, Ort, schulischen Typ und Terminstatus. Es enthält keine Unterrichtsplanung. Unterrichtstermine und schulische Sondertermine bleiben unterscheidbar.

## 9. Terminstatus und Historie

Zentrale Übergänge erlauben geplant→durchgeführt/ausgefallen/verschoben sowie verschoben→durchgeführt/ausgefallen. `calendarEventHistory` hält Anlage, Verschiebung, Ausfall und Durchführung fest. Physisches Löschen ist nicht vorgesehen.

## 10. Einplanen und Verschieben

Einplanen ist aus Kalender und Unterrichtsstunde erreichbar. Klasse, Fach und Schuljahr werden aus dem Stundenkontext geprüft. Verschieben archiviert den historischen Ausgangstermin als verschoben und erzeugt transaktional einen neuen Termin mit `movedFromEventId`. Planung und Phasen bleiben bytegleich unverändert.

## 11. Ausfall und Durchführung

Ausfall löscht die Stunde nicht. Der Dialog bietet „ungeplant“, „direkt neuen Termin auswählen“ oder „später entscheiden“; es gibt keine automatische Neuplanung. Durchführung ändert die Stunde nur nach separater Checkbox-Bestätigung und ausschließlich über einen zulässigen Status.

## 12. Ungeplante Unterrichtsstunden

Entwürfe, Planungsstände und einsatzbereite Stunden ohne aktiven Termin erscheinen nachrangig und ohne belastende Zählung. Es werden höchstens vier Einträge gleichzeitig gezeigt.

## 13. Tagesübersicht

Die abgeleitete Ansicht zeigt vorhandene Zeit-, Klassen-, Fach-, Themen-, Lernziel-, Phasen-, Material-, Vorbereitungs- und Hausaufgabenangaben. Fehlende Inhalte werden nicht ergänzt.

## 14. Vertretungsübersicht

Die Ansicht ist sichtbar als „Für die Weitergabe reduzierte Ansicht“ gekennzeichnet. Persönliche Reflexionen, private Planungsnotizen, Terminnotizen, Buddy-Inhalte und sensible Förderinformationen werden nicht in das Ansichtsmodell übernommen.

## 15. Sondertermine

Schulische Termine, Lernzielkontrollen und schulische Organisation können ohne Unterrichtsstunde angelegt werden. Die Oberfläche weist ausdrücklich darauf hin, dass private Termine nicht in LehrerKompass gehören.

## 16. Werkbankintegration

Die bestehende Tagesübersichtsreferenz führt jetzt auf die echte Route und enthält das Schuldatum. Kalenderdaten werden nicht in Werkbankobjekte kopiert. Unterrichtsstunden verlinken zum Einplandialog; Termine zurück zur Stunde.

## 17. Persistenz und Migration

Dexie v4 ergänzt `timetablePeriods`, `weeklyScheduleSlots`, `calendarEvents` und `calendarEventHistory`. Automatisiert geprüft wurden v3→v4 und v1→v2→v3→v4. Frühere Stunden- beziehungsweise Themendaten bleiben erhalten. Ein Verschiebungskonflikt prüft den Rollback.

## 18. Routing und UI

Implementiert sind `/stundenplan`, `/stundenplan/tag/:date`, `/stundenplan/einstellungen`, `/kalender/termine/:eventId`, `/tagesuebersicht/:date` und `/vertretungsuebersicht/:date`. Direkte URLs, Breadcrumbs, Lade-, Konflikt- und Fehlerzustände verwenden AppShell und Designsystem.

## 19. Accessibility

Wochentage sind semantische Regionen mit Überschriften und linearer Lesereihenfolge. Termine sind Links, Statuswerte Text, Felder beschriftet und Dialoge tastaturbedienbar. Axe prüft Wochen-, Tages- und Vertretungsansicht ohne Verstöße.

## 20. Tests

`pnpm check` führte TypeScript Strict, 27 Testdateien, Domain-/UI-/Migrationsprüfungen, Produktionsbuild und die vollständige Accessibility-Suite aus. Alte Tests blieben aktiv; ältere Migrationserwartungen wurden auf die aktuelle Schemaversion 4 aktualisiert.

## 21. Testergebnisse

- Typecheck: erfolgreich
- vollständige Tests: 176/176 erfolgreich
- v3→v4: erfolgreich
- v1→v2→v3→v4: erfolgreich
- transaktionaler Rollback: erfolgreich
- Produktionsbuild: erfolgreich
- Accessibility: 12/12 erfolgreich, keine Axe-Verstöße

Die jsdom-Canvas-Meldung ist ein bekannter Hinweis der Testumgebung. Vite meldet den JavaScript-Chunk von rund 552 kB als Optimierungshinweis, nicht als Buildfehler.

## 22. Visuelle Prüfungen

Unter `artifacts/package-07/` liegen 14 reale Browseraufnahmen als JPEG mit passender `.jpg`-Endung: Desktop-Woche, Tag, Einplanen, Konflikt, Verschieben, Ausfall, ungeplante Stunden, Tagesübersicht, Vertretung, Einstellungen, Tablet-Woche, Smartphone-Tag, Sondertermin und Fehlerzustand.

## 23. Neue Abhängigkeiten

Keine dauerhafte Laufzeit- oder Entwicklungsabhängigkeit wurde ergänzt.

## 24. Bekannte Einschränkungen

Die Wochenansicht verwendet in Paket 07 bewusst die künstliche Demonstrationswoche 24.–28. August 2026; die Tagesansicht ist datumsnavigierbar. Es gibt noch keine Feiertagslogik, freie Wochenwahl, externe Synchronisation oder Dateiweitergabe. Freie Uhrzeiten sind im Domainmodell unterstützt, die primäre UI priorisiert Unterrichtsblöcke.

## 25. Risiken

Spätere Kalender-Synchronisation muss lokale Schuldatumswerte vor Zeitzonenverschiebung schützen und Konflikte ohne stilles Überschreiben zusammenführen. Der Bundle-Hinweis sollte durch routenbasiertes Code-Splitting bewertet werden.

## 26. Empfehlung für Paket 08

Nachfolgende Material- oder Exportpakete sollen ausschließlich IDs von Stunde, Termin und Phase referenzieren. Tages- und Vertretungsmodelle sollten weiterhin als datenschutzgefilterte Ableitungen erzeugt werden, nicht als ungeprüfte Kopien aller Planungsdaten.

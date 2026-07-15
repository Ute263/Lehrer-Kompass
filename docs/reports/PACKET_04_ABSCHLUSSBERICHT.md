# Paket 04 – Abschlussbericht

## 1. Ziel
Lokales, validiertes Grundmodell für Schuljahre, Klassen, Fächer, Zuordnungen und Themen.

## 2. Ausgangslage
Branch basiert auf den lokalen Paket-03-Commits `c66cabf` und `6f18e6f`; alle verbindlichen Dokumente wurden erneut vollständig gelesen.

## 3. Umgesetzter Umfang
Dexie-Schema v1, Seed, Fachservices, vier Klassenrouten, Werkbankreferenzen, Tests, Dokumentation und zehn Screenshots. Automatisch und real im Browser geprüft.

## 4. Nicht umgesetzt
Keine Reihen, Stunden, Materialien, Datenbankserver, Backend-, OneDrive- oder KI-Funktion.

## 5. Fachmodell
Schuljahr → konkrete Klasse → Klassenfach → Thema, mit stabilen IDs, ISO-Zeitstempeln und Soft Delete.

## 6. Schuljahre
Genau ein aktives Jahr; Zeitraumprüfung, Anlegen, Aktivieren und sicheres Archivieren. Klassen werden nie automatisch verschoben.

## 7. Klassen
Jahrgang 1–4, eindeutige normalisierte Bezeichnung je Schuljahr, Beschreibung, Detailansicht und Archivierung ohne Löschen.

## 8. Fächer
Zehn Systemfächer sowie aktivier-, deaktivier- und sortierbare Klassen-Fach-Zuordnungen. Deaktivieren bewahrt Themen.

## 9. Themen
Anlegen, Umbenennen, Archivieren, Anzeigen, Wiederherstellen und Auf-/Ab-Sortieren; Duplikatgrenze ist Klasse plus Fach.

## 10. Validierung und Fehler
Zod-Lesevalidierung, Normalisierung und elf strukturierte Fehlercodes. Ungültige IDs und korrupte Daten erscheinen ruhig und ohne Fremddaten.

## 11. Persistenz
Dexie `lehrerkompass-domain-v1`, Schema v1, einmaliger transaktionaler Seed und Transaktionen für zusammenhängende Änderungen. Migrationserweiterung dokumentiert.

## 12. Werkbank
Optionale `classId`, `subjectId`, `topicId`; „Nomen entdecken“ verweist auf 2a/Deutsch/Nomen. Werkbankdaten bleiben reine Referenzen.

## 13. Routing und UI
`/klassen`, `/klassen/:classId`, `/klassen/:classId/faecher/:subjectId`, `/klassen/schuljahre`; bestehende AppShell und Designsystemkomponenten werden wiederverwendet.

## 14. Accessibility
Beschriftete Formulare, Textstatus, Dialogfokus, eindeutige Landmarken und Tastatur-Sortieraktionen. Axe für Klassen- und Fachroute bestanden.

## 15. Tests
14 Domainfälle sowie UI-, Routing-, Persistenz-, Tastatur- und Accessibility-Tests; alle früheren Tests bleiben aktiv.

## 16. Testergebnisse
`pnpm check`: Typecheck erfolgreich; 18 Dateien, 89/89 Tests; Produktionsbuild mit 1.920 Modulen; Accessibility 5/5. Getestet am 15.07.2026.

## 17. Visuelle Prüfung
Zehn reale Browseransichten. 1440-px-Desktop, 900-px-Tablet und 390-px-Smartphone ohne horizontale Seitenüberbreite; Browserkonsole ohne Fehler/Warnungen.

## 18. Abhängigkeiten
Keine neue Abhängigkeit. Vorhandene Dexie-, Zod-, React-Router- und fake-indexeddb-Pakete werden genutzt.

## 19. Einschränkungen
Lokale Einbenutzer-Daten; kein Abgleich. Umbenennen nutzt derzeit einen nativen Prompt. Ein expliziter Warnhinweis vor Jahrgangsänderung ist vor produktiver Bearbeitungsmaske noch zu ergänzen.

## 20. Risiken
Spätere Migrationen benötigen Upgrade-Tests. Fachobjekte und Werkbankverweise dürfen nicht verschmolzen werden; Nutzerbindung folgt erst mit serverseitiger Persistenz.

## 21. Empfehlung für Paket 05
Auf dem validierten Pfad Klasse/Fach/Thema aufbauen, Migration v1 schützen und Unterrichtsreihen als neue, getrennte Fachobjekte modellieren.

**Gesamtstatus: Paket 04 lokal abgeschlossen, nicht zu GitHub übergeben.**

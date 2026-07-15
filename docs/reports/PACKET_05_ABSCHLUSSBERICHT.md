# Paket 05 – Abschlussbericht

## 1. Ziel
Echte lokale Unterrichtsreihen mit verbindlicher Trennung von Stammreihe und Durchführung.
## 2. Ausgangslage
Branch basiert auf Paket 04 (`97a30b5`, `20a93b8`); alle verbindlichen Dokumente wurden vollständig gelesen.
## 3. Bereinigungen aus Paket 04
Themen werden im Designsystem-Dialog umbenannt. Klassenstufenänderungen zeigen den verbindlichen Hinweis und benötigen bewusste Bestätigung. Automatisch getestet.
## 4. Umgesetzter Umfang
Reihenmodell, v2-Speicherung, Themenansicht, Dashboard, Stammreihenansicht, Grundplanung, Stundenfolge, Status, Archivierung, Übernahme und Werkbankreferenz.
## 5. Nicht umgesetzt
Keine vollständigen Stunden, Phasen, Materialien, Kalendertermine, Exporte, Cloud-, Backend- oder KI-Funktion.
## 6. Stammreihe
Themengebunden, wiederverwendbar und frei von Klasse/Schuljahr; Titel je Thema normalisiert eindeutig.
## 7. Durchführung
Eigenes Objekt je Klasse und Schuljahr. Neue Übernahme erzeugt eine neue ID; frühere Objekte werden nicht überschrieben.
## 8. Grundplanung
Sieben einzeln öffnende, unvollständig zulässige Bereiche mit lokaler Speicherung.
## 9. Stundenfolge
Sechs Demo-Gliederungspunkte, Ergänzen und persistente zugängliche Auf-/Ab-Sortierung; keine Stundenplanung.
## 10. Statuslogik
Zentraler validierter Übergangsautomat; ungültige Sprünge und archivierte Bearbeitung werden blockiert.
## 11. Übernahme für neue Klasse
Dialog erzeugt stets eine neue Durchführung und kann Grundplanung/Stundenfolge kopieren; bestehende Durchführung bleibt unverändert.
## 12. Werkbankintegration
Eigene v2-Referenz mit Klassen-, Fach-, Themen-, Stammreihen- und Durchführungs-ID. Entfernen ändert die Durchführung nicht; Archivierung deaktiviert den Verweis.
## 13. Persistenz und Migration
Dexie v2 mit fünf neuen Tabellen, separatem Seed, Zod-Lesevalidierung und getesteter v1→v2-Erhaltung der Paket-04-Daten.
## 14. Routing und UI
Themenroute, `/reihen/neu`, `/reihen/:implementationId` und `/stammreihen/:templateId` innerhalb der bestehenden AppShell.
## 15. Accessibility
Formularlabels, Dialogfokus, Textstatus, PlanningSection und Tastatursortierung. Axe für Themenansicht und Dashboard bestanden.
## 16. Tests
Status, Duplikate, Referenzen, Archiv, Grundplanung, Sortierung, Rollback, Migration sowie UI-, Routing-, UX- und Axe-Fälle; frühere Tests bleiben aktiv.
## 17. Testergebnisse
`pnpm check`: Typecheck erfolgreich; 21 Dateien, 112/112 Tests; Produktionsbuild mit 1.925 Modulen; Accessibility 7/7. Getestet am 15.07.2026.
## 18. Visuelle Prüfungen
Zwölf Browseransichten unter `artifacts/package-05`; Desktop, Tablet und Smartphone ohne horizontale Überbreite.
## 19. Neue Abhängigkeiten
Keine.
## 20. Bekannte Einschränkungen
Autosave erfolgt beim Verlassen des Feldes mit sichtbarem Speicherstatus. Die Übernahmeauswahl nutzt im Demo nur die fachlich vorhandene Klasse 2a. Native Drag-and-drop-Sortierung und zugängliche Auf-/Ab-Aktionen sind vorhanden.
## 21. Risiken
Spätere Stundenobjekte dürfen nicht mit Gliederungspunkten verschmolzen werden. Serverseitige Nutzerbindung fehlt weiterhin absichtlich.
## 22. Empfehlung für Paket 06
Unterrichtsstunden als neue Objekte unter einer Durchführung modellieren und v2-Migration unverändert schützen.

**Gesamtstatus: Paket 05 lokal abgeschlossen, nicht zu GitHub übergeben.**

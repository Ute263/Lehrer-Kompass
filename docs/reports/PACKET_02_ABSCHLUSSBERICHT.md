# Paket 02 – Abschlussbericht

## 1. Ziel

Stabiler, ruhiger App-Rahmen mit Navigation, Routing, TopBar, Brotkrumen, Hauptarbeitsfläche, technischem Drawer und visuellen Statuszuständen – ohne Fachfunktion.

## 2. Ausgangslage

Paket 01 war lokal abgeschlossen, aber noch nicht in `main` übernommen. Der Branch `feature/package-02-app-shell` basiert deshalb auf dem vollständigen Paket-01-Stand mit `9f4efd6` und `34db83d`. Alle zwölf verbindlichen Dokumente wurden vor der Änderung vollständig gelesen.

## 3. Umgesetzter Umfang

Zentrale AppShell, exakt sieben Hauptnavigationseinträge, acht definierte App-/Testpfade, Redirect, Nicht-gefunden-Seite, Desktop-/Tablet-/Smartphone-Layout, ein wechselbarer Buddy-/Bibliotheks-Drawer, Sync-Demozustände, mobile Navigation und lokale Navigationseinstellung. Status: **automatisch getestet und manuell im Browser geprüft**.

## 4. Nicht umgesetzt

Keine Werkbank-, Klassen-, Stundenplan-, Bibliotheks-, Förder- oder Einstellungslogik; keine Datenbank, Anmeldung, OneDrive, Suche, KI, Materialerstellung oder echte Synchronisation. Platzhalter sind sichtbar als inaktiv gekennzeichnet.

## 5. AppShell-Struktur

`AppShell.tsx` wird einmal als Layout-Route verwendet. App, Router, Routen, Navigation, Brotkrumen, Storage und CSS sind getrennte Module; Seiten verwenden `PageHeader` aus Paket 01.

## 6. Routing

React Router leitet `/` nach `/werkbank`, rendert alle sieben neutralen Seiten, erhält `/design-system`, unterstützt direkte Vite-URLs und Browser-History und fängt Unbekanntes ruhig ab. **Automatisch und real im Browser getestet.**

## 7. Navigation

Exakt die beauftragten sieben Einträge, aktive Route über `aria-current`, breite/kompakte Darstellung, Tooltips und zugängliche Namen. Nur der Einklappzustand wird lokal gespeichert; ungültige Werte werden ignoriert.

## 8. Drawer-Verhalten

Ein Zustand hält `buddy`, `library` oder `null`; zwei parallele Drawer sind strukturell ausgeschlossen. Fokusfalle, Escape und Fokusrückgabe sind **automatisch und manuell geprüft**. Inhalte sind nur vorbereitete Platzhalter.

## 9. Responsive Verhalten

Desktop vollständig, Tablet mit 76-px-Iconnavigation und verdichteter TopBar, Smartphone als reduzierte Begleitansicht mit mobiler Schublade. Bei 900 × 1000 und 390 × 844 px: **manuell geprüft, keine horizontale Überbreite**.

## 10. Accessibility

Landmarks, Skip-Link, native Links/Buttons, sichtbarer Fokus, `aria-current`, große Ziele, textliche Statusinformation, reduzierte Bewegung sowie Drawer-/Mobilfokus sind umgesetzt. Zwei axe-Basistests bestanden. Die Farbkontrastregel ist in jsdom deaktiviert; ein formales Browser-Kontrastaudit ist **nicht geprüft**.

## 11. Tests

Redirect, sieben Seiten, aktive Navigation, sieben Links, Speicherung/Wiederherstellung/ungültiger Wert, Drawerwechsel, Einzeldrawer, Escape, Fokusrückgabe, Skip-Link, mobile Tastaturbedienung, Nicht-gefunden, Browser-Zurück, Landmarks und axe. Bestehende Paket-00-/01-Tests blieben erhalten.

## 12. Testergebnisse

`pnpm check` erfolgreich: TypeScript strict erfolgreich; 12 Testdateien und 52/52 Tests erfolgreich; Vite-Build mit 1.819 Modulen erfolgreich; Accessibility 2/2 erfolgreich. Status: **automatisch getestet am 15.07.2026**.

## 13. Visuelle Prüfungen

Acht echte Browseraufnahmen: Werkbank Desktop breit/kompakt, Klassen Tablet, Buddy, Bibliothek, Smartphone, Nicht-gefunden und Konfliktstatus. Routen-History, Fokus und mobile Escape-Rückgabe wurden zusätzlich interaktiv geprüft. Browserkonsole: keine Fehler/Warnungen.

## 14. Neue Abhängigkeiten

`react-router-dom` 7.18.1 für das verbindlich geforderte Routing. Keine neue Komponenten- oder Stylingbibliothek.

## 15. Bekannte Einschränkungen

Query-Parameter dienen nur reproduzierbaren Entwicklungszuständen. Status ist rein visuell. Smartphone bleibt bewusst reduziert. Formales Kontrast- und Screenreader-Audit ist offen.

## 16. Risiken

Spätere Pakete dürfen AppShell und Navigation nicht mit Fachlogik, Kennzahlen oder zusätzlichen Hauptpunkten überladen. Echte Persistenz darf den visuellen Demo-Syncstatus nicht ungeprüft übernehmen.

## 17. Empfehlung für Paket 03

Den ersten echten Arbeitsplatz ausschließlich im `Outlet` aufbauen, vorhandene Route-/Navigationsmetadaten nutzen und AppShell, Drawer sowie Paket-01-Komponenten nicht duplizieren. Vor Freigabe erneute Tablet-, Tastatur- und Kontrastprüfung.

**Gesamtstatus: Paket 02 lokal abgeschlossen, nicht zu GitHub übergeben.**

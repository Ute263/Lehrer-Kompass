# Prototyp C – Offline und Autosave

## Ziel und Umsetzung

Die künstliche Stunde „Nomen mit Artikeln erkennen“ wird als lokale Arbeitskopie in Dexie/IndexedDB gespeichert. Änderungen werden zuerst lokal gesichert und anschließend in eine geordnete Warteschlange eingereiht. Ein speicherinterner Testserver simuliert Trennung, Wiederverbindung und Versionskonflikt.

Unterstützte Statuswerte: `lokal gespeichert`, `ausstehend`, `synchronisiert`, `Konflikt`, `fehlgeschlagen`.

## Prüfergebnisse

- **Automatisch getestet:** lokales Speichern, Warteschlange, simulierter Offlinefehler, Fortbestand nach erneutem Öffnen der IndexedDB-Testdatenbank, Wiederverbindung, Synchronisation und Leeren der Warteschlange.
- **Automatisch getestet:** bei abweichender Serverversion bleiben lokale und serverseitige Fassung getrennt in einem Konfliktobjekt erhalten; keine Fassung wird automatisch überschrieben.
- **Real im Browser geprüft:** Die lokale Oberfläche lief in der In-App-Browserumgebung; eine Bearbeitung wurde in IndexedDB eingereiht und der sichtbare Status wechselte zu `ausstehend`.
- **Gemockt:** Netzwerk und Serverantworten einschließlich Versionskonflikt.
- **Nicht umgesetzt:** echte Fastify-/PostgreSQL-Synchronisation und produktive Konfliktauflösung.

## Grenzen und Risiko

Die lokale Dexie-Architektur ist tragfähig. Vor Hauptentwicklung müssen Queue-Deduplizierung, Transaktionsgrenzen, Wiederholungsstrategie, Authentifizierungsablauf, mehrere Tabs und größere komplexe Dokumente in der echten API-Integration geprüft werden.


# Paket 08 – Abschlussbericht

## 1. Ziel

Lokale Materialwerkstatt mit dauerhaft strukturierten, variantenfähigen und sicher verknüpfbaren Materialien.

## 2. Ausgangslage

Basis ist Paket 07, Commit `313a62d`, mit AppShell, Designsystem, Werkbank, Fachmodell, Reihen, Stunden und Kalender sowie Dexie v4.

## 3. Umgesetzter Umfang

Materialobjekte, Familien, Varianten, Dokumente, Seiten, zwölf Blocktypen, Aufgaben/Lösungen, Rechteprüfung, Verknüpfungen, Versionen, Werkstatt und Vorschau sind lokal umgesetzt.

## 4. Nicht umgesetzt

Keine KI, Bildgenerierung, Web-Bildsuche, OneDrive-/Graph-Anbindung, PDF-/DOCX-Ausgabe, Cloud, Backend oder PostgreSQL.

## 5. Materialmodell

Zod-validierte Fachobjekte trennen Metadaten, Familie, Variante, Dokumentinhalt, Links und Historie. Fachlogik liegt im `MaterialService`, nicht in React.

## 6. Materialfamilien und Varianten

Tiefe Variantenkopien erzeugen neue IDs für Material, Dokument, Seiten, Blöcke und Lösungen. Lösungen werden ungeprüft; das Original bleibt unverändert.

## 7. Dokument- und Seitenmodell

A4 Hoch-/Querformat, Ränder, Schriftgröße sowie sortierbare, duplizierbare und weich archivierbare Seiten mit Rollen sind getrennt modelliert.

## 8. Blocktypen

Überschrift, Arbeitsauftrag, Text, Aufgabe, Bild, Tabelle, Schreiblinien, Rechenraster, Antwortfeld, Kartenraster, Seitenumbruch und Fußzeile sind strukturierte Datensätze ohne HTML-Payload.

## 9. Aufgaben und Lösungen

Aufgabe und Lösung sind per ID verbunden. Aufgabenänderungen setzen die fachliche Lösungsprüfung zurück. Ungeprüfte oder fehlende Lösungen blockieren `reviewed`.

## 10. Bild- und Rechtekonzept

Paket 08 verwendet ausschließlich einen lokalen Platzhalter. Fehlender Alt-Text und unbekannte Rechte werden als Pflichtfehler gemeldet; keine Bildsuche wurde implementiert.

## 11. Materialverknüpfungen

Mehrfachverweise zu Stunden, konkreten Durchführungen, Stammreihen und Themen sind möglich. Doppelte identische Links werden verhindert; Linklöschung verändert kein Material.

## 12. Werkstatt und Vorschau

Desktop-Werkstatt mit Seitenleiste, A4-Arbeitsfläche und Inspektor; separate Vorschau mit Zoom und Schwarz-Weiß-Modus. Beide sind lokale Näherungen ohne Exportversprechen.

## 13. Layout- und Überlaufprüfung

Deterministische Hinweise prüfen Alt-Text, Rechte, Lösungen, Tabellenbreite, Kartenmenge, Antwortfeldhöhe, Blockanzahl und wahrscheinlichen Seitenüberlauf.

## 14. Status und Versionierung

Validierte lineare Statusübergänge, weiche Archivierung, Snapshots vor umfangreichen Änderungen/Freigabe und zusätzliche Sicherung vor Wiederherstellung.

## 15. Werkbankintegration

Der bisherige Material-Demoverweis führt nun über Material-, Familien- und Varianten-ID zur echten Werkstatt. Unterrichtsstunden bieten „Material anlegen“ mit reinen Kontext-IDs.

## 16. Persistenz und Migration

Dexie wurde additiv von v4 auf v5 erweitert. Reale automatisierte Tests bestätigen v4→v5 und v1→v2→v3→v4→v5 bei Erhalt bestehender Kalender- bzw. Themendaten.

## 17. Routing und Code-Splitting

Material-Neuanlage, Werkstatt, Vorschau und Familie besitzen eigene Routen. Materialbereich, Kalender und Designsystem werden mit `React.lazy` nachgeladen.

## 18. Responsive Verhalten

Desktop: drei Bereiche. Tablet: Seitenleiste und Arbeitsfläche, Inspektor darunter. Smartphone: lineare Begleitansicht mit Hinweis auf begrenzte komplexe Bearbeitung.

## 19. Accessibility

Semantische Landmarks, benannte Bereiche und Dialoge, Formularlabels, Tastaturbedienung und ruhige Statusausgaben. Drei neue Materialrouten sind mit axe ohne Befund geprüft.

## 20. Tests

TypeScript Strict, Domain-/UI-Tests, Dexie-Migrationstests, bestehende Regressionstests, Produktionsbuild und Accessibility-Basistests.

## 21. Testergebnisse

`pnpm check` erfolgreich: 30 Testdateien / 199 Tests; separater Accessibility-Lauf 8 Dateien / 15 Tests; Typecheck und Build erfolgreich. jsdom meldet nur den bekannten, nicht fehlschlagenden Canvas-Hinweis.

## 22. Visuelle Prüfungen

20 reale lokale Browser-Screenshots liegen als formatkorrekte JPEG-Dateien unter `artifacts/package-08/`, einschließlich Dialogen, Vorschauen, Überlauf, Responsive-Ansichten, Werkbank und Fehlerzustand.

## 23. Neue Abhängigkeiten

Keine neue Projektabhängigkeit. Die einmalige Prettier-Ausführung erfolgte nur temporär über `pnpm dlx` und änderte weder Manifest noch Lockfile.

## 24. Buildgrößenentwicklung

Paket 07: Hauptchunk 552,31 kB / gzip 165,45 kB. Paket 08: Hauptchunk 541,44 kB / gzip 162,45 kB; Materialchunk 19,69 kB / gzip 6,18 kB; Kalender 30,75/8,71 kB; Designsystem 7,96/3,06 kB. Die Vite-Warnung für den Hauptchunk bleibt transparent bestehen.

## 25. Bekannte Einschränkungen

Die Vorschau ist kein Satzsystem; Überlauf wird heuristisch geprüft. Komplexe Tabellen-/Karteninhalte sind bewusst einfach. Lokale Versions-Snapshots haben noch keine Aufräumstrategie.

## 26. Risiken

Spätere Export-Engines müssen das strukturierte Modell verlustfrei abbilden. Für wachsende Materialmengen sind Versionierungsgrenzen, Medienverwaltung und weitere Chunk-Aufteilung zu prüfen.

## 27. Empfehlung für Paket 09

Export und externe Ablage nur auf Basis des strukturierten Modells entwickeln; zunächst Layouttreue, Rechte-Metadaten und verlässliche Ausgabegrenzen mit künstlichen Daten testen.

**Status: Paket 08 lokal abgeschlossen.**

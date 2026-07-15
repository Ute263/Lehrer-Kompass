# Prototyp A – OneDrive

## Ziel und Umsetzung

Ein `OneDriveAdapter` bildet Auflistung, Upload, Abruf, Umbenennung, Verschiebung und Öffnen des Speicherorts ab. Der speicherinterne Adapter verwendet einen ausdrücklich ausgewiesenen Ordner `LEHRERKOMPASS_TEST`, identifiziert Dateien über `driveId` und `itemId`, verweigert Zugriffe außerhalb der erlaubten Testordner und überschreibt keine gleichnamige Datei. Löschen ist nicht implementiert.

Ein `MicrosoftGraphOneDriveAdapter` implementiert reale Graph-Requests für Auflistung, Upload, Abruf, Umbenennung, Verschiebung und Speicherort. Er akzeptiert ausschließlich die Authority `consumers`, prüft vor dem Smoke-Test `/me` gegen die freigegebene persönliche Konto-ID und begrenzt alle Operationen auf genau ein privates Drive-/Testordnerpaar. Die exakte Integrationsanleitung steht im Prototyp-README.

Ein serverseitiger Sitzungs-/Workspace-Prototyp leitet interne `userId` und `workspaceId` ausschließlich aus der authentifizierten persönlichen Microsoft-Identität ab. Clientseitig mitgesendete Nutzerkennungen werden nicht zur Autorisierung verwendet. App-Objekte und OneDrive-Verknüpfungen sind pro Workspace getrennt; es bestehen keine Team- oder Zusammenarbeitsfunktionen.

## Prüfergebnisse

- **Automatisch getestet (Mock):** vollständiger CRUD-Teilablauf ohne Löschen, stabile IDs, Speicherort-Link, Ordnergrenze und Überschreibschutz.
- **Browsergetestet (Mock):** Upload in den künstlichen Testordner erzeugte sichtbar `driveId`, `itemId` und Dateiname.
- **Automatisch getestet (Requestvertrag):** `consumers`-Zwang, `/me`-Kontobindung, Bearer-Token nur serverseitig, `If-None-Match: *`, Drive-/Ordnergrenzen und Ablehnung fremder Konten.
- **Automatisch getestet (Nutzertrennung):** zwei persönliche Konten erhalten getrennte Workspaces, fremde clientseitige `userId` wird ignoriert, fremde App-Daten sind nicht lesbar und Kontowechsel zeigt nur die jeweilige OneDrive-Verknüpfung.
- **Vorbereitet:** ausführbarer persönlicher Graph-Smoke-Test, leere `.env.example` und manuelle Testschritte.
- **Blockiert:** echte persönliche Microsoft-Anmeldung und reale Graph-/OneDrive-Operationen, da keine persönliche Test-App, kein temporärer Zugriffstoken und keine freigegebenen privaten Testordner-IDs vorhanden waren. Das Schulkonto wurde nicht verwendet.

Es wurde keine reale OneDrive-Datei erstellt oder verändert. Insbesondere fand kein Zugriff außerhalb eines OneDrive-Testordners statt.

## Grenzen und Risiko

Tokenfluss, minimale Graph-Berechtigungen, Delta-Abfragen, ETag-Verhalten und echte Web-URLs sind noch nicht real validiert. Vor produktiver Nutzung ist der dokumentierte Test mit einer persönlichen Microsoft-Test-App und einem leeren privaten Testordner zwingend. Die Prüfung mehrerer Personen belegt Architekturtrennung mit Mocks, nicht reale gleichzeitige Anmeldungen; Zusammenarbeit ist ausdrücklich nicht vorgesehen.

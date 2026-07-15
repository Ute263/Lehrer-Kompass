# ADR-002 – Local First für Version 1

Status: angenommen am 15.07.2026.

## Entscheidung
Version 1 von LehrerKompass ist eine lokale, installierbare Einzelarbeitsplatz-App. IndexedDB/Dexie ist die primäre Datenquelle. Die App benötigt weder Microsoft-Login noch Microsoft-App-Registrierung, verpflichtendes Backend oder automatische OneDrive-Synchronisierung.

## Konsequenzen
- Sicherung und Gerätewechsel erfolgen bewusst über versionierte Dateien mit Vorschau und Prüfsummen.
- Die Nutzerin wählt den Speicherort; ein privater, lokal synchronisierter OneDrive-Ordner ist nur ein möglicher Dateispeicher. LehrerKompass erhält keinen Microsoft-Zugriff.
- Jede Kollegin nutzt eine unabhängige lokale Instanz. Es gibt keine Zusammenarbeit oder Synchronisation zwischen Instanzen.
- Das Paket-10-Backend bleibt unverändert als optionale Zukunftsarchitektur erhalten und blockiert den lokalen Betrieb nicht.
- Löschen von Browser-/Appdaten kann lokale Inhalte entfernen; deshalb sind verständliche Sicherungshinweise verbindlich.

## Abgrenzung
Keine automatische Cloudübertragung, Hintergrunduploads, Rollen, Teams oder Freigaben. Prüfsummen erkennen Beschädigung, sind aber keine Signatur gegen absichtliche Manipulation.

# Prototyp A – Microsoft-Anmeldung und OneDrive

## Zweck und Start

Der Prototyp prüft den Dateivertrag ausschließlich mit einem speicherinternen, ausdrücklich markierten Testordner. Er enthält außerdem den serverseitigen Vertrag für ein persönliches Microsoft-Konto (`consumers`) und vollständig getrennte persönliche Workspaces. Start: im Repository `pnpm prototype`, dann `/prototypes/onedrive/` öffnen.

## Umgebungsvariablen

Siehe `.env.example`: `MICROSOFT_AUTHORITY=consumers`, Client-Konfiguration, temporärer serverseitiger Testtoken, persönliche Konto-ID sowie Drive-, Testordner- und Testunterordner-ID. Keine echten Werte einchecken. Das Schulkonto wird nicht konfiguriert.

## Automatische Akzeptanzkriterien

- Upload, Auflistung, Abruf, Umbenennung, Verschiebung und Speicherort-Link funktionieren im Mock.
- `driveId` und `itemId` bleiben bei Umbenennung/Verschiebung stabil.
- Zugriff außerhalb des Testordners und Überschreiben gleichnamiger Dateien werden verweigert.
- Alle Ein-/Ausgaben sind validiert; Fehler nutzen das gemeinsame Format.
- Zwei persönliche Identitäten erhalten reproduzierbar verschiedene interne `userId`-/Workspace-Werte.
- Eine clientseitig mitgesendete fremde `userId` wird ignoriert; fremde Workspace-Objekte bleiben unsichtbar.
- Ein Kontowechsel trennt App-Daten, Tokenkontext, Ordner-IDs und OneDrive-Verknüpfungen.
- Der reale Graph-Adapter akzeptiert nur `consumers`, prüft `/me` gegen die freigegebene persönliche Konto-ID und erzwingt Drive-/Ordnergrenzen.

## Manuelle Akzeptanzkriterien

1. Eine persönliche Microsoft-Test-App mit Unterstützung persönlicher Konten und minimalen delegierten Graph-Berechtigungen konfigurieren; Authority ausschließlich `consumers`.
2. Mit dem persönlichen Konto anmelden. Das Schul- oder Arbeitskonto nicht verwenden.
3. Einen leeren privaten OneDrive-Ordner `LEHRERKOMPASS_TEST` und einen Unterordner auswählen; Konto-, Drive- und Ordner-IDs serverseitig setzen.
4. Den temporären Zugriffstoken nur für den lokalen Prozess setzen und `pnpm test:graph:personal` ausführen.
5. Der Smoke-Test prüft `/me`, Auflistung, Upload ohne Überschreiben, Abruf, Umbenennung, Verschiebung in den Testunterordner und Speicherort-Link. Er löscht keine Datei.
6. Den zurückgegebenen Web-Link im privaten OneDrive öffnen und Identität über `driveId`/`itemId` kontrollieren.

## Grenzen und Status

Der Graph-Vertrag und ein ausführbarer persönlicher Smoke-Test sind vorbereitet. Ohne persönliche Test-App, temporären Zugriffstoken und freigegebene private Ordner-IDs wurden Anmeldung und echte OneDrive-Operationen nicht real getestet und sind blockiert. Automatisch getestet sind Mock, Graph-Requestvertrag, persönliche Kontobindung und Workspace-Trennung. Löschen und Zusammenarbeit sind bewusst nicht implementiert.

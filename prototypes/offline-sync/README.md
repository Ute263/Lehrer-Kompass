# Prototyp C – Offline und Autosave

## Zweck und Start

Der Prototyp prüft die künstliche Demo-Stunde „Nomen mit Artikeln erkennen“ mit Dexie/IndexedDB, lokaler Arbeitskopie, Warteschlange und Versionskonflikt. Start: `pnpm prototype`, dann `/prototypes/offline-sync/`.

## Umgebungsvariablen

Keine. Der Server ist ein speicherinterner Testserver.

## Automatische Akzeptanzkriterien

- Änderung wird zuerst lokal gespeichert und als ausstehend eingereiht.
- Simulierter Offlinefehler ergibt `fehlgeschlagen`; der Inhalt bleibt nach erneutem Öffnen der Datenbank erhalten.
- Wiederverbindung synchronisiert geordnet und leert die Warteschlange.
- Bei abweichender Serverversion bleiben lokale und serverseitige Fassung getrennt erhalten; Status ist `Konflikt`.
- Alle fünf geforderten Statuswerte sind schema-validiert.

## Manuelle Akzeptanzkriterien

1. Oberfläche öffnen, Text ändern und lokal speichern.
2. Seite neu laden und Fortbestand in IndexedDB prüfen.
3. In Browser-Entwicklungswerkzeugen Offlinebetrieb simulieren, erneut ändern und Status beobachten.
4. Wieder online gehen und Synchronisation auslösen; für einen erzwungenen Konflikt beide Fassungen anzeigen.

## Grenzen und Status

IndexedDB/Dexie und die Zustandslogik werden real lokal und automatisiert getestet. Netzwerkunterbrechung und Server sind simuliert. Eine echte API/PostgreSQL-Synchronisation ist nicht umgesetzt und nicht als getestet zu bewerten.

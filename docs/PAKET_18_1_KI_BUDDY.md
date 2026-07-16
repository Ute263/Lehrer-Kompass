# Paket 18.1 – KI-Buddy

## Cloudflare-Einrichtung

Der geheime Schlüssel wird niemals im Browser oder im Repository gespeichert.

In Cloudflare beim LehrerKompass-Projekt unter **Einstellungen → Variablen und Geheimnisse** ein verschlüsseltes Geheimnis anlegen:

- Name: `OPENAI_API_KEY`
- Wert: persönlicher OpenAI-API-Schlüssel

Optional kann zusätzlich eine normale Variable angelegt werden:

- Name: `OPENAI_MODEL`
- Standard: `gpt-5-mini`

Danach eine neue Bereitstellung auslösen. Der Endpunkt `/api/buddy` läuft als Cloudflare-Pages-Funktion und ruft die OpenAI Responses API serverseitig auf.

## Datenschutz

Der Buddy sendet ausschließlich den zuvor angezeigten, auf den aktuellen Arbeitsplatz begrenzten Kontext. Kindernamen, Diagnosen, private Notizen und der vollständige lokale Datenbestand sind ausgeschlossen. Vorschläge werden zunächst angezeigt und nur nach ausdrücklicher Auswahl übernommen.

## Testmodus

Der lokale Testmodus bleibt über einen Schalter im Buddy verfügbar. Er sendet keine Daten und benötigt keinen API-Schlüssel.

# Adapter

## Mock

`MockBuddyAdapter` ist der vollständig lauffähige Paket-09-Adapter. Er liefert für alle zehn Fähigkeiten deterministische, strukturierte Testvorschläge und unterstützt reproduzierbare Fehlerprüfungen. Er sendet keine Daten über das Netzwerk.

## Vorbereiteter OpenAI-Adapter

`PreparedOpenAIAdapter` definiert dieselbe Schnittstelle, führt im Browser aber absichtlich keine Anfrage aus und meldet `BUDDY_NOT_CONFIGURED`. Eine spätere echte Integration muss serverseitig erfolgen:

1. Browser sendet nur validierten, minimierten Kontext an einen authentifizierten eigenen Endpunkt.
2. Server hält Schlüssel und konkretes Modellprofil ausschließlich in seiner Umgebung.
3. Server setzt Zeitlimit, enges Ausgabelimit und höchstens einen kontrollierten Retry.
4. Server validiert die Modellantwort gegen dasselbe strukturierte Schema und gibt keine Rohantwort weiter.
5. Client validiert erneut und führt weiterhin keine automatische Änderung aus.

Eine reale OpenAI-Ausführung wurde in Paket 09 mangels sicherem Backend-Endpunkt und freigegebenem Testschlüssel nicht durchgeführt.


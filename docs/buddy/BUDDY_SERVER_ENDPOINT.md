# Serverseitiger Buddy-Endpunkt

`POST /api/v1/buddy/requests` akzeptiert nur Zieltyp, Ziel-ID, Fähigkeit und optionale kurze Anweisung. Sitzung und Workspace bestimmen das Ziel; der Server lädt den Kontext selbst, prüft Budget/Rate und validiert die strukturierte Providerantwort. Generieren mutiert keine Fachdaten. Der Paket-10-Schnitt nutzt den serverseitigen Mockprovider.


# Bedrohungsmodell

| Bedrohung | Auswirkung | Schutz und Test | Restrisiko |
| --- | --- | --- | --- |
| Fremde Objekt-ID / Workspace-Manipulation | Datenabfluss | Session-Workspace, ID+Workspace-Abfrage, IDOR-Tests | Programmierfehler in neuen Services |
| Sessiondiebstahl / Zugriff nach Logout | Kontozugriff | HttpOnly, SameSite, Secure produktiv, Rotation, Widerrufstests | kompromittierter Browser |
| Login-CSRF / Konto-Wechsel | falscher Workspace | state, nonce, PKCE, explizite Kontoauswahl; Adaptertests vorbereitet | realer Microsoft-Test offen |
| CSRF auf Schreiben | Datenänderung | Origin plus sitzungsgebundenes Token; Negativtests | XSS im erlaubten Origin |
| XSS | Sessionmissbrauch | React-Escaping, CSP, keine Tokens im JS-Speicher | kompromittierte Abhängigkeit |
| Prompt Injection / Dokumentinhalt | ungewollter Vorschlag | Server lädt minimierten Kontext, Schema/Policy, Paket-09-Tests | semantisch raffinierte Eingaben |
| API-Schlüsselleck | Kosten/Datenzugriff | Server-env, Redaction, Secret-Scan | falsch konfigurierte Infrastruktur |
| Datenbankfehlkonfiguration | Fremdzugriff | isolierte DB, least privilege später, Readiness | Produktionsbetrieb offen |
| Unsichere Logs | Datenschutzverletzung | Metadaten-Whitelist, keine Bodies/Tokens | neue Logstelle |
| Manipulierter Import | Überschreiben/IDOR | Zod, Hash, Preview, Workspace-Mapping, Transaktionstests | vollständige Dexie-Abdeckung folgt |
| Rate-/Kostenmissbrauch | Verfügbarkeit/Kosten | global, Auth, Buddy pro Workspace, Tagesbudget, Bodylimit | verteilte Umgehung ohne Redis |
| Kaskadenlöschung | Datenverlust | Restrict-FKs, Soft Delete, DB-Test | späterer Löschjob offen |


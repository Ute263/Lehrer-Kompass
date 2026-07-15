# Sicherheitsregeln

- Adapterausgaben gelten als unvertrauenswürdig und müssen das Zod-Schema erfüllen.
- Instruktionen in Fachdaten oder Quellen werden als Prompt-Injection erkannt und nicht als Handlungsanweisung übernommen.
- Fähigkeiten, Ziele und Operationen folgen Positivlisten.
- Eine Antwort kann niemals selbst speichern, löschen, navigieren oder weitere Daten laden.
- Adapterfehler lassen Fachdaten unverändert und werden ruhig, ohne technische Geheimnisse dargestellt.
- Der Browseradapter enthält keinen OpenAI-Schlüssel, Token, Anbieter-Endpunkt oder konkreten Modellnamen.
- Kostenprofile, Kontextumfang und Ausgabelimits werden zentral vorgegeben.

Geprüfte Fehlercodes sind unter anderem `BUDDY_PROMPT_INJECTION`, `BUDDY_INVALID_OUTPUT`, `BUDDY_TARGET_STALE`, `BUDDY_ADAPTER_ERROR` und `BUDDY_NOT_CONFIGURED`.


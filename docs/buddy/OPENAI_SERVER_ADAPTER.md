# OpenAI-Serveradapter

Geprüft am **15.07.2026**:

- [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Production Best Practices](https://developers.openai.com/api/docs/guides/production-best-practices)
- [Safety Best Practices](https://developers.openai.com/api/docs/guides/safety-best-practices)
- [Data Controls](https://developers.openai.com/api/docs/guides/your-data)

Der vorbereitete Provider verwendet ausschließlich den serverseitigen Schlüssel, ein serverseitig aufgelöstes Modellprofil, 15 Sekunden Timeout, maximal einen Retry, begrenzte Ausgabe und erneute Zod-Validierung. Er startet nur mit Schlüssel, Modell und `RUN_REAL_OPENAI_TEST=true`. Mangels freigegebenem Testschlüssel wurde keine reale OpenAI-Anfrage ausgeführt.


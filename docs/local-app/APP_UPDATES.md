# App-Aktualisierungen
Der Worker verwendet einen stabilen Dateinamen und versionierte Caches. Eine neue Worker-Version wartet standardmäßig, bis die bestehende Instanz nicht mehr genutzt wird. `SKIP_WAITING` wird nur nach bewusster UI-Aktion gesendet; eine laufende Eingabe wird nicht automatisch neu geladen. Alte LehrerKompass-Caches werden bei Aktivierung entfernt, IndexedDB bleibt unberührt.

Grundlage, geprüft am 15.07.2026: [Service-worker lifecycle](https://web.dev/articles/service-worker-lifecycle).

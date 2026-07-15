# Offline-Nutzung
Der Service Worker hält AppShell, erzeugte statische Assets und besuchte Kernrouten im Cache. `/api/`-Antworten, Sitzungen und Secrets werden nicht gecacht. „Online“ bezeichnet nur Netzwerkverfügbarkeit, nie Cloudspeicherung. Service Worker benötigen einen sicheren Ursprung; lokale Entwicklung nutzt `localhost`.

Grundlage, geprüft am 15.07.2026: [web.dev – Service workers](https://web.dev/learn/pwa/service-workers).

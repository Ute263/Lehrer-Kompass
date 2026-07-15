# Rate- und Kostenlimits

Fastify begrenzt global Requests, Auth separat und Buddy pro Route. Zusätzlich gelten 256-kB-Bodylimit, maximierter Kontext/Output, ein Vorschlag pro Anfrage, höchstens ein Retry und ein hartes tägliches Workspace-Mockbudget von 50 Anfragen. Überschreitungen liefern ruhige Fehler ohne erfundene Europreise. Für mehrere Produktionsinstanzen ist später ein zentraler atomarer Limiter nötig.


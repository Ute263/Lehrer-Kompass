# Klassen

`TeachingClass` gehört exakt zu einem Schuljahr und enthält Bezeichnung, Jahrgang 1–4, optionale Beschreibung, Aktivstatus und Archivzeitpunkt. Normalisierte Bezeichnungen sind innerhalb eines Schuljahres eindeutig; in anderen Jahren dürfen sie erneut vorkommen.

Archivieren ist Soft Delete. Die Detailansicht weist archivierte Klassen aus. Eine Jahrgangsänderung ist fachlich möglich und soll vor späterer Produktfreigabe einen expliziten UI-Bestätigungshinweis erhalten. Seed: aktive 2a und 3a in 2026/27 sowie eine archivierte Vorjahresklasse.

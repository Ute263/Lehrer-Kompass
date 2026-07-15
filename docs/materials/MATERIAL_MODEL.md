# Materialmodell

`MaterialFamily` bündelt zusammengehörige Fassungen. `Material` enthält Titel, Art, Status sowie optionale Kontext-IDs. `MaterialVariant` benennt die konkrete Standard-, Basis-, Erweiterungs-, Sprach-, Großschrift- oder sonstige Fassung.

Materialstatus: `draft → editing → ready_for_review → reviewed`; bei Korrekturbedarf führt `reviewed → needs_revision → editing`. Archivierung ist weich. Zod validiert sämtliche Datensätze beim Lesen.

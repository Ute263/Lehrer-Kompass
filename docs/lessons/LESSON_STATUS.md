# Stundenstatus

Zulässige Status sind `draft`, `planning`, `ready`, `completed`, `cancelled` und `needs_revision`. Übergänge werden zentral durch `LESSON_TRANSITIONS` validiert. Ein direkter unzulässiger Sprung wird als strukturierter Domainfehler abgelehnt.

Fehlendes Lernziel oder eine fehlende Sicherungsphase erzeugen vor „Einsatzbereit“ einen bewussten, nicht blockierenden Hinweis. Absage und Archivierung löschen keine Fachdaten; Archivierung deaktiviert zusätzlich den Werkbankverweis.

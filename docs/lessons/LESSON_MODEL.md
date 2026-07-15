# Stundenmodell

`Lesson` enthält Durchführung, optionale Gliederungsverknüpfung, Position, Titel, geplante Dauer, Status und technische Zeitstempel. Unterrichtstermine fehlen bewusst. `LessonPlanning`, `LessonPhase`, `LessonReflection` und `LessonWorkbenchRef` sind getrennte Fachobjekte und werden mit Zod validiert.

Physisches Löschen einer Stunde ist nicht vorgesehen. Archivierte und abgesagte Stunden bleiben nachvollziehbar. Eine Gliederungs-ID darf nur von einer Stunde verwendet werden.

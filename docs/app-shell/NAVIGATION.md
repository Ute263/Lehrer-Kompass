# Navigation

## Hauptmenüpunkte und Icons

Die zentrale Liste `MAIN_NAVIGATION` enthält ausschließlich: Werkbank (Wrench), Klassen (GraduationCap), Stundenplan (CalendarDays), Bibliothek (Library), Förderunterricht (Shapes), Schule und Grundlagen (BookOpen), Einstellungen (Settings). Die Line-Icons stammen aus dem bereits dokumentierten `lucide-react`.

## Aktiver Zustand

`NavLink` leitet den aktiven Eintrag aus der aktuellen Route ab und setzt `aria-current="page"`. Markierung, Text und Icon machen den Zustand ohne reine Farbcodierung verständlich.

## Einklappen und Speicherung

Die TopBar-Schaltfläche wechselt zwischen breiter und kompakter Navigation. Nur der boolesche Zustand wird unter `lehrerkompass.navigation.collapsed` in `localStorage` gespeichert. Erlaubt sind ausschließlich die Strings `true` und `false`; fehlende, ungültige oder nicht lesbare Werte führen zum sicheren Standard „ausgeklappt“. Technische Screenshots können `?nav=expanded|collapsed` verwenden.

## Kompakte und mobile Darstellung

Eingeklappt bleiben Icons, zugängliche Linknamen und Tooltips erhalten. Tablet zeigt die kompakte Navigation. Smartphone blendet die Seitenleiste aus und öffnet über einen beschrifteten Menüknopf eine mobile Navigation; Auswahl, Escape oder Schließen beendet sie und stellt den Fokus wieder her.

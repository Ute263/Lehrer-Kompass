# Routing

React Router wird zentral über `App.tsx`, `router.tsx` und `routes.ts` konfiguriert.

| Route | Ziel |
| --- | --- |
| `/` | Weiterleitung nach `/werkbank` |
| `/werkbank` | neutraler Werkbank-Platzhalter |
| `/klassen` | neutraler Klassen-Platzhalter |
| `/stundenplan` | Wochen- und Tagesansicht des lokalen Kalenders |
| `/stundenplan/tag/:date` | Tagesansicht eines Schuldatums |
| `/stundenplan/einstellungen` | Unterrichtsblöcke und fester Wochenstundenplan |
| `/kalender/termine/:eventId` | konkreter Kalendereintrag |
| `/tagesuebersicht/:date` | abgeleitete Tagesübersicht |
| `/vertretungsuebersicht/:date` | datenschutzreduzierte Vertretungsübersicht |
| `/bibliothek` | neutraler Bibliothek-Platzhalter |
| `/foerderunterricht` | neutraler Förderunterricht-Platzhalter |
| `/schule-grundlagen` | neutraler Grundlagen-Platzhalter |
| `/einstellungen` | neutraler Einstellungs-Platzhalter |
| `/design-system` | bestehende Paket-01-Testseite ohne AppShell |
| sonstige | ruhige Nicht-gefunden-Seite |

`BrowserRouter` ermöglicht direkte Vite-Aufrufe sowie Vor-/Zurücknavigation. Route-Metadaten für Navigation und Brotkrumen sind zentral gehalten; die aktuelle Ebene ist kein Link und „Startseite“ wird nicht ergänzt. Spätere tiefere Pfade können die Breadcrumb-Funktion erweitern, ohne die AppShell zu duplizieren. Die Routen enthalten noch keine Fachlogik oder Datenzugriffe.

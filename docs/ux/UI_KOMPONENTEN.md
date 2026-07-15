# UI-Komponenten – The Quiet Workspace

## Design-DNA
Ruhig, klar, hochwertig, freundlich, modern, nicht technisch und nicht wie Verwaltungssoftware. Viel Weißraum, Pastellblau, Türkis, Grün, Off-White, helles Grau, sanfte Rundungen und dezente Schatten.

## Grundkomponenten
- `AppShell`: Navigation, Topbar, Hauptarbeitsplatz, optional Buddy/Library Drawer, Syncstatus.
- `MainNavigation`: einklappbar; Werkbank, Klassen, Stundenplan, Bibliothek, Förderunterricht, Schule und Grundlagen, Einstellungen.
- `TopBar`: Menü, Brotkrumen, Suche, Syncstatus.
- `BreadcrumbNavigation`: anklickbarer fachlicher Pfad.
- `WorkbenchCard`: Titel, Typ, Klasse/Fach, Status, nächster Schritt, Weiterarbeiten.
- `SeriesCard`, `LessonCard`, `LessonTimeline`: ruhige Reihen- und Stundenübersichten.
- `PlanningProgress`, `PlanningSection`, `LessonPhaseCard`: didaktischer Planungsweg und bearbeitbare Phasen.
- `BuddyDrawer`, `BuddyQuickAction`, `BuddySuggestionCard`: standardmäßig geschlossen, maximal wenige Vorschläge, Vorschau vor Übernahme.
- `LibraryDrawer`, `MaterialCard`, `MaterialPreview`, `MaterialEditor`, `TaskBlock`.
- `CalendarLessonCard`, `DayOverviewCard`, `SupportGroupCard`.
- `StatusBadge`, `ProgressSummary`, `QuietNotice`, `EmptyState`, `QuietDialog`, `DestructiveActionDialog`, `SyncIndicator`, `VersionHistory`, `VersionCompare`.

## Status
Immer Text + Symbol + dezente Farbe. Normal: Entwurf, in Planung, einsatzbereit, durchgeführt, bewährt, überarbeiten. Rot nur für echte technische Fehler oder gefährliche Aktionen.

## Typografie und Abstände
Gut lesbare Sans-Serif; Seitentitel 28–32 px, Bereich 20–24 px, Karten 16–18 px, Standardtext 15–16 px. Konsistentes 4/8-Pixel-Raster; Karten innen 16–24 px.

## Interaktion
Pro Bereich maximal eine primäre Schaltfläche. Häufige Aktionen direkt sichtbar, seltene oder gefährliche unter „Mehr“. Löschen nur im Dialog. Tooltips und sichtbarer Fokus für Iconbuttons.

## Texte
Bevorzugt: Werkbank, Weiterarbeiten, Unterrichtsreihe, Unterrichtsstunde, Grundplanung, Stundenfolge, Material, Kurz reflektieren, Für neue Klasse übernehmen, Von Werkbank nehmen, Speicherort öffnen, Andere Sichtweise.

Technische Begriffe wie Asset, Entity, Workflow, Snapshot oder Sync Queue gehören nicht in Alltagsansichten.

## Responsive
Desktop: volle Arbeitsfläche, Buddy als Drawer, horizontale Zeitlinie. Tablet: Navigation standardmäßig eingeklappt, große Klickflächen. Smartphone: nur Begleitansicht für Werkbank, Tagesübersicht, Lesen einer Stunde, Kurzreflexion und Materialöffnung.

## Barrierefreiheit
Tastaturbedienung, sichtbare Fokuszustände, semantische Überschriften, eindeutige Beschriftungen, ausreichende Kontraste, keine Bedeutung nur über Farbe, ausreichend große Klickflächen.

## Wichtigste Regel
Der Arbeitsplatz ist immer größer und wichtiger als Navigation, Buddy, Bibliothek und Einstellungen.
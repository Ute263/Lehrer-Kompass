# AppShell

## Aufbau

`apps/web/src/app/AppShell.tsx` wird als einziges Layout für alle Anwendungsrouten verwendet. Es enthält Skip-Link, linke Hauptnavigation, sticky TopBar, Brotkrumen, SyncIndicator, Profilplatzhalter, den über `Outlet` eingesetzten Hauptinhalt sowie genau einen technischen Drawer. `/design-system` bleibt außerhalb dieser AppShell erhalten.

## Layoutbereiche

Der Hauptinhalt erhält den größten verfügbaren Anteil. Desktop: Navigation 15,5 rem beziehungsweise 4,75 rem kompakt. Tablet: kompakte Iconnavigation. Smartphone: keine dauerhafte Seitenleiste, sondern eine erreichbare mobile Schublade. Die TopBar bleibt flach und beim Scrollen sichtbar.

## Drawer

Ein gemeinsamer `Drawer` zeigt entweder Buddy- oder Bibliotheksinhalt; der Zustand ist ein einzelner diskriminierter Wert, daher können nie zwei Drawer parallel offen sein. Beide Inhalte sind ausdrücklich als inaktive Platzhalter gekennzeichnet. Escape, Fokusfalle, Schließen über Overlay und Fokusrückgabe stammen aus dem Paket-01-Designsystem.

## Responsive Regeln

- Desktop: vollständige Navigation und TopBar.
- Tablet bis 64 rem: Iconnavigation, verdichtete TopBar, Drawer als Overlay.
- Smartphone bis 42 rem: mobile Navigation, reduzierte Aktionen, lesbare Platzhalterseite.

In Browserprüfungen bei 900 px und 390 px entstand keine horizontale Überbreite.

## Fokusmanagement

Der Skip-Link fokussiert `main#main-content`. Drawer geben den Fokus zur auslösenden Schaltfläche zurück. Die mobile Navigation fokussiert beim Öffnen ihre Schließen-Schaltfläche, reagiert auf Escape und gibt den Fokus zum Menüknopf zurück. Alle Navigationselemente sind native Links oder Buttons.

## Statusanzeige

Der Paket-01-`SyncIndicator` zeigt standardmäßig den künstlichen Zustand `Lokal gespeichert`. Für technische Aufnahmen sind über `?sync=local|saving|server|pending|offline|conflict|error` alle Zustände auswählbar. Es existiert keine Speicher- oder Synchronisationslogik.

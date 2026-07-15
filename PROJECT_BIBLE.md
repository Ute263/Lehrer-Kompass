# LehrerKompass – PROJECT_BIBLE
## The Quiet Workspace · Version 1.0

## Mission
LehrerKompass ist ein privater, ruhiger digitaler Arbeitsplatz zur Planung, Durchführung und Weiterentwicklung von Unterricht. Die App soll Ordnung schaffen, Zeit sparen und die Lehrkraft bei gutem Unterricht sowie der Begleitung der Kinder unterstützen.

## Produktversprechen
LehrerKompass bietet einen klaren didaktischen Planungsweg, sichere Speicherung, wiederverwendbare Unterrichtsreihen, hochwertige Arbeitsmaterialien, eine intelligente Bibliothek, Kalender- und Vertretungsfunktionen sowie einen kontextbezogenen KI-Buddy. Die pädagogische Entscheidung bleibt immer bei der Lehrkraft.

## Pädagogische Grundlogik
Unterrichtsplanung folgt verbindlich diesem Weg:

Vorgaben und Thema → Lernvoraussetzungen → Lernziel → fachlicher Aufbau → Methodik → Differenzierung → Material → Durchführung → Reflexion.

Material ist Ergebnis der Planung, nicht ihr Ausgangspunkt. Themen ergeben sich aus Lehrplan, Arbeitsplan, Lehrwerk, Leistungskonzept und tatsächlichem Lernstand.

## Fachliche Hauptstruktur
Klasse → Fach → Thema → Unterrichtsreihe → Unterrichtsstunde → Material.

Beispiel: Klasse 2 → Deutsch → Nomen → Nomen entdecken → Stunde 3 → Arbeitsblatt.

## Stammreihe und Durchführung
Die Stammreihe enthält den langfristig nutzbaren fachlichen Grundaufbau. Eine Durchführung enthält die konkrete Nutzung mit Klasse, Schuljahr, Zeitraum, Terminen, Anpassungen und Reflexionen. Neue Klassen oder Schuljahre erzeugen neue Durchführungen; frühere Stände werden nicht überschrieben.

## Hauptarbeitsplätze
1. Werkbank
2. Unterrichtsreihe
3. Unterrichtsstunde
4. Materialwerkstatt
5. Bibliothek und Suche
6. Stundenplan, Kalender und Tagesübersicht
7. Förderunterricht

Unterstützend: Buddy, Schule und Grundlagen, Navigation, OneDrive, Versionen und Materialgestaltung.

## Werkbank
Die Werkbank zeigt nur aktive Werkstücke. Fertig bedeutet: von der Werkbank nehmen, nicht löschen. Die App geht davon aus, dass Unterrichtsplanung über mehrere Tage entsteht und Unterbrechungen normal sind.

## Kalender
Der Kalender verwaltet Zeit, nicht Unterrichtsinhalte. Termine verweisen auf Unterrichtsstunden und verändern deren Planung nicht automatisch. Tages- und Vertretungsübersichten übernehmen vorhandene Planungsdaten, schließen sensible Angaben aber aus.

## Bibliothek und OneDrive
OneDrive speichert Dateien. LehrerKompass speichert pädagogische Zusammenhänge, Bewertungen, Verknüpfungen, Versionen und Reflexionen. Originaldateien werden standardmäßig nur verknüpft; Änderungen erfolgen als Kopie oder Variante.

## Materialwerkstatt
LehrerKompass erstellt vollständige, bearbeitbare und druckfertige Materialien: Arbeitsblätter, Lösungen, Förder- und Forderfassungen, Lernzielkontrollen, Karten, Spiele, Tafelmaterial und Hilfekarten. PDF ist druckverbindlich, DOCX möglichst gut bearbeitbar. Aufgaben und Lösungen bleiben strukturell verbunden.

## Förderunterricht
Fördergruppen, Förderziele, Förderreihen und Förderstunden werden praktisch geplant. Daten werden standardmäßig anonymisiert. FörderKompass bleibt für ausführliche Förderplanung und Förderplandruck zuständig.

## Buddy
Der Buddy verhält sich wie eine erfahrene, freundliche, kreative Kollegin. Er darf strukturieren, kürzen, ergänzen, alternative Sichtweisen zeigen, Material erstellen, Differenzierung vorschlagen und Qualität prüfen. Er darf nicht belehren, diagnostizieren, benoten oder ungefragt Daten ändern. Größere Vorschläge werden vor Übernahme als Vorschau gezeigt und versioniert.

## Design-DNA
Interner Name: The Quiet Workspace. Die Oberfläche ist ruhig, klar, hochwertig und nicht wie eine Verwaltungssoftware. Verbindlich: viel Weißraum, Pastellblau, Türkis, Grün, Off-White, helles Grau, dezente Schatten, einklappbare Navigation und einklappbarer Buddy. Der Hauptarbeitsplatz ist immer größer als Navigation, Buddy und Bibliothek.

## Speicherung
PostgreSQL ist die serverseitige Hauptdatenbank, IndexedDB/Dexie die lokale Arbeitskopie, OneDrive der Dateispeicher. Autosave, Offline-Warteschlange, Versionen, Papierkorb, Sicherung und verständliche Konfliktbehandlung sind verbindlich.

## Technische Zielarchitektur
Frontend: React, TypeScript, Vite, React Router, TanStack Query, Zustand, Dexie, React Hook Form, Zod, dnd-kit.
Backend: Node.js, TypeScript, Fastify, Prisma, PostgreSQL.
Externe Dienste: Microsoft Graph und OpenAI API ausschließlich über das Backend.

## Produktgrenzen Version 1
Kein Mehrbenutzerbetrieb, keine Schülerzugänge, keine öffentliche Materialplattform, keine Noten- oder Zeugnisfunktionen, keine vollständige Canva-Funktionalität, keine automatische Vollanalyse des gesamten OneDrive und keine vollautomatische FörderKompass-Synchronisation.

## Verbindlicher Leitsatz
Ruhe schafft Raum für gute Ideen.

Bei Unsicherheit hat der ruhigere, sicherere, nachvollziehbarere und pädagogisch sinnvollere Weg Vorrang.
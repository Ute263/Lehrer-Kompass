# LehrerKompass – DONT.md
## Verbindliche Schutzregeln · Version 1.0

Codex und spätere Entwickler dürfen diese Regeln nicht still umgehen.

## Produktgrenzen
LehrerKompass darf kein allgemeines Projektmanagementsystem, Schulverwaltungsprogramm, Datei-Explorer, dominanter KI-Chat, Lernmanagementsystem, Notenprogramm oder öffentliche Materialplattform werden.

## Oberfläche
- Kein Dashboard-Monster mit Statistiken, Streaks oder Produktivitätswerten.
- Keine belastenden Aufgabenanzeigen wie „Noch 27 Aufgaben offen“.
- Keine überladene Navigation und keine tiefen Menüverschachtelungen.
- Kein dauerhaft sichtbarer Buddy oder Bibliotheksbereich.
- Keine grellen Warnfarben für normale offene Planungsschritte.
- Keine winzigen Schriften oder Klickflächen.
- Keine Bedeutung nur über Farbe.
- Keine verspielten Animationen, Konfetti oder blinkenden Elemente.

## Pädagogik und KI
- Keine beliebigen Themen als Standardausgangspunkt.
- Keine Arbeitsblätter vor Klärung von Lernziel, Kontext und Zeitrahmen.
- Keine KI als Autorität, Diagnoseinstanz oder automatische Benotung.
- Keine ungefragten KI-Änderungen.
- Keine unvalidierten KI-Ausgaben direkt in Fachdaten.
- Keine Quellenbehauptung ohne tatsächlich gelesene Quelle.
- Keine automatische Übernahme einzelner Reflexionen als allgemeine Wahrheit.

## Datenmodell
- Stammreihe und Durchführung nicht zusammenführen.
- Unterrichtsstunde und Kalendereintrag nicht vermischen.
- Material und Materialdatei nicht gleichsetzen.
- Keine Kopie für jede Verknüpfung.
- Keine automatische Änderung der Stammreihe aus einer Durchführung.
- Keine Überschreibung früherer Durchführungen.
- Keine unsichere Kaskadenlöschung.

## Dateien und OneDrive
- Keine ungefragte Veränderung, Umbenennung, Verschiebung oder Löschung vorhandener OneDrive-Dateien.
- Kein Zugriff auf das gesamte OneDrive ohne ausdrückliche Ordnerauswahl.
- OneDrive nicht als alleinige Datenbank verwenden.
- Keine automatischen Massenänderungen oder Dublettenlöschungen.
- Keine falsche Erfolgsmeldung bei kaputtem Speicherort-Link.

## Datenschutz
- Keine Klarnamen als Standard.
- Keine Fotos von Kindern.
- Keine Diagnosen oder sensiblen Daten in allgemeiner Suche, Vertretungsübersicht, Buddy-Kontext oder technischen Logs.
- Keine sensible Quelle an KI senden, wenn `allowAiUse` nicht gesetzt ist.
- Keine öffentliche Freigabe als Standard.

## Material
- Keine bloße Textsammlung als angeblich vollständiges Arbeitsblatt.
- Kein unkontrollierter Canva-Klon.
- Keine ungeklärten Bildquellen.
- Texte in generierten Bildern nicht als Standard.
- Keine stigmatisierenden Bezeichnungen für Differenzierung.
- Keine Behauptung, PDF und DOCX seien pixelgleich, wenn dies nicht geprüft ist.
- Kein Export gilt als erfolgreich, nur weil eine Datei erzeugt wurde.

## Technik
- Keine Secrets oder Zugriffstoken im Frontend, Repository oder normalen Export.
- Keine heimliche Änderung des Technologie-Stacks.
- Keine riesigen monolithischen Dateien.
- Keine Fachlogik in React-Komponenten.
- Keine unvalidierten API-, Import-, OneDrive- oder Backup-Daten.
- Keine Entfernung oder Abschwächung von Tests für einen grünen Build.
- Keine Attrappen als fertige Funktionen melden.
- Keine irreversible Migration ohne Sicherung und Test.
- Keine automatische Konfliktüberschreibung.
- Keine stillen Synchronisationsfehler.
- Keine vollständige Abhängigkeit von KI oder OneDrive.
- Keine Architekturänderung ohne Entscheidungsbericht.

## Entwicklung
- Nicht außerhalb des aktuellen Arbeitspakets großflächig arbeiten.
- Keine funktionierenden Bereiche ohne konkreten Grund neu schreiben.
- Keine bestehenden Funktionen entfernen, um neue Pakete zu vereinfachen.
- Keine Änderungen an FörderKompass, Arbeitsblattkompass oder Lernstand-Kompass ohne separaten Auftrag.
- Keine neue Funktion ohne Zweck, Datenwirkung, Sicherheitswirkung, Tests und Definition of Done.

## Oberste Schutzregel
Wenn eine Lösung Daten gefährdet, Originaldateien verändern könnte, die Oberfläche deutlich unruhiger macht, pädagogische Kontrolle reduziert oder mehr Arbeit erzeugt als sie spart, darf sie nicht eigenmächtig umgesetzt werden. Der Konflikt ist zu dokumentieren und eine sichere Alternative vorzuschlagen.
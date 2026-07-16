# K1 – Konsolidierung des LehrerKompasses

## Ziel

Keine neuen Hauptfunktionen. Vorhandene Bereiche werden so überarbeitet, dass Navigation, Buttons, Begriffe, Karten und Arbeitsabläufe zusammenpassen und auf dem iPad zuverlässig funktionieren.

## Abnahmeregel

Ein Punkt gilt erst als erledigt, wenn er im Browser praktisch getestet wurde. Ein vorhandener Button allein gilt nicht als fertige Funktion.

## Reihenfolge

### K1.1 Werkbank und Navigation

- alle sichtbaren Aktionen auf echte, sinnvolle Ziele prüfen
- deaktivierte „später verfügbar“-Aktionen aus produktiven Menüs entfernen
- erfundene Tageszahlen durch echte Daten oder neutrale Hinweise ersetzen
- Kartenhierarchie und Kartengrößen vereinheitlichen
- „Neue Stunde“ mit einem verständlichen Auswahlablauf verbinden
- Zurück-Navigation zwischen Klasse, Reihe, Stunde, Material und Bibliothek prüfen

### K1.2 KI-Buddy

- Öffnen und Schließen auf Desktop und iPad prüfen
- Kontext nachvollziehbar anzeigen
- Buddy ohne passenden Kontext nicht wie eine funktionsfähige Anfrage wirken lassen
- Testmodus und echte KI klar unterscheiden
- Fehler bei fehlendem API-Schlüssel verständlich anzeigen
- Übernehmen, Verwerfen und Wiederherstellen praktisch testen

### K1.3 Klassen, Reihen und Stunden

- Anlegen, Bearbeiten, Speichern, erneutes Öffnen und Archivieren prüfen
- doppelte oder unklare Einstiege entfernen
- Statusbezeichnungen vereinheitlichen
- jede sichtbare Schaltfläche auf Wirkung prüfen

### K1.4 Bibliothek und Materialien

- Materialarten vollständig deutsch anzeigen
- Suche, Filter, Favoriten und Vorschau prüfen
- Öffnen und Bearbeiten eindeutig trennen
- Verknüpfung zu Reihe und Stunde logisch gestalten

### K1.5 Förderunterricht und Grundlagen

- alle Formulare und Speichervorgänge prüfen
- leere oder dekorative Karten entfernen
- Verbindungen zu Werkbank und Bibliothek nachvollziehbar machen

### K1.6 Einstellungen, Sicherung und iPad

- Sicherung, Import, Austausch und Installation praktisch testen
- keine technischen oder englischen Texte in der Benutzeroberfläche
- Hoch- und Querformat prüfen
- Offline- und Aktualisierungsverhalten prüfen

## Erste bestätigte Brüche

- Werkbankkarten enthielten mehrere deaktivierte Menüpunkte mit „später verfügbar“.
- Die Tageskarte zeigt fest eingetragene Zahlen statt tatsächlicher Daten.
- Der Buddy wurde mehrfach technisch umgebaut, aber noch nicht als vollständiger Alltagsablauf abgenommen.
- Kartenhöhen und Aktionsmengen erzeugen eine unruhige Werkbank.
- Ein vorhandener Zielpfad bedeutet nicht automatisch, dass der gesamte Ablauf logisch oder vollständig ist.

## Arbeitsweise

Die Konsolidierung bleibt als zusammenhängende Phase bestehen. Änderungen werden in kleinen, testbaren Abschnitten umgesetzt. Nach jedem Abschnitt wird nicht sofort ein neues Funktionspaket begonnen, sondern zuerst die praktische Wirkung geprüft.

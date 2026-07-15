# ADR-001: Persönliche Microsoft-Konten und getrennte Einzelarbeitsplätze

## Status
Akzeptiert

## Kontext
LehrerKompass soll zunächst von Ute mit ihrem persönlichen Microsoft-Konto und ihrem privaten OneDrive genutzt werden. Später soll dieselbe Anwendung auch von Kolleginnen verwendet werden können, ohne gemeinsame Daten, Rollenverwaltung oder Zusammenarbeit vorauszusetzen.

## Entscheidung
LehrerKompass wird als gemeinsame Anwendung mit vollständig getrennten persönlichen Arbeitsbereichen entwickelt.

- Jede Lehrkraft meldet sich mit dem eigenen Microsoft-Konto an.
- Jede Lehrkraft verwendet das eigene OneDrive.
- Jede Lehrkraft erhält eigene App-Daten, Werkbank, Klassen, Reihen, Materialien, Einstellungen und Sicherungen.
- Zwischen den Arbeitsbereichen besteht standardmäßig keine Verbindung.
- Es gibt in Version 1 keine gemeinsame Bearbeitung, Teamverwaltung, Rollen oder geteilte Datenbankbereiche.
- Ein späterer Austausch erfolgt bewusst über Export und Import einzelner Reihen, Materialien oder Vorlagen.

## Kontotypen
Der erste reale Machbarkeitstest erfolgt mit einem persönlichen Microsoft-Konto und einem ausschließlich dafür vorgesehenen privaten OneDrive-Testordner.

Die technische Registrierung soll persönliche Microsoft-Konten unterstützen. Eine spätere zusätzliche Unterstützung von Arbeits- und Schulkonten ist möglich, darf aber nicht vorausgesetzt werden, da Schuladministrationen Microsoft-Graph-Berechtigungen einschränken können.

## Datentrennung
Jedes serverseitige Fachobjekt muss einer internen `userId` beziehungsweise einem persönlichen Workspace zugeordnet sein. Das Backend bestimmt die `userId` aus der authentifizierten Sitzung. Der Client darf keine fremde `userId` vorgeben.

OneDrive-Dateien werden ausschließlich im Namen des aktuell angemeldeten Kontos angesprochen. Token, Ordner-IDs und Dateiverknüpfungen dürfen niemals zwischen Nutzerkonten geteilt werden.

## Auswirkungen
- Die erste Nutzung bleibt einfach und einbenutzerorientiert.
- Die Datenarchitektur muss dennoch von Beginn an eine sichere Nutzertrennung besitzen.
- Es entstehen keine Funktionen für Zusammenarbeit oder gemeinsame Bearbeitung.
- Dieselbe installierbare PWA kann auf unterschiedlichen Geräten und von unterschiedlichen Personen verwendet werden.
- Die installierte App ist nicht an Utes Daten gebunden; die Anmeldung bestimmt den persönlichen Arbeitsbereich.

## Nicht Bestandteil
- gemeinsame Klassen oder Bibliotheken
- Kolleginnenrollen
- Freigabeworkflows
- gleichzeitige Bearbeitung
- Synchronisation zwischen Lehrkräften
- zentrale Schuladministration

## Sicherheitsregel
Eine authentifizierte Person darf ausschließlich eigene App-Daten und die über ihr eigenes Microsoft-Konto freigegebenen OneDrive-Dateien lesen oder verändern.
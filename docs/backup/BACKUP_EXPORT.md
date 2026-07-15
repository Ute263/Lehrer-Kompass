# Sicherungsexport
Der zentrale Service liest alle Inhaltstabellen, erzeugt Manifest und Prüfsummen und übergibt JSON an File System Access API oder Browserdownload. Letzte Sicherung wird erst nach erfolgreichem Schreiben gespeichert. Der Dateiname enthält Datum/Zeit, nie Klasse oder Unterrichtsinhalt. Nutzerabbruch ist `FILE_SAVE_CANCELLED`, kein Datenfehler.

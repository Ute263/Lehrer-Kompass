# Kontextmodell

Der Kontext wird erst nach einer bewussten Anfrage aus dem aktuellen Zielobjekt aufgebaut. Die Fähigkeit bestimmt eine Positivliste erlaubter Abschnitte. Stundenkontext umfasst nur erforderliche Planungsfelder und Phasen; Materialkontext nur erforderliche Dokument- und Aufgabenfelder; Reihenkontext nur die Grundplanung der aktuellen Durchführung.

Ausgeschlossen bleiben insbesondere vollständige Datenbankbestände, andere Arbeitsplätze, private Notizen, nicht benötigte Reflexionen sowie personenbezogene Angaben. Textwerte werden vor Übergabe normalisiert und gegen sensible Muster sowie eingebettete Instruktionen geprüft. Die Kontextvorschau nennt verwendete und ausgeschlossene Kategorien; sie überträgt noch nichts.

Die Zielaktualität wird über `updatedAt` gebunden. Vor der Übernahme muss der aktuelle Wert dem Erzeugungsstand entsprechen.


# Fachliches Grundmodell

Paket 04 bildet lokal ausschließlich `Schuljahr → Klasse → Klassenfach → Thema` ab. Fachobjekte liegen in `apps/web/src/domain`; React zeigt Daten und löst Serviceoperationen aus, enthält aber keine Duplikat-, Archiv- oder Ordnungslogik.

Alle IDs sind stabile technische IDs, alle Zeitstempel ISO-Strings. Eingaben werden getrimmt, Mehrfachleerzeichen reduziert und leere optionale Texte entfernt. Zod validiert jeden vollständigen Lesevorgang. Ein Werkbankeintrag darf optionale IDs referenzieren, bleibt aber ein eigenes Verweismodell.

Nicht enthalten: Unterrichtsreihen, Stunden, Materialien, Backend, PostgreSQL, OneDrive und KI.

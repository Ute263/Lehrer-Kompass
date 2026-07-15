# Lokaler Datenreset
Reset verlangt den exakten Text `LOKAL ZURÜCKSETZEN`. Vorher entsteht ein lokaler Wiederherstellungspunkt; dann werden nur Dexie-Inhaltstabellen transaktional geleert. Paket-10-Backenddaten und externe Dateien werden nicht verändert. Cache und Fachdaten sind getrennt.

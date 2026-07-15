# Kontrollierter lokaler Erstimport

Es gibt keine automatische Übertragung nach Login. Preview validiert das Paket, zählt gültige Daten und Dubletten und nennt den sitzungsbestimmten Zielworkspace, ohne Serverdaten zu ändern. Commit verlangt Preview-ID und unveränderten SHA-256-Hash, erzeugt neue Server-IDs samt Mapping, ist workspacegebunden und idempotent. Lokale Dexie-Daten werden nicht gelöscht.


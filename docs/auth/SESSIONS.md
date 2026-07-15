# Sitzungen

Nach Mock-Anmeldung wird die alte Sitzung des Nutzers widerrufen und eine zufällige neue ID erzeugt. Der Browser erhält nur `lk_session` als HttpOnly-, SameSite-Strict-Cookie; `Secure` ist in Produktion Pflicht. Session- und CSRF-Daten bleiben serverseitig, laufen ab und werden beim Logout entfernt. Keine Tokens in LocalStorage oder Dexie.


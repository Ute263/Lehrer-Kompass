# CSRF, CORS und Origin

CORS erlaubt ausschließlich `FRONTEND_ORIGIN` mit Credentials. Schreibmethoden verlangen denselben Origin sowie das sitzungsgebundene `x-csrf-token`. Wildcards sind ausgeschlossen. Helmet setzt CSP, Frame-, Referrer- und MIME-Schutz; zusätzlich wird eine restriktive Permissions Policy gesetzt. HSTS wird nur unter sicherer Produktions-TLS-Konfiguration wirksam.


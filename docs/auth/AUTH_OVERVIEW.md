# Anmeldung

Der Standard ist `MockIdentityAdapter` mit `personal-user-a` und `personal-user-b`. Der Microsoftadapter ist nur bei vollständiger Serverkonfiguration aktiv und validiert ID-Token über Microsoft Discovery/JWKS mit Issuer, Audience, Ablauf und Nonce. Interne Identität ist der validierte Provider-Subject, nicht die E-Mail-Adresse.


# Microsoft Identity Platform

Geprüft am **15.07.2026**:

- [OAuth 2.0 Authorization Code Flow mit PKCE](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)
- [Unterstützte Microsoft-Kontotypen](https://learn.microsoft.com/en-us/entra/identity-platform/v2-supported-account-types)
- [OpenID Connect und Discovery](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc)
- [Microsoft-Graph-Authentifizierung](https://learn.microsoft.com/en-us/graph/auth/)

Ziel ist ein servergestützter Authorization-Code-Ablauf mit PKCE, `state`, `nonce`, exakter Redirect-URI und `consumers` für persönliche Konten. Die reale App-Registrierung fehlt; deshalb ist der Adapter vorbereitet, aber nicht real getestet. Microsoft-Passwörter oder Access Tokens werden weder im Browser noch in normalen Fachtabellen gespeichert.


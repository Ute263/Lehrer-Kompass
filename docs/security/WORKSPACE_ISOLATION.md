# Workspace-Isolation

Jeder Nutzer besitzt genau einen privaten Workspace. Der Server leitet ihn ausschließlich aus der Sitzung ab. Jede exemplarische Liste, Detailabfrage, Änderung, Archivierung, Verknüpfung, Import-, Buddy- und Auditoperation filtert mit `workspaceId`. Clientseitig mitgesendete Workspace-IDs werden nicht vertraut.


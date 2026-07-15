# Komponenten – The Quiet Workspace

Importe erfolgen aus `apps/web/src/design-system/components`. Die Beispiele sind technische Kurzformen; alle sichtbaren Texte bleiben künstlich.

| Komponente | Zweck und Props | Varianten/Zustände | Accessibility | Beispiel |
| --- | --- | --- | --- | --- |
| `Button` | Aktion; `variant`, `loading`, native Button-Props | primary, secondary, ghost, destructive; hover, focus, disabled, loading | natives `button`, Busy-Attribut, sichtbarer Fokus | `<Button variant="secondary">Öffnen</Button>` |
| `IconButton` | kompakte Icon-Aktion; `label` | normal, hover, focus, disabled | verpflichtendes `aria-label`, 44-px-Ziel | `<IconButton label="Schließen">…</IconButton>` |
| `Card` | ruhige Gruppierungsfläche; HTML-Section-Props | Standardfläche | semantische Section, Überschrift im Inhalt | `<Card><h3>Material</h3></Card>` |
| `Badge` | kurze Kennzeichnung; `tone` | neutral, info, success, warning | lesbarer Text, nie Farbe allein | `<Badge tone="success">Bereit</Badge>` |
| `TextField` | einzeilige Eingabe; `label`, `hint`, `error`, `state` | default, success, error, disabled | Label, Description, `aria-invalid` | `<TextField id="t" label="Thema" />` |
| `TextAreaField` | längere Eingabe; Feld-Props | default, error, disabled | wie TextField, vergrößerbar | `<TextAreaField id="h" label="Hinweis" />` |
| `SelectField` | Auswahl; Feld-Props | default, error, disabled | natives Select mit Label | `<SelectField id="s" label="Stand">…</SelectField>` |
| `Checkbox` | unabhängige Ja/Nein-Wahl; `id`, `label` | checked, unchecked, disabled | natives Kontrollfeld, große Label-Fläche | `<Checkbox id="m" label="Anzeigen" />` |
| `Switch` | unmittelbar wirkende Einstellung; `id`, `label` | on, off, disabled | `role="switch"`, sichtbares Label | `<Switch id="r" label="Hinweise" />` |
| `Dialog` | kurze fokussierte Entscheidung; `open`, `title`, `onClose` | offen/geschlossen | Modalrolle, Fokusfalle, Escape, Rückgabe | `<Dialog open title="Prüfen" onClose={close}>…</Dialog>` |
| `Drawer` | ergänzende Kontextdetails rechts | offen/geschlossen, Tablet-Overlay | Dialogsemantik, Fokusmanagement, Escape | `<Drawer open title="Details" onClose={close}>…</Drawer>` |
| `Tooltip` | kurze Ergänzung zu Icon-Aktionen; `text` | hover, focus | `role="tooltip"`, Zuordnung per `aria-describedby` | `<Tooltip text="Hilfe">…</Tooltip>` |
| `Tabs` | alternative Ansichten; `labels` | aktiv/inaktiv | tablist, tab, tabpanel; Pfeiltasten | `<Tabs labels={["Überblick", "Material"]} />` |
| `PlanningSection` | schrittweise Offenlegung; `title`, `state` | closed, open, started, completed, notice | Button mit `aria-expanded` und Zielzuordnung | `<PlanningSection title="Einstieg" state="started">…</PlanningSection>` |
| `Notice` | sachliche Rückmeldung; `variant`, `title` | info, suggestion, success, warning, error | Text+Icon; Fehler als Alert, andere als Status | `<Notice variant="info" title="Hinweis">…</Notice>` |
| `EmptyState` | leere technische Ansicht | Standard | Überschrift, Erklärung, optionale Handlung | `<EmptyState />` |
| `LoadingState` | ruhiges Warten | ladend | `role="status"`, Live-Text, reduzierte Bewegung | `<LoadingState />` |
| `ErrorState` | technischer Fehler mit nächstem Schritt | Fehler | `role="alert"`, nicht nur rot | `<ErrorState />` |
| `SyncIndicator` | Speicher-/Abgleichstatus; `state` | local, saving, server, pending, offline, conflict, error | Statusrolle, ausgeschriebener Zustand | `<SyncIndicator state="offline" />` |
| `ProgressSummary` | sachlicher Mengenfortschritt | completed/total | verständlicher Text statt Farbbalken | `<ProgressSummary completed={3} total={5} label="Bereiche" />` |
| `Breadcrumbs` | Hierarchie; `items` | Link/aktuelle Seite | `nav`, Liste, `aria-current="page"` | `<Breadcrumbs items={[{label:"Technik"}]} />` |
| `Menu` | seltene Zusatzaktionen | offen/geschlossen | Menütaste, Menü- und Menuitem-Rollen | `<Menu />` |
| `SegmentedControl` | kleine exklusive Auswahl; `options` | gewählt/ungewählt | Radio-Gruppe mit Legend | `<SegmentedControl options={["Kompakt","Weit"]} />` |
| `PageHeader` | Seiteneinstieg; Titel, Beschreibung, Aktion | mit/ohne Eyebrow/Aktion | genau eine Seitenüberschrift im Einsatz | `<PageHeader title="Planung" description="…" />` |
| `SectionHeader` | Abschnittseinleitung | mit/ohne Beschreibung/Aktion | hierarchische Überschrift | `<SectionHeader title="Material" />` |
| `AppFramePrototype` | rein technischer Layoutprototyp | Navigation weit/schmal; Desktop/Tablet/Smartphone | benannte Navigation, Main-Landmark, beschriftete Icons | `<AppFramePrototype collapsed={false} …>…</AppFramePrototype>` |
| `PrototypeCardGrid` | responsive Kartenanordnung | zwei/eine Spalte | reine Layoutkomponente ohne falsche Semantik | `<PrototypeCardGrid><Card /></PrototypeCardGrid>` |

## Icons

Verwendet wird `lucide-react` in einheitlichem Line-Stil. Das Paket steht unter der ISC-Lizenz. Icons sind dekorativ mit `aria-hidden` oder erhalten über `IconButton` einen zugänglichen Namen; sie ersetzen nie den Statustext.

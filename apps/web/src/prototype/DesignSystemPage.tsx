import { useCallback, useState } from "react";
import { Bell, Plus } from "lucide-react";
import {
  AppFramePrototype, Badge, Breadcrumbs, Button, Card, Checkbox, Dialog, Drawer, EmptyState, ErrorState,
  IconButton, LoadingState, Menu, Notice, PageHeader, PlanningSection, ProgressSummary, PrototypeCardGrid,
  SectionHeader, SegmentedControl, SelectField, StateGroup, Switch, SyncIndicator, Tabs, TextAreaField,
  TextField, Tooltip
} from "../design-system/components";
import "../design-system/components/components.css";
import "./design-system-page.css";

const syncStates = ["local", "saving", "server", "pending", "offline", "conflict", "error"] as const;

export function DesignSystemPage() {
  const params = new URLSearchParams(globalThis.location?.search ?? "");
  const focusedSection = params.get("section");
  const [collapsed, setCollapsed] = useState(params.get("nav") === "collapsed");
  const [dialogOpen, setDialogOpen] = useState(params.get("dialog") === "open");
  const [drawerOpen, setDrawerOpen] = useState(params.get("drawer") === "open");
  const closeDialog = useCallback(() => setDialogOpen(false), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  return <AppFramePrototype collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} onOpenDrawer={() => setDrawerOpen(true)}>
    <div className="prototype-notice" role="note">Designsystem-Prototyp – keine Produktfunktion</div>
    <Breadcrumbs items={[{ label: "Technik", href: "#technik" }, { label: "Designsystem" }]} />
    <PageHeader eyebrow="The Quiet Workspace" title="Ruhige Bausteine für konzentriertes Arbeiten" description="Diese rein technische Testseite dokumentiert visuelle Grundlagen, Zustände und Interaktionen. Sie speichert keine Unterrichts- oder Kinderdaten." action={<Button onClick={() => setDialogOpen(true)}><Plus aria-hidden="true" size={18} />Dialog testen</Button>} />

    <section className="showcase" id="tokens" hidden={focusedSection !== null && focusedSection !== "tokens"}><SectionHeader title="Grundlagen" description="Farbflächen, Schriftgrößen, Abstände und Radien aus zentralen CSS-Tokens." />
      <Card><h3>Farben</h3><div className="swatches">{["page","card","soft","primary","turquoise","green","beige","info","success","warning","error"].map((name) => <div key={name}><span style={{ background: `var(--color-${name})` }} /><small>{name}</small></div>)}</div></Card>
      <PrototypeCardGrid><Card><h3>Typografie</h3><p className="type-2xl">Arbeitsbereich</p><p className="type-xl">Nomen entdecken</p><p>Gut lesbarer Fließtext für längere deutsche Hinweise, ohne unnötig kleine Schrift oder gedrängte Zeilen.</p><small>Kleine Zusatzinformation bleibt mindestens 13 px groß.</small></Card><Card><h3>Abstände und Formen</h3><div className="spacing-demo">{[4,8,12,16,24,32,48].map((size) => <span key={size} style={{ width: size, height: size }} title={`${size} Pixel`} />)}</div><div className="radius-demo"><span>8</span><span>12</span><span>16</span></div></Card></PrototypeCardGrid>
    </section>

    <section className="showcase" id="actions" hidden={focusedSection !== null && focusedSection !== "actions"}><SectionHeader title="Aktionen und Navigation" description="Große Ziele, klare Hierarchie und vollständige Tastaturbedienung." />
      <Card className="component-stack"><div className="row-wrap"><Button>Primär</Button><Button variant="secondary">Sekundär</Button><Button variant="ghost">Zurückhaltend</Button><Button variant="destructive">Löschen</Button><Button loading>Speichert</Button><Button disabled>Nicht verfügbar</Button></div><div className="row-wrap"><Tooltip text="Benachrichtigungen ansehen"><IconButton label="Benachrichtigungen"><Bell aria-hidden="true" /></IconButton></Tooltip><Menu /><SegmentedControl options={["Kompakt", "Komfortabel"]} /></div><Tabs labels={["Überblick", "Material", "Notizen"]} /></Card>
    </section>

    <section className="showcase" id="forms" hidden={focusedSection !== null && focusedSection !== "forms"}><SectionHeader title="Formulare und Feldzustände" description="Beschriftungen, Hilfen und Fehler bleiben auch ohne Farbe verständlich." />
      <Card className="form-grid"><TextField id="topic" label="Thema" defaultValue="Nomen entdecken" hint="Eine kurze, eindeutige Bezeichnung." /><TextField id="success-field" label="Gespeicherter Titel" defaultValue="Stunde 3" state="success" hint="Eingabe geprüft und übernommen." /><TextField id="error-field" label="Materialangabe" defaultValue="" error="Bitte eine Materialangabe ergänzen." /><SelectField id="phase" label="Planungsstand" defaultValue="open"><option value="open">Material noch offen</option><option value="ready">Vorbereitet</option></SelectField><TextAreaField id="description" label="Längerer Hinweistext" defaultValue="Dieses Beispiel prüft, ob ein längerer deutscher Text in einem ruhigen Arbeitsbereich lesbar bleibt und bei schmaleren Ansichten sinnvoll umbrechen kann." hint="Nur künstliche Beispieldaten verwenden." /><div><Checkbox id="check" label="Materialliste anzeigen" defaultChecked /><Switch id="switch" label="Ruhige Hinweise aktivieren" defaultChecked /></div></Card>
    </section>

    <section className="showcase" id="status" hidden={focusedSection !== null && focusedSection !== "status"}><SectionHeader title="Status und Rückmeldung" description="Jeder Zustand trägt Text oder Symbolik und ist nicht allein farbcodiert." />
      <Card className="component-stack"><div className="row-wrap">{syncStates.map((state) => <SyncIndicator key={state} state={state} />)}</div><div className="notice-grid"><Notice variant="info" title="Information">Die Ansicht ist lokal vorbereitet.</Notice><Notice variant="suggestion" title="Vorschlag">Material für Stunde 3 ergänzen.</Notice><Notice variant="success" title="Gespeichert">Die technischen Beispieldaten sind aktuell.</Notice><Notice variant="warning" title="Noch offen">Eine manuelle Prüfung steht aus.</Notice><Notice variant="error" title="Technischer Fehler">Der Abgleich konnte nicht geprüft werden.</Notice></div><ProgressSummary completed={3} total={5} label="Fortschritt ohne motivierende Prozentwertung" /><div className="row-wrap"><Badge>Entwurf</Badge><Badge tone="info">Hinweis</Badge><Badge tone="success">Bereit</Badge><Badge tone="warning">Offen</Badge></div></Card>
    </section>

    <section className="showcase" id="planning" hidden={focusedSection !== null && focusedSection !== "planning"}><SectionHeader title="Planungsabschnitte" description="Geschlossen, geöffnet, begonnen, abgeschlossen und mit Hinweis." />
      <div className="planning-list"><PlanningSection title="Einstieg" state="closed">Künstlicher Beispielinhalt.</PlanningSection><PlanningSection title="Nomen entdecken" state="open" defaultOpen>Ein langer, sachlicher Beispieltext zeigt die offene Darstellung, ohne eine fachliche LehrerKompass-Funktion zu implementieren.</PlanningSection><PlanningSection title="Übungsphase" state="started">Begonnener Bereich.</PlanningSection><PlanningSection title="Abschluss" state="completed">Abgeschlossener Bereich.</PlanningSection><PlanningSection title="Material" state="notice">Material noch offen.</PlanningSection></div>
    </section>

    <section className="showcase" id="states" hidden={focusedSection !== null && focusedSection !== "states"}><SectionHeader title="Leere, ladende und fehlerhafte Ansichten" description="Ruhige Zustände mit verständlicher nächster Handlung." /><StateGroup><EmptyState /><LoadingState /><ErrorState /></StateGroup></section>

    <Drawer open={drawerOpen} title="Technischer Seitenbereich" onClose={closeDrawer}><Notice variant="info" title="Nur ein Prototyp">Dieser Drawer demonstriert Fokusführung, Overlay-Verhalten und responsive Breite.</Notice><div className="drawer-content"><TextField id="drawer-field" label="Beispielbezeichnung" defaultValue="Stunde 3" /><Button variant="secondary" onClick={closeDrawer}>Seitenbereich schließen</Button></div></Drawer>
    <Dialog open={dialogOpen} title="Beispieldialog" onClose={closeDialog}><p>Dieser Dialog enthält ausschließlich künstliche Beispieldaten und prüft Fokusfalle, Escape-Taste und Fokusrückgabe.</p><TextField id="dialog-field" label="Beispielname" defaultValue="Nomen entdecken" /></Dialog>
  </AppFramePrototype>;
}

import { useCallback, useMemo, useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock3, Plus, Save, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Dialog, Notice } from "../../design-system/components";
import { WORKBENCH_FILTERS, type WorkbenchFilter, type WorkbenchItem } from "./workbench-model";
import { useWorkbench } from "./useWorkbench";
import { WorkbenchEmptyState } from "./WorkbenchEmptyState";
import { WorkbenchFilterControl } from "./WorkbenchFilter";
import { WorkbenchSection } from "./WorkbenchSection";
import "./workbench.css";

export function WorkbenchPage() {
  const [params] = useSearchParams();
  const queryFilter = params.get("filter");
  const forcedFilter = WORKBENCH_FILTERS.includes(queryFilter as WorkbenchFilter) ? queryFilter as WorkbenchFilter : null;
  const workbench = useWorkbench(params.get("state"), forcedFilter);
  const [pendingRemoval, setPendingRemoval] = useState<WorkbenchItem | null>(null);
  const [removed, setRemoved] = useState<WorkbenchItem | null>(null);
  const [future, setFuture] = useState<string | null>(null);
  const closeRemoval = useCallback(() => setPendingRemoval(null), []);
  const confirmRemoval = () => { if (pendingRemoval) { workbench.remove(pendingRemoval.id); setRemoved(pendingRemoval); setPendingRemoval(null); } };
  const nothingVisible = !workbench.pinned.length && !workbench.current.length && !workbench.completed.length;
  const continueItem = useMemo(() => workbench.pinned[0] ?? workbench.current[0] ?? null, [workbench.pinned, workbench.current]);
  const today = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "2-digit", month: "long" }).format(new Date());

  return <div className="workbench-page">
    <header className="quiet-hero">
      <div><p className="quiet-hero__eyebrow">Deine Werkbank</p><h1>Guten Tag, Ute.</h1><p>{today}. Alles Wichtige liegt bereit.</p></div>
      <div className="quiet-hero__mark" aria-hidden="true"><Sparkles /></div>
    </header>

    <div className="workbench-layout">
      <div className="workbench-main">
        {continueItem && <section className="continue-card" aria-labelledby="continue-heading">
          <div className="continue-card__icon"><BookOpen aria-hidden="true" /></div>
          <div className="continue-card__body"><span>Zuletzt bearbeitet</span><h2 id="continue-heading">{continueItem.title}</h2><p>{[continueItem.classLabel, continueItem.subjectLabel, continueItem.topicLabel].filter(Boolean).join(" · ") || continueItem.subtitle}</p><small><Clock3 aria-hidden="true" /> {continueItem.progressText ?? "Dein aktueller Arbeitsstand ist gespeichert."}</small></div>
          <Link className="continue-card__action" to={continueItem.targetRoute} onClick={() => workbench.markEdited(continueItem.id)}>Weiterarbeiten <ArrowRight aria-hidden="true" /></Link>
        </section>}

        <section className="focus-strip" aria-labelledby="focus-heading">
          <div><span className="focus-strip__icon"><CheckCircle2 aria-hidden="true" /></span><div><h2 id="focus-heading">Heute im Fokus</h2><p>Reihe weiterplanen, eine Stunde vorbereiten und Material für morgen prüfen.</p></div></div>
          <Button variant="ghost" onClick={() => setFuture("Tagesfokus bearbeiten")}>Bearbeiten</Button>
        </section>

        <section className="create-area" aria-labelledby="create-heading">
          <div className="section-heading"><div><span>Neu beginnen</span><h2 id="create-heading">Was möchtest du vorbereiten?</h2></div></div>
          <div className="create-grid">
            {["Neue Unterrichtsreihe", "Neue Stunde", "Material erstellen", "Förderplanung"].map((label) => <button key={label} type="button" onClick={() => setFuture(label)}><Plus aria-hidden="true" /><span>{label}</span></button>)}
          </div>
        </section>

        <section className="current-work" aria-labelledby="current-work-heading">
          <div className="section-heading section-heading--with-filter"><div><span>Deine Inhalte</span><h2 id="current-work-heading">Weiterarbeiten</h2></div><WorkbenchFilterControl value={workbench.filter} onChange={workbench.setFilter} /></div>
          {removed && <Notice variant="info" title={`„${removed.title}“ wurde von der Werkbank genommen.`}><Button variant="ghost" onClick={() => { workbench.undoRemove(removed.id); setRemoved(null); }}>Rückgängig</Button></Notice>}
          {nothingVisible ? <WorkbenchEmptyState /> : <><WorkbenchSection title="Angeheftet" items={workbench.pinned} onTogglePinned={workbench.togglePinned} onRemove={setPendingRemoval} onContinue={workbench.markEdited}/><WorkbenchSection title="Aktuelle Arbeiten" items={workbench.current} onTogglePinned={workbench.togglePinned} onRemove={setPendingRemoval} onContinue={workbench.markEdited}/>{workbench.completed.length > 0 && <section className="completed-area" aria-labelledby="completed-heading"><h2 id="completed-heading" className="sr-only">Zuletzt abgeschlossen</h2><WorkbenchSection title="Zuletzt abgeschlossen" items={workbench.completed} onTogglePinned={workbench.togglePinned} onRemove={setPendingRemoval} onContinue={workbench.markEdited}/></section>}</>}
        </section>
      </div>

      <aside className="workbench-aside" aria-label="Tagesinformationen">
        <section className="quiet-side-card"><div className="quiet-side-card__title"><CalendarDays aria-hidden="true" /><h2>Heute</h2></div><ul><li><strong>2 Reihen</strong><span>in Planung</span></li><li><strong>1 Stunde</strong><span>vorzubereiten</span></li><li><strong>Material</strong><span>für morgen prüfen</span></li></ul></section>
        <section className="quiet-side-card quiet-side-card--accent"><div className="quiet-side-card__title"><ShieldCheck aria-hidden="true" /><h2>Sicherung</h2></div><p>Dein letzter Arbeitsstand ist lokal gespeichert.</p><button type="button" onClick={() => setFuture("Datensicherung")}><Save aria-hidden="true" /> Jetzt sichern</button></section>
        <section className="quiet-side-card"><div className="quiet-side-card__title"><Sparkles aria-hidden="true" /><h2>Schnelleinstieg</h2></div><nav><Link to="/stundenplan">Stundenplan öffnen <ArrowRight aria-hidden="true" /></Link><Link to="/bibliothek">Bibliothek durchsuchen <ArrowRight aria-hidden="true" /></Link><button type="button" onClick={() => setFuture("Materialwerkstatt")}>Materialwerkstatt <ArrowRight aria-hidden="true" /></button></nav></section>
      </aside>
    </div>

    <Dialog open={pendingRemoval !== null} title="Von der Werkbank nehmen?" onClose={closeRemoval} confirmLabel="Von Werkbank nehmen" onConfirm={confirmRemoval}><p>„{pendingRemoval?.title}“ verschwindet von der Werkbank. {pendingRemoval?.type === "series" ? "Die Unterrichtsreihe" : "Der Inhalt"} bleibt gespeichert und kann später wieder geöffnet werden.</p></Dialog>
    <Dialog open={future !== null} title={future ?? "Später verfügbar"} onClose={() => setFuture(null)} confirmLabel="Verstanden"><p>Diese Funktion wird in einem späteren Paket umgesetzt. Es wurden keine Daten angelegt.</p></Dialog>
  </div>;
}

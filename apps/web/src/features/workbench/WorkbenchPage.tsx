import { useCallback, useState } from "react";
import { CalendarDays, Compass, FolderClock, HardDrive, NotebookPen, Pencil, Ruler } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Card, Dialog, Notice, PlanningSection } from "../../design-system/components";
import { WORKBENCH_FILTERS, type WorkbenchFilter, type WorkbenchItem } from "./workbench-model";
import { useWorkbench } from "./useWorkbench";
import { WorkbenchEmptyState } from "./WorkbenchEmptyState";
import { WorkbenchFilterControl } from "./WorkbenchFilter";
import { WorkbenchSection } from "./WorkbenchSection";
import "./workbench.css";
import "./workbench-refresh.css";

export function WorkbenchPage() {
  const [params]=useSearchParams();const queryFilter=params.get("filter");const forcedFilter=WORKBENCH_FILTERS.includes(queryFilter as WorkbenchFilter)?queryFilter as WorkbenchFilter:null;
  const workbench=useWorkbench(params.get("state"),forcedFilter);const[pendingRemoval,setPendingRemoval]=useState<WorkbenchItem|null>(null);const[removed,setRemoved]=useState<WorkbenchItem|null>(null);const[future,setFuture]=useState<string|null>(null);
  const closeRemoval=useCallback(()=>setPendingRemoval(null),[]);const confirmRemoval=()=>{if(pendingRemoval){workbench.remove(pendingRemoval.id);setRemoved(pendingRemoval);setPendingRemoval(null);}};
  const nothingVisible=!workbench.pinned.length&&!workbench.current.length&&!workbench.completed.length;
  const heroWithoutImage=params.get("hero")==="off";
  return <div className={`workbench-page ${heroWithoutImage?"workbench-page--hero-fallback":""}`}>
    <div className="workbench-stage"><section className="workbench-hero" aria-labelledby="workbench-title">
      <div className="workbench-hero__copy"><span className="hero-compass" aria-hidden="true"><Compass/></span><h1 id="workbench-title" aria-label="Werkbank">Deine Werkbank</h1><p>Hier liegt, woran du gerade arbeitest.</p><span className="hero-note">Alles Wichtige im Blick.<br/>Alles Weitere in Ruhe.</span><div className="page-actions"><Button onClick={()=>setFuture("Neue Unterrichtsreihe")}>Neue Unterrichtsreihe</Button><Button variant="secondary" onClick={()=>setFuture("Frühere Inhalte öffnen")}>Frühere Inhalte öffnen</Button></div></div>
      <div className="desk-placeholder" aria-hidden="true"><span className="desk-placeholder__label">Lokaler Bildplatzhalter</span><span className="desk-notebook"><NotebookPen/></span><span className="desk-pencil"><Pencil/></span><span className="desk-ruler"><Ruler/></span><span className="desk-cup"><i/><i/><i/></span><span className="desk-compass"><Compass/></span></div>
    </section><aside className="workbench-aside" aria-label="Begleitende Übersicht"><Card><CalendarDays aria-hidden="true"/><div><h2>Heute im Blick</h2><p>Deine Tagesübersicht liegt bereit.</p><Link to="/tagesuebersicht/2026-08-24">Tag öffnen</Link></div></Card><Card><HardDrive aria-hidden="true"/><div><h2>Sicherung</h2><p>Deine Daten bleiben lokal auf diesem Gerät.</p><Link to="/einstellungen/sicherung">Sicherung öffnen</Link></div></Card><Card><FolderClock aria-hidden="true"/><div><h2>Schnelleinstieg</h2><nav aria-label="Schnelleinstieg"><Link to="/klassen" aria-label="Klassen öffnen">Klassen</Link><Link to="/stundenplan" aria-label="Stundenplan öffnen">Stundenplan</Link></nav></div></Card></aside></div>
    <div className="workbench-layout"><div className="workbench-main">
      <div className="workbench-toolbar"><p>Hier liegt nur, woran gerade gearbeitet wird.</p><WorkbenchFilterControl value={workbench.filter} onChange={workbench.setFilter} /></div>
      {removed&&<Notice variant="info" title={`„${removed.title}“ wurde von der Werkbank genommen.`}><Button variant="ghost" onClick={()=>{workbench.undoRemove(removed.id);setRemoved(null);}}>Rückgängig</Button></Notice>}
      {nothingVisible?<WorkbenchEmptyState/>:<><WorkbenchSection title="Angeheftet" items={workbench.pinned} onTogglePinned={workbench.togglePinned} onRemove={setPendingRemoval} onContinue={workbench.markEdited}/><WorkbenchSection title="Aktuelle Arbeiten" items={workbench.current} onTogglePinned={workbench.togglePinned} onRemove={setPendingRemoval} onContinue={workbench.markEdited}/>{workbench.completed.length>0&&<section className="completed-area" aria-labelledby="completed-heading"><h2 id="completed-heading" className="sr-only">Zuletzt abgeschlossen</h2><PlanningSection title="Zuletzt abgeschlossen" state="completed"><WorkbenchSection title="Abgeschlossene Arbeiten" items={workbench.completed} onTogglePinned={workbench.togglePinned} onRemove={setPendingRemoval} onContinue={workbench.markEdited}/></PlanningSection></section>}</>}
    </div></div>
    <Dialog open={pendingRemoval!==null} title="Von der Werkbank nehmen?" onClose={closeRemoval} confirmLabel="Von Werkbank nehmen" onConfirm={confirmRemoval}><p>„{pendingRemoval?.title}“ verschwindet von der Werkbank. {pendingRemoval?.type==="series"?"Die Unterrichtsreihe":"Der Inhalt"} bleibt gespeichert und kann später wieder geöffnet werden.</p></Dialog>
    <Dialog open={future!==null} title={future??"Später verfügbar"} onClose={()=>setFuture(null)} confirmLabel="Verstanden"><p>Diese Funktion wird in einem späteren Paket umgesetzt. Es wurden keine Daten angelegt.</p></Dialog>
  </div>;
}

import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Dialog, Notice, PageHeader, PlanningSection } from "../../design-system/components";
import { WORKBENCH_FILTERS, type WorkbenchFilter, type WorkbenchItem } from "./workbench-model";
import { useWorkbench } from "./useWorkbench";
import { WorkbenchEmptyState } from "./WorkbenchEmptyState";
import { WorkbenchFilterControl } from "./WorkbenchFilter";
import { WorkbenchSection } from "./WorkbenchSection";
import "./workbench.css";

export function WorkbenchPage() {
  const [params]=useSearchParams();const queryFilter=params.get("filter");const forcedFilter=WORKBENCH_FILTERS.includes(queryFilter as WorkbenchFilter)?queryFilter as WorkbenchFilter:null;
  const workbench=useWorkbench(params.get("state"),forcedFilter);const[pendingRemoval,setPendingRemoval]=useState<WorkbenchItem|null>(null);const[removed,setRemoved]=useState<WorkbenchItem|null>(null);const[future,setFuture]=useState<string|null>(null);
  const closeRemoval=useCallback(()=>setPendingRemoval(null),[]);const confirmRemoval=()=>{if(pendingRemoval){workbench.remove(pendingRemoval.id);setRemoved(pendingRemoval);setPendingRemoval(null);}};
  const nothingVisible=!workbench.pinned.length&&!workbench.current.length&&!workbench.completed.length;
  return <div className="workbench-page"><PageHeader title="Werkbank" description="Hier liegt, woran du gerade arbeitest." action={<div className="page-actions"><Button onClick={()=>setFuture("Neue Unterrichtsreihe")}>Neue Unterrichtsreihe</Button><Button variant="secondary" onClick={()=>setFuture("Frühere Inhalte öffnen")}>Frühere Inhalte öffnen</Button></div>} />
    <div className="workbench-toolbar"><p>Hier liegt nur, woran gerade gearbeitet wird.</p><WorkbenchFilterControl value={workbench.filter} onChange={workbench.setFilter} /></div>
    {removed&&<Notice variant="info" title={`„${removed.title}“ wurde von der Werkbank genommen.`}><Button variant="ghost" onClick={()=>{workbench.undoRemove(removed.id);setRemoved(null);}}>Rückgängig</Button></Notice>}
    {nothingVisible?<WorkbenchEmptyState/>:<><WorkbenchSection title="Angeheftet" items={workbench.pinned} onTogglePinned={workbench.togglePinned} onRemove={setPendingRemoval} onContinue={workbench.markEdited}/><WorkbenchSection title="Aktuelle Arbeiten" items={workbench.current} onTogglePinned={workbench.togglePinned} onRemove={setPendingRemoval} onContinue={workbench.markEdited}/>{workbench.completed.length>0&&<section className="completed-area" aria-labelledby="completed-heading"><h2 id="completed-heading" className="sr-only">Zuletzt abgeschlossen</h2><PlanningSection title="Zuletzt abgeschlossen" state="completed"><WorkbenchSection title="Abgeschlossene Arbeiten" items={workbench.completed} onTogglePinned={workbench.togglePinned} onRemove={setPendingRemoval} onContinue={workbench.markEdited}/></PlanningSection></section>}</>}
    <Dialog open={pendingRemoval!==null} title="Von der Werkbank nehmen?" onClose={closeRemoval} confirmLabel="Von Werkbank nehmen" onConfirm={confirmRemoval}><p>„{pendingRemoval?.title}“ verschwindet von der Werkbank. {pendingRemoval?.type==="series"?"Die Unterrichtsreihe":"Der Inhalt"} bleibt gespeichert und kann später wieder geöffnet werden.</p></Dialog>
    <Dialog open={future!==null} title={future??"Später verfügbar"} onClose={()=>setFuture(null)} confirmLabel="Verstanden"><p>Diese Funktion wird in einem späteren Paket umgesetzt. Es wurden keine Daten angelegt.</p></Dialog>
  </div>;
}

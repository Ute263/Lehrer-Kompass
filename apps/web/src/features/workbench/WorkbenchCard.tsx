import { CalendarDays, CheckCircle2, CircleDot, Pin, PinOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, Menu } from "../../design-system/components";
import { STATUS_LABELS, TYPE_LABELS, type WorkbenchItem } from "./workbench-model";

function contextFor(item: WorkbenchItem): string { return [item.classLabel,item.subjectLabel,item.topicLabel,item.subtitle].filter(Boolean).join(" · ") || "Persönlicher Arbeitsbereich"; }
export function WorkbenchCard({ item, onTogglePinned, onRemove, onContinue }: { item: WorkbenchItem; onTogglePinned: () => void; onRemove: () => void; onContinue: () => void }) {
  const navigate=useNavigate(); const headingId=`workbench-${item.id}`; const StatusIcon=item.status==="completed"?CheckCircle2:CircleDot;
  const open=()=>{onContinue();navigate(item.targetRoute);};
  return <Card className="workbench-card" aria-labelledby={headingId}>
    <div className="workbench-card__top"><span className="workbench-card__type">{TYPE_LABELS[item.type]}</span><Menu label={`Mehr zu ${item.title}`} items={[{label:"Öffnen",onSelect:open},{label:item.pinned?"Nicht mehr anheften":"Anheften",onSelect:onTogglePinned},{label:"Von der Werkbank nehmen",onSelect:onRemove}]} /></div>
    <h3 id={headingId}>{item.title}</h3><p className="workbench-card__context">{contextFor(item)}</p>
    <div className="workbench-card__status"><Badge tone={item.status==="ready"||item.status==="completed"?"success":item.status==="needs-revision"?"warning":"info"}><StatusIcon aria-hidden="true" size={15} />{STATUS_LABELS[item.status]}</Badge>{item.pinned&&<span className="pinned-label"><Pin aria-hidden="true" size={15} />Angeheftet</span>}</div>
    {item.nextStep&&<div className="next-step"><span>Nächster Schritt</span><strong>{item.nextStep}</strong></div>}
    <div className="workbench-card__meta">{item.progressText&&<span>{item.progressText}</span>}{item.nextDate&&<span><CalendarDays aria-hidden="true" size={15} />Nächster Termin: {new Intl.DateTimeFormat("de-DE").format(new Date(item.nextDate))}</span>}</div>
    <div className="workbench-card__actions"><Button onClick={open}>Weiterarbeiten</Button><Button variant="ghost" onClick={onTogglePinned}>{item.pinned?<><PinOff aria-hidden="true" size={17}/>Nicht mehr anheften</>:<><Pin aria-hidden="true" size={17}/>Anheften</>}</Button><Button variant="ghost" onClick={onRemove}>Von Werkbank nehmen</Button></div>
  </Card>;
}

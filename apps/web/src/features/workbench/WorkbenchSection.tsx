import type { WorkbenchItem } from "./workbench-model";
import { WorkbenchCard } from "./WorkbenchCard";

export function WorkbenchSection({ title, items, onTogglePinned, onRemove, onContinue }: { title: string; items: WorkbenchItem[]; onTogglePinned: (id:string)=>void; onRemove:(item:WorkbenchItem)=>void; onContinue:(id:string)=>void }) {
  if(!items.length)return null;
  return <section className="workbench-section" aria-labelledby={`section-${title}`}><div className="workbench-section__header"><h2 id={`section-${title}`}>{title}</h2></div><div className="workbench-grid">{items.map((item)=><WorkbenchCard key={item.id} item={item} onTogglePinned={()=>onTogglePinned(item.id)} onRemove={()=>onRemove(item)} onContinue={()=>onContinue(item.id)} />)}</div></section>;
}

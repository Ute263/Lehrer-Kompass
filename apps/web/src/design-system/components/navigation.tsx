import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { IconButton } from "./actions";

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return <nav aria-label="Brotkrumen"><ol className="breadcrumbs">{items.map((item, index) => <li key={item.label}>{item.href && index < items.length - 1 ? <a href={item.href}>{item.label}</a> : <span aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</span>}</li>)}</ol></nav>;
}

export function Tabs({ labels }: { labels: string[] }) {
  const [active, setActive] = useState(0);
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") setActive((active + 1) % labels.length);
    if (event.key === "ArrowLeft") setActive((active - 1 + labels.length) % labels.length);
  };
  return <div><div className="tabs" role="tablist" aria-label="Beispielansichten" onKeyDown={onKey}>{labels.map((label, index) => <button key={label} role="tab" aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)}>{label}</button>)}</div><div className="tab-panel" role="tabpanel">Ansicht: {labels[active]}</div></div>;
}

export type PlanningState = "closed" | "open" | "started" | "completed" | "notice";
export function PlanningSection({ title, state, children, defaultOpen = false }: { title: string; state: PlanningState; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen); const id = useId();
  const labels: Record<PlanningState, string> = { closed: "Noch nicht geöffnet", open: "Geöffnet", started: "Begonnen", completed: "Abgeschlossen", notice: "Hinweis vorhanden" };
  return <section className={`planning planning--${state}`}><h3><button aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}><span>{title}<small>{labels[state]}</small></span><ChevronDown aria-hidden="true" /></button></h3>{open && <div id={id} className="planning__content">{children}</div>}</section>;
}

export function SegmentedControl({ options }: { options: string[] }) {
  const [value, setValue] = useState(options[0]);
  return <fieldset className="segmented"><legend className="sr-only">Darstellung wählen</legend>{options.map((option) => <label key={option}><input type="radio" name="segment" value={option} checked={value === option} onChange={() => setValue(option)} /><span>{option}</span></label>)}</fieldset>;
}

export function Menu() {
  const [open, setOpen] = useState(false);
  return <div className="menu"><IconButton label="Weitere Aktionen" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}><MoreHorizontal aria-hidden="true" /></IconButton>{open && <div role="menu" className="menu__panel"><button role="menuitem">Duplizieren</button><button role="menuitem">Archivieren</button></div>}</div>;
}

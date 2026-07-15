import type { ReactNode } from "react";
import { BookOpen, CalendarDays, ChevronLeft, ChevronRight, LayoutGrid, Menu as MenuIcon, Settings } from "lucide-react";
import { Button, IconButton } from "./actions";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <header className="page-header"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{description}</p></div>{action}</header>;
}
export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="section-header"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>;
}
export function PrototypeCardGrid({ children }: { children: ReactNode }) { return <div className="prototype-grid">{children}</div>; }

export function AppFramePrototype({ collapsed, onToggle, onOpenDrawer, children }: { collapsed: boolean; onToggle: () => void; onOpenDrawer: () => void; children: ReactNode }) {
  const links = [{ label: "Übersicht", icon: LayoutGrid }, { label: "Planung", icon: CalendarDays }, { label: "Material", icon: BookOpen }];
  return <div className={`app-frame ${collapsed ? "app-frame--collapsed" : ""}`}>
    <aside className="side-nav" aria-label="Prototyp-Navigation"><div className="brand"><span aria-hidden="true">LK</span>{!collapsed && <strong>LehrerKompass</strong>}</div><nav>{links.map(({ label, icon: Icon }, i) => <a key={label} href={`#${label.toLowerCase()}`} aria-current={i === 0 ? "page" : undefined}><Icon aria-hidden="true" /><span>{label}</span></a>)}</nav><button className="nav-toggle" onClick={onToggle} aria-label={collapsed ? "Navigation ausklappen" : "Navigation einklappen"}>{collapsed ? <ChevronRight aria-hidden="true" /> : <ChevronLeft aria-hidden="true" />}<span>{collapsed ? "" : "Einklappen"}</span></button></aside>
    <div className="app-shell"><div className="topbar"><IconButton className="mobile-nav" label="Navigation öffnen"><MenuIcon aria-hidden="true" /></IconButton><span>Klasse 2 · Deutsch</span><div><IconButton label="Einstellungen"><Settings aria-hidden="true" /></IconButton><Button variant="secondary" onClick={onOpenDrawer}>Seitenbereich</Button></div></div><main>{children}</main></div>
  </div>;
}

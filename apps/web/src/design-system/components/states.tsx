import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Cloud, CloudOff, FileQuestion, LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "./actions";

export type SyncState = "local" | "saving" | "server" | "pending" | "offline" | "conflict" | "error";
const syncText: Record<SyncState, string> = { local: "Lokal gespeichert", saving: "Speichert …", server: "Im privaten Testordner gespeichert", pending: "Speichern steht aus", offline: "Offline – lokal gesichert", conflict: "Abgleich erforderlich", error: "Speichern nicht möglich" };
export function SyncIndicator({ state }: { state: SyncState }) {
  const Icon = state === "saving" || state === "pending" ? RefreshCw : state === "offline" || state === "error" ? CloudOff : Cloud;
  return <span className={`sync sync--${state}`} role="status"><Icon aria-hidden="true" size={17} className={state === "saving" ? "spin" : ""} />{syncText[state]}</span>;
}
export function ProgressSummary({ completed, total, label }: { completed: number; total: number; label: string }) {
  return <div className="progress-summary"><CheckCircle2 aria-hidden="true" /><div><strong>{completed} von {total} Bereichen vorbereitet</strong><span>{label}</span></div></div>;
}
export function EmptyState({ title = "Noch kein Material", description = "Hier erscheinen später vorbereitete Materialien. Dieser Prototyp legt keine Fachdaten an.", children = <Button variant="secondary">Beispiel ansehen</Button> }: { title?: string; description?: string; children?: ReactNode }) { return <div className="state-card"><FileQuestion aria-hidden="true" /><h3>{title}</h3><p>{description}</p>{children}</div>; }
export function LoadingState() { return <div className="state-card" role="status" aria-live="polite"><LoaderCircle aria-hidden="true" className="spin" /><h3>Ansicht wird vorbereitet</h3><p>Einen ruhigen Moment bitte.</p></div>; }
export function ErrorState() { return <div className="state-card state-card--error" role="alert"><AlertTriangle aria-hidden="true" /><h3>Ansicht konnte nicht geladen werden</h3><p>Die lokalen Daten bleiben erhalten. Versuche es erneut.</p><Button variant="secondary">Erneut versuchen</Button></div>; }
export function StateGroup({ children }: { children: ReactNode }) { return <div className="state-grid">{children}</div>; }

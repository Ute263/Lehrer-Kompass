import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button, IconButton } from "./actions";

function useModalFocus(open: boolean, onClose: () => void, container: React.RefObject<HTMLElement | null>) {
  const returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    const root = container.current;
    const focusable = () => Array.from(root?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? []).filter((item) => !item.hasAttribute("disabled"));
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key === "Tab") {
        const items = focusable(); const first = items[0]; const last = items.at(-1);
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); returnFocus.current?.focus(); };
  }, [open, onClose, container]);
}

export function Dialog({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null); useModalFocus(open, onClose, ref);
  if (!open) return null;
  return <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={ref} className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="overlay__header"><h2 id="dialog-title">{title}</h2><IconButton label="Dialog schließen" onClick={onClose}><X aria-hidden="true" /></IconButton></div>
      <div>{children}</div><div className="overlay__actions"><Button variant="secondary" onClick={onClose}>Abbrechen</Button><Button onClick={onClose}>Übernehmen</Button></div>
    </div>
  </div>;
}

export function Drawer({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null); useModalFocus(open, onClose, ref);
  if (!open) return null;
  return <div className="drawer-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside ref={ref} className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div className="overlay__header"><h2 id="drawer-title">{title}</h2><IconButton label="Seitenbereich schließen" onClick={onClose}><X aria-hidden="true" /></IconButton></div>{children}
    </aside>
  </div>;
}

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Library, Menu, PanelLeftClose, PanelLeftOpen, Search, UserRound, X } from "lucide-react";
import { NavLink, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { Breadcrumbs, Button, Drawer, IconButton, Notice, SyncIndicator, Tooltip, type SyncState } from "../design-system/components";
import { breadcrumbsForPath } from "./breadcrumbs";
import { MAIN_NAVIGATION } from "./navigation";
import { readNavigationCollapsed, writeNavigationCollapsed } from "./storage";
import "./app-shell.css";
import { BuddyPanel } from "../features/buddy/BuddyPanel";
import { PwaNotices } from "../features/local-app/PwaNotices";

type DrawerType = "buddy" | "library" | null;
const syncStates = new Set<SyncState>(["local", "saving", "server", "pending", "offline", "conflict", "error"]);

function NavigationLinks({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return <nav className="main-navigation__links" aria-label="Hauptnavigation">{MAIN_NAVIGATION.map(({ label, path, icon: Icon }) => {
    const link = <NavLink to={path} onClick={onNavigate} title={collapsed ? label : undefined}><Icon aria-hidden="true" /><span>{label}</span></NavLink>;
    return collapsed ? <Tooltip key={path} text={label}>{link}</Tooltip> : <span key={path}>{link}</span>;
  })}</nav>;
}

export function AppShell() {
  const location = useLocation(); const [params] = useSearchParams();
  const initialCollapsed = params.get("nav") === "collapsed" || (params.get("nav") !== "expanded" && readNavigationCollapsed());
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const initialDrawer = params.get("drawer");
  const [drawer, setDrawer] = useState<DrawerType>(initialDrawer === "buddy" || initialDrawer === "library" ? initialDrawer : null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const mobileReturnFocus = useRef<HTMLElement | null>(null);
  const requestedSync = params.get("sync") as SyncState | null;
  const syncState: SyncState = requestedSync && syncStates.has(requestedSync) ? requestedSync : "local";
  const closeDrawer = useCallback(() => setDrawer(null), []);

  useEffect(() => setMobileOpen(false), [location.pathname]);
  useEffect(() => {
    if (!mobileOpen) return;
    mobileReturnFocus.current = document.activeElement as HTMLElement;
    mobileNavRef.current?.querySelector<HTMLElement>("button")?.focus();
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); setMobileOpen(false); } };
    document.addEventListener("keydown", handleEscape);
    return () => { document.removeEventListener("keydown", handleEscape); mobileReturnFocus.current?.focus(); };
  }, [mobileOpen]);
  const toggleNavigation = () => { const next = !collapsed; setCollapsed(next); writeNavigationCollapsed(next); };
  const drawerTitle = drawer === "buddy" ? "Buddy" : "Bibliothek";

  return <div className={`application-frame ${collapsed ? "application-frame--collapsed" : ""}`}>
    <a className="skip-link" href="#main-content" onClick={() => mainRef.current?.focus()}>Zum Hauptinhalt</a>
    <aside className="main-navigation" aria-label="LehrerKompass">
      <div className="app-brand"><span aria-hidden="true">LK</span><span className="app-brand__text"><strong>LehrerKompass</strong><small>The Quiet Workspace</small></span></div>
      <NavigationLinks collapsed={collapsed} />
      <div className="profile-summary"><span className="profile-summary__avatar" aria-hidden="true">U</span><span><strong>Mein Arbeitsplatz</strong><small>Persönlicher Bereich</small></span></div>
    </aside>

    <div className="application-content">
      <header className="application-topbar">
        <div className="topbar-leading"><IconButton className="desktop-navigation-toggle" label={collapsed ? "Navigation ausklappen" : "Navigation einklappen"} onClick={toggleNavigation}>{collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}</IconButton><IconButton className="mobile-navigation-toggle" label="Mobile Navigation öffnen" onClick={() => setMobileOpen(true)}><Menu aria-hidden="true" /></IconButton><Breadcrumbs items={breadcrumbsForPath(location.pathname)} /></div>
        <div className="topbar-actions"><IconButton label="Globale Suche – noch nicht aktiv" disabled><Search aria-hidden="true" /></IconButton><Button variant="ghost" onClick={() => setDrawer("library")}><Library aria-hidden="true" size={18} />Bibliothek</Button><Button variant="ghost" onClick={() => setDrawer("buddy")}><Bot aria-hidden="true" size={18} />Buddy</Button><SyncIndicator state={syncState} /><span className="topbar-profile"><UserRound aria-hidden="true" /><span>Mein Arbeitsplatz</span></span></div>
      </header>
      <PwaNotices /><main id="main-content" ref={mainRef} tabIndex={-1}><Outlet /></main>
    </div>

    {mobileOpen && <div className="mobile-navigation-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setMobileOpen(false); }}><aside ref={mobileNavRef} className="mobile-navigation" aria-label="Mobile Hauptnavigation"><div className="overlay__header"><div className="app-brand"><span aria-hidden="true">LK</span><span className="app-brand__text"><strong>LehrerKompass</strong><small>The Quiet Workspace</small></span></div><IconButton label="Mobile Navigation schließen" onClick={() => setMobileOpen(false)}><X aria-hidden="true" /></IconButton></div><NavigationLinks collapsed={false} onNavigate={() => setMobileOpen(false)} /></aside></div>}

    <Drawer open={drawer !== null} title={drawerTitle} onClose={closeDrawer}>{drawer === "buddy" ? <BuddyPanel pathname={location.pathname}/> : <><p>Hier erscheinen später passende Materialien zum aktuellen Arbeitskontext.</p><Notice variant="info" title="Platzhalter">Noch keine Bibliothekssuche aktiv.</Notice></>}</Drawer>
  </div>;
}

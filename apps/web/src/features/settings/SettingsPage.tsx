import { useEffect, useState } from "react";
import { AppWindow, Database, Download, Info, MonitorSmartphone, Palette, RotateCcw, ShieldCheck, SlidersHorizontal, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Card, Notice, SelectField, Switch } from "../../design-system/components";
import { domainDb } from "../../domain/database";
import "./settings.css";

const KEY="lehrerkompass-settings-v1";
type Settings={startPage:string;compact:boolean;largerText:boolean;reducedMotion:boolean;theme:"light"|"system";accent:"quiet"|"blue"|"green"};
const defaults:Settings={startPage:"/werkbank",compact:false,largerText:false,reducedMotion:false,theme:"light",accent:"quiet"};
function read():Settings{try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)??"{}")}}catch{return defaults}}
function apply(settings:Settings){document.documentElement.dataset.theme=settings.theme;document.documentElement.dataset.accent=settings.accent;document.documentElement.classList.toggle("app-compact",settings.compact);document.documentElement.classList.toggle("app-large-text",settings.largerText);document.documentElement.classList.toggle("app-reduced-motion",settings.reducedMotion)}

export function SettingsPage(){
 const [settings,setSettings]=useState<Settings>(read);const [saved,setSaved]=useState(false);const [counts,setCounts]=useState({classes:0,series:0,lessons:0,materials:0});
 useEffect(()=>{apply(settings);localStorage.setItem(KEY,JSON.stringify(settings));setSaved(true);const t=setTimeout(()=>setSaved(false),1200);return()=>clearTimeout(t)},[settings]);
 useEffect(()=>{void(async()=>setCounts({classes:await domainDb.classes.count(),series:await domainDb.seriesImplementations.count(),lessons:await domainDb.lessons.count(),materials:await domainDb.materials.count()}))()},[]);
 const patch=<K extends keyof Settings>(key:K,value:Settings[K])=>setSettings(current=>({...current,[key]:value}));
 return <div className="settings-page">
  <header className="settings-header"><div><p className="eyebrow">Mein Arbeitsplatz</p><h1>Einstellungen</h1><p>Lege fest, wie der LehrerKompass startet, aussieht und deine lokalen Daten verwaltet.</p></div>{saved&&<span className="settings-saved">Gespeichert</span>}</header>
  <div className="settings-grid">
   <section className="settings-main">
    <Card><div className="settings-card-title"><SlidersHorizontal/><div><h2>Allgemein</h2><p>Start und Arbeitsweise</p></div></div><SelectField id="start-page" label="Startseite" value={settings.startPage} onChange={e=>patch("startPage",e.target.value)}><option value="/werkbank">Werkbank</option><option value="/stundenplan">Stundenplan</option><option value="/bibliothek">Bibliothek</option><option value="/foerderunterricht">Förderunterricht</option></SelectField><Switch id="compact" label="Kompaktere Darstellung verwenden" checked={settings.compact} onChange={e=>patch("compact",e.target.checked)}/></Card>
    <Card><div className="settings-card-title"><Palette/><div><h2>Darstellung</h2><p>Lesbarkeit und Ruhe</p></div></div><div className="settings-two"><SelectField id="theme" label="Erscheinungsbild" value={settings.theme} onChange={e=>patch("theme",e.target.value as Settings["theme"])}><option value="light">Hell</option><option value="system">Systemeinstellung</option></SelectField><SelectField id="accent" label="Akzent" value={settings.accent} onChange={e=>patch("accent",e.target.value as Settings["accent"])}><option value="quiet">Ruhiges Türkis</option><option value="blue">Blau</option><option value="green">Grün</option></SelectField></div><Switch id="large-text" label="Größere Schrift verwenden" checked={settings.largerText} onChange={e=>patch("largerText",e.target.checked)}/><Switch id="reduced-motion" label="Bewegungen reduzieren" checked={settings.reducedMotion} onChange={e=>patch("reducedMotion",e.target.checked)}/></Card>
    <Card><div className="settings-card-title"><ShieldCheck/><div><h2>Daten und Sicherung</h2><p>Alles bleibt lokal auf diesem Gerät</p></div></div><div className="settings-links"><Link to="/einstellungen/sicherung"><Download/>Sicherung erstellen</Link><Link to="/einstellungen/import"><Upload/>Sicherung wiederherstellen</Link><Link to="/einstellungen/austausch"><AppWindow/>Reihen und Materialien austauschen</Link><Link to="/einstellungen/daten"><Database/>Datenübersicht und Zurücksetzen</Link><Link to="/einstellungen/installation"><MonitorSmartphone/>Installation auf dem iPad</Link></div></Card>
   </section>
   <aside className="settings-aside">
    <Card><div className="settings-card-title"><Database/><div><h2>Deine Daten</h2><p>Lokaler Bestand</p></div></div><dl className="settings-counts"><div><dt>Klassen</dt><dd>{counts.classes}</dd></div><div><dt>Unterrichtsreihen</dt><dd>{counts.series}</dd></div><div><dt>Unterrichtsstunden</dt><dd>{counts.lessons}</dd></div><div><dt>Materialien</dt><dd>{counts.materials}</dd></div></dl></Card>
    <Card><div className="settings-card-title"><Info/><div><h2>Über den LehrerKompass</h2><p>Version 1.0 – Arbeitsstand Paket 18</p></div></div><p>Werkzeug für Unterrichtsplanung, Materialien und Förderunterricht.</p><p>© Ute Holzschneider-Riedl</p></Card>
    <Notice variant="info" title="Datenschutz">Der LehrerKompass arbeitet weiterhin lokal. Es werden keine Schülernamen oder persönlichen Daten automatisch übertragen.</Notice>
    <Button variant="secondary" onClick={()=>{setSettings(defaults);apply(defaults)}}><RotateCcw/>Darstellung zurücksetzen</Button>
   </aside>
  </div>
 </div>;
}

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Clock3, FileText, Plus, Search, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, Notice } from "../../design-system/components";
import { domainDb } from "../../domain/database";
import { MATERIAL_STATUS_LABELS, type Material } from "../../domain/material-model";
import "./library.css";

const FAVOURITES_KEY = "lehrerkompass-library-favourites";
const RECENT_KEY = "lehrerkompass-library-recent";

type LibraryRow = Material & { subjectLabel?: string; topicLabel?: string; classLabel?: string };

function readIds(key: string): string[] {
  try { return JSON.parse(localStorage.getItem(key) ?? "[]") as string[]; } catch { return []; }
}
function writeIds(key: string, ids: string[]) { localStorage.setItem(key, JSON.stringify(ids)); }

export function LibraryPage() {
  const [rows, setRows] = useState<LibraryRow[]>([]);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [topic, setTopic] = useState("all");
  const [view, setView] = useState<"all" | "favourites" | "recent">("all");
  const [favourites, setFavourites] = useState<string[]>(() => readIds(FAVOURITES_KEY));
  const [recent, setRecent] = useState<string[]>(() => readIds(RECENT_KEY));

  useEffect(() => {
    void (async () => {
      const [materials, subjects, topics, classes] = await Promise.all([
        domainDb.materials.toArray(), domainDb.subjects.toArray(), domainDb.topics.toArray(), domainDb.classes.toArray(),
      ]);
      const subjectMap = new Map(subjects.map(v => [v.id, v.label]));
      const topicMap = new Map(topics.map(v => [v.id, v.title]));
      const classMap = new Map(classes.map(v => [v.id, v.label]));
      setRows(materials.filter(v => !v.archivedAt).map(v => ({ ...v, subjectLabel: v.subjectId ? subjectMap.get(v.subjectId) : undefined, topicLabel: v.topicId ? topicMap.get(v.topicId) : undefined, classLabel: v.classId ? classMap.get(v.classId) : undefined })));
    })();
  }, []);

  const subjects = useMemo(() => Array.from(new Set(rows.map(v => v.subjectLabel).filter(Boolean) as string[])).sort(), [rows]);
  const topics = useMemo(() => Array.from(new Set(rows.filter(v => subject === "all" || v.subjectLabel === subject).map(v => v.topicLabel).filter(Boolean) as string[])).sort(), [rows, subject]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("de-DE");
    return rows.filter(row => {
      if (view === "favourites" && !favourites.includes(row.id)) return false;
      if (view === "recent" && !recent.includes(row.id)) return false;
      if (subject !== "all" && row.subjectLabel !== subject) return false;
      if (topic !== "all" && row.topicLabel !== topic) return false;
      if (normalized && ![row.title, row.description, row.subjectLabel, row.topicLabel, row.classLabel, row.targetGroup].filter(Boolean).join(" ").toLocaleLowerCase("de-DE").includes(normalized)) return false;
      return true;
    }).sort((a, b) => view === "recent" ? recent.indexOf(a.id) - recent.indexOf(b.id) : a.title.localeCompare(b.title, "de"));
  }, [rows, query, subject, topic, view, favourites, recent]);

  const toggleFavourite = (id: string) => {
    setFavourites(current => { const next = current.includes(id) ? current.filter(v => v !== id) : [id, ...current]; writeIds(FAVOURITES_KEY, next); return next; });
  };
  const remember = (id: string) => {
    setRecent(current => { const next = [id, ...current.filter(v => v !== id)].slice(0, 12); writeIds(RECENT_KEY, next); return next; });
  };

  return <div className="library-page">
    <header className="library-header">
      <div><p className="eyebrow">Materialsammlung</p><h1>Bibliothek</h1><p>Finde deine Materialien schnell wieder und öffne sie direkt zur Bearbeitung oder Vorschau.</p></div>
      <Link className="library-new" to="/materialien/neu"><Plus aria-hidden="true" /> Neues Material</Link>
    </header>

    <section className="library-toolbar" aria-label="Bibliothek durchsuchen und filtern">
      <label className="library-search"><Search aria-hidden="true" /><span className="sr-only">Material suchen</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Material, Fach oder Thema suchen …" /></label>
      <select aria-label="Nach Fach filtern" value={subject} onChange={e => { setSubject(e.target.value); setTopic("all"); }}><option value="all">Alle Fächer</option>{subjects.map(v => <option key={v}>{v}</option>)}</select>
      <select aria-label="Nach Thema filtern" value={topic} onChange={e => setTopic(e.target.value)}><option value="all">Alle Themen</option>{topics.map(v => <option key={v}>{v}</option>)}</select>
    </section>

    <div className="library-view-tabs" role="group" aria-label="Bibliotheksansicht">
      <Button variant={view === "all" ? "secondary" : "ghost"} onClick={() => setView("all")}><BookOpen aria-hidden="true" /> Alle</Button>
      <Button variant={view === "favourites" ? "secondary" : "ghost"} onClick={() => setView("favourites")}><Star aria-hidden="true" /> Favoriten</Button>
      <Button variant={view === "recent" ? "secondary" : "ghost"} onClick={() => setView("recent")}><Clock3 aria-hidden="true" /> Zuletzt verwendet</Button>
    </div>

    {filtered.length === 0 ? <Notice variant="info" title="Keine passenden Materialien">Ändere die Suche oder die Filter. Neue Materialien kannst du direkt in der Materialwerkstatt anlegen.</Notice> : <section className="library-grid" aria-label="Materialien">
      {filtered.map(row => <Card key={row.id} className="library-card">
        <div className="library-card__preview" aria-hidden="true"><FileText /></div>
        <div className="library-card__top"><Badge tone="info">{row.subjectLabel ?? "Ohne Fach"}</Badge><button className="library-favourite" type="button" aria-label={favourites.includes(row.id) ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"} aria-pressed={favourites.includes(row.id)} onClick={() => toggleFavourite(row.id)}><Star fill={favourites.includes(row.id) ? "currentColor" : "none"} /></button></div>
        <h2>{row.title}</h2>
        <p>{row.description ?? row.topicLabel ?? "Eigenes LehrerKompass-Material"}</p>
        <dl><div><dt>Thema</dt><dd>{row.topicLabel ?? "–"}</dd></div><div><dt>Status</dt><dd>{MATERIAL_STATUS_LABELS[row.status]}</dd></div>{row.classLabel && <div><dt>Klasse</dt><dd>{row.classLabel}</dd></div>}</dl>
        <div className="library-card__actions"><Link to={`/materialien/${row.id}/vorschau`} onClick={() => remember(row.id)}>Vorschau</Link><Link to={`/materialien/${row.id}`} onClick={() => remember(row.id)}>Bearbeiten</Link></div>
      </Card>)}
    </section>}
  </div>;
}

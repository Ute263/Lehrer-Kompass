import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, FolderOpen, Plus, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createTopic, readTopics } from "./topicStore";
import "./topic-center.css";

const SUBJECTS = ["Deutsch", "Mathematik", "Sachunterricht", "Kunst", "Musik", "Religion", "Förderunterricht"];

export function TopicsOverviewPage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState(readTopics);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "Sachunterricht", classLevel: "2", schoolYear: "2026/27", description: "", lessonCount: 5 });
  useEffect(() => { const refresh = () => setTopics(readTopics()); window.addEventListener("lehrerkompass:topics", refresh); return () => window.removeEventListener("lehrerkompass:topics", refresh); }, []);
  const visible = useMemo(() => topics.filter((topic) => `${topic.title} ${topic.subject} ${topic.classLevel}`.toLowerCase().includes(query.toLowerCase())), [topics, query]);
  const grouped = useMemo(() => SUBJECTS.map((subject) => ({ subject, topics: visible.filter((topic) => topic.subject === subject) })).filter((group) => group.topics.length), [visible]);
  const recent = [...topics].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const submit = () => { if (!form.title.trim()) return; const topic = createTopic(form); navigate(`/themen/${topic.id}`); };

  return <div className="planner-shell">
    <header className="planner-cover"><div><p>LehrerKompass</p><h1>Mein Unterricht</h1><span>Schuljahr {form.schoolYear}</span></div><button className="planner-primary" onClick={() => setShowForm(true)}><Plus />Neues Thema</button></header>
    <nav className="planner-tabs" aria-label="Unterrichtsbereiche"><Link className="active" to="/themen"><BookOpen />Themen</Link><Link to="/stundenplan"><CalendarDays />Schultag</Link><Link to="/bibliothek"><FolderOpen />Materialien</Link></nav>
    {recent && <Link className="planner-recent" to={`/themen/${recent.id}`}><div><span>Zuletzt bearbeitet</span><strong>{recent.title}</strong><small>{recent.subject} · Klasse {recent.classLevel} · {recent.lessons.length} Stunden</small></div><ArrowRight /></Link>}
    {showForm && <section className="planner-dialog"><div className="planner-dialog__heading"><div><p>Neues Oberthema</p><h2>Was möchtest du planen?</h2></div><button onClick={() => setShowForm(false)}>Schließen</button></div><div className="planner-form-grid"><label>Thema<input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="z. B. Klassensprecher" /></label><label>Fach<select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>{SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}</select></label><label>Klasse<input value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: e.target.value })} /></label><label>Stunden<input type="number" min={1} max={30} value={form.lessonCount} onChange={(e) => setForm({ ...form, lessonCount: Number(e.target.value) || 1 })} /></label></div><label>Worum geht es? <span>optional</span><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><div className="planner-actions"><button className="planner-secondary" onClick={() => setShowForm(false)}>Abbrechen</button><button className="planner-primary" onClick={submit}>Thema anlegen <ArrowRight /></button></div></section>}
    <div className="planner-search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Thema, Fach oder Klasse suchen" /></div>
    {grouped.length ? <main className="subject-shelves">{grouped.map((group) => <section className="subject-shelf" key={group.subject}><header><h2>{group.subject}</h2><span>{group.topics.length} {group.topics.length === 1 ? "Thema" : "Themen"}</span></header><div>{group.topics.map((topic) => <Link className="topic-line" key={topic.id} to={`/themen/${topic.id}`}><span className="topic-line__mark" aria-hidden="true" /><div><strong>{topic.title}</strong><small>Klasse {topic.classLevel} · {topic.lessons.length} Stunden · {topic.materials.length} Materialien</small></div><ArrowRight /></Link>)}</div></section>)}</main> : <section className="planner-empty"><FolderOpen /><h2>Noch kein Unterrichtsthema</h2><p>Lege dein erstes Thema an. Stunden, Planung und Materialien bleiben anschließend direkt miteinander verbunden.</p><button className="planner-primary" onClick={() => setShowForm(true)}><Plus />Erstes Thema anlegen</button></section>}
  </div>;
}

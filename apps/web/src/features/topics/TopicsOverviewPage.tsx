import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, FolderOpen, Plus, Search } from "lucide-react";
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
  const submit = () => { if (!form.title.trim()) return; const topic = createTopic(form); navigate(`/themen/${topic.id}`); };
  return <div className="topic-center">
    <header className="topic-hero"><div><p>Dein Unterricht</p><h1>Woran möchtest du arbeiten?</h1><span>Planung, Stunden und Materialien bleiben an einem Ort verbunden.</span></div><button className="topic-primary" onClick={() => setShowForm(!showForm)}><Plus />Neues Thema</button></header>
    {showForm && <section className="topic-form-card"><h2>Neues Thema beginnen</h2><div className="topic-form-grid"><label>Thema<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="z. B. Klassensprecher" /></label><label>Fach<select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>{SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}</select></label><label>Klasse<input value={form.classLevel} onChange={(e) => setForm({ ...form, classLevel: e.target.value })} /></label><label>Schuljahr<input value={form.schoolYear} onChange={(e) => setForm({ ...form, schoolYear: e.target.value })} /></label><label>Stunden<input type="number" min={1} max={30} value={form.lessonCount} onChange={(e) => setForm({ ...form, lessonCount: Number(e.target.value) || 1 })} /></label></div><label>Kurze Notiz<textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><div className="topic-actions"><button className="topic-secondary" onClick={() => setShowForm(false)}>Abbrechen</button><button className="topic-primary" onClick={submit}>Thema anlegen <ArrowRight /></button></div></section>}
    <div className="topic-search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Themen, Fächer oder Klassen suchen" /></div>
    {visible.length ? <section className="topic-grid">{visible.map((topic) => <Link className="topic-card" key={topic.id} to={`/themen/${topic.id}`}><div className="topic-card__icon"><BookOpen /></div><div><p>{topic.subject} · Klasse {topic.classLevel}</p><h2>{topic.title}</h2><span>{topic.lessons.length} Stunden · {topic.materials.length} Materialien · {topic.tasks.filter((task) => !task.done).length} offen</span></div><ArrowRight /></Link>)}</section> : <section className="topic-empty"><FolderOpen /><h2>Noch kein Thema angelegt</h2><p>Beginne mit einem Thema. Dort werden Planung, Stunden und Materialien automatisch zusammengeführt.</p><button className="topic-primary" onClick={() => setShowForm(true)}><Plus />Erstes Thema anlegen</button></section>}
  </div>;
}

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, Plus, Search } from "lucide-react";
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
  const submit = () => { if (!form.title.trim()) return; const topic = createTopic(form); navigate(`/themen/${topic.id}`); };

  return <div className="planner-portrait">
    <aside className="planner-tabs" aria-label="Planerregister">
      <Link className="active" to="/themen">Übersicht</Link>
      <Link to="/stundenplan">Kalender</Link>
      <Link to="/bibliothek">Material</Link>
    </aside>

    <main className="planner-page">
      <header className="planner-page__header">
        <div><p>LehrerKompass</p><h1>Mein Unterricht</h1><span>Schuljahr {form.schoolYear}</span></div>
        <button className="planner-round-action" onClick={() => setShowForm(!showForm)} aria-label="Neues Thema anlegen"><Plus /></button>
      </header>

      <section className="planner-welcome">
        <CalendarDays />
        <div><strong>Dein digitaler Unterrichtsplaner</strong><p>Themen, Stunden und Materialien liegen wie in einem Planer direkt beieinander.</p></div>
      </section>

      {showForm && <section className="planner-insert">
        <h2>Neues Unterrichtsthema</h2>
        <div className="planner-form-grid">
          <label>Thema<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="z. B. Klassensprecher" /></label>
          <label>Fach<select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })}>{SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}</select></label>
          <label>Klasse<input value={form.classLevel} onChange={(event) => setForm({ ...form, classLevel: event.target.value })} /></label>
          <label>Stunden<input type="number" min={1} max={24} value={form.lessonCount} onChange={(event) => setForm({ ...form, lessonCount: Number(event.target.value) || 1 })} /></label>
        </div>
        <label>Notiz<textarea rows={2} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Was ist dir bei dieser Reihe wichtig?" /></label>
        <div className="planner-actions"><button onClick={() => setShowForm(false)}>Abbrechen</button><button className="primary" onClick={submit}>Thema anlegen <ArrowRight /></button></div>
      </section>}

      <div className="planner-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Themen durchsuchen" /></div>

      {grouped.length ? <div className="planner-subjects">{grouped.map((group) => <section key={group.subject}>
        <h2>{group.subject}</h2>
        <div className="planner-topic-list">{group.topics.map((topic) => <Link key={topic.id} to={`/themen/${topic.id}`}>
          <span className="planner-topic-number"><BookOpen /></span>
          <div><strong>{topic.title}</strong><small>Klasse {topic.classLevel} · {topic.lessons.length} Stunden · {topic.materials.length} Materialien</small></div>
          <ArrowRight />
        </Link>)}</div>
      </section>)}</div> : <section className="planner-empty"><BookOpen /><h2>Dein Planer ist noch leer</h2><p>Lege dein erstes Unterrichtsthema an. Danach erscheinen die einzelnen Stunden wie Seiten in einem Planungsheft.</p><button className="primary" onClick={() => setShowForm(true)}><Plus />Erstes Thema anlegen</button></section>}
    </main>
  </div>;
}

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckSquare, FileText, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { addMaterial, addTask, readTopics, updateTopic, type TopicRecord } from "./topicStore";
import "./topic-center.css";

export function TopicDetailPage() {
  const { topicId } = useParams();
  const [topic, setTopic] = useState<TopicRecord | null>(() => readTopics().find((item) => item.id === topicId) || null);
  const [materialTitle, setMaterialTitle] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [task, setTask] = useState("");
  if (!topic) return <div className="planner-portrait"><main className="planner-page"><Link to="/themen"><ArrowLeft />Zur Übersicht</Link><p>Thema nicht gefunden.</p></main></div>;
  const save = (next: TopicRecord) => { setTopic(next); updateTopic(next); };

  return <div className="planner-portrait">
    <aside className="planner-tabs" aria-label="Planerregister">
      <Link to="/themen">Übersicht</Link>
      <span className="active">Reihe</span>
      <Link to="/bibliothek">Material</Link>
    </aside>

    <main className="planner-page">
      <header className="chapter-header">
        <Link to="/themen"><ArrowLeft />Mein Unterricht</Link>
        <p>{topic.subject} · Klasse {topic.classLevel}</p>
        <h1>{topic.title}</h1>
        <textarea rows={2} value={topic.description} onChange={(event) => save({ ...topic, description: event.target.value })} placeholder="Kurze Beschreibung oder Ziel der Reihe" />
      </header>

      <section className="chapter-meta">
        <span>{topic.lessons.length} Unterrichtsstunden</span><span>{topic.materials.length} Materialien</span><span>{topic.tasks.filter((item) => !item.done).length} Vorbereitungen offen</span>
      </section>

      <section className="planner-sheet-section">
        <div className="sheet-heading"><div><small>Kapitelübersicht</small><h2>Unterrichtsstunden</h2></div></div>
        <div className="chapter-lessons">{topic.lessons.map((lesson, index) => {
          const materialCount = topic.materials.filter((material) => material.lessonId === lesson.id).length;
          return <Link key={lesson.id} to={`/themen/${topic.id}/stunden/${lesson.id}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><strong>{lesson.title}</strong><p>{lesson.objective || lesson.focus || "Lernziel und Ablauf noch offen"}</p><small>{materialCount ? `${materialCount} Materialien verbunden` : "Noch kein Material"}</small></div>
            <ArrowRight />
          </Link>;
        })}</div>
      </section>

      <section className="planner-sheet-section two-column-sheet">
        <div>
          <div className="sheet-heading"><div><small>Sammlung</small><h2>Materialien</h2></div><FileText /></div>
          <div className="inline-add"><input value={materialTitle} onChange={(event) => setMaterialTitle(event.target.value)} placeholder="Materialtitel" /><select value={lessonId} onChange={(event) => setLessonId(event.target.value)}><option value="">Für die ganze Reihe</option>{topic.lessons.map((lesson, index) => <option key={lesson.id} value={lesson.id}>Stunde {index + 1}</option>)}</select><button onClick={() => { if (materialTitle.trim()) { setTopic(addMaterial(topic, materialTitle, "Arbeitsblatt", lessonId)); setMaterialTitle(""); } }}><Plus /></button></div>
          <div className="lined-list">{topic.materials.map((material) => <div key={material.id}><span>{material.kind}</span><strong>{material.title}</strong></div>)}</div>
        </div>
        <div>
          <div className="sheet-heading"><div><small>Erinnerungen</small><h2>Vorbereitung</h2></div><CheckSquare /></div>
          <div className="inline-add"><input value={task} onChange={(event) => setTask(event.target.value)} placeholder="z. B. Wahlzettel drucken" /><button onClick={() => { if (task.trim()) { setTopic(addTask(topic, task)); setTask(""); } }}><Plus /></button></div>
          <div className="lined-list tasks">{topic.tasks.map((item) => <label key={item.id}><input type="checkbox" checked={item.done} onChange={() => save({ ...topic, tasks: topic.tasks.map((entry) => entry.id === item.id ? { ...entry, done: !entry.done } : entry) })} /><span>{item.text}</span></label>)}</div>
        </div>
      </section>
    </main>
  </div>;
}

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, FileText, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { addMaterial, addTask, readTopics, updateTopic, type TopicRecord } from "./topicStore";
import "./topic-center.css";

export function TopicDetailPage() {
  const { topicId } = useParams();
  const [topic, setTopic] = useState<TopicRecord | null>(() => readTopics().find((item) => item.id === topicId) || null);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialKind, setMaterialKind] = useState("Arbeitsblatt");
  const [lessonId, setLessonId] = useState("");
  const [task, setTask] = useState("");
  if (!topic) return <div className="planner-shell"><Link to="/themen"><ArrowLeft />Alle Themen</Link><p>Thema nicht gefunden.</p></div>;
  const save = (next: TopicRecord) => { setTopic(next); updateTopic(next); };

  return <div className="planner-shell">
    <header className="topic-book-header">
      <Link to="/themen"><ArrowLeft />Mein Unterricht</Link>
      <div><p>{topic.subject} · Klasse {topic.classLevel}</p><h1>{topic.title}</h1><span>{topic.description || "Unterrichtsplanung und Materialien an einem Ort."}</span></div>
      <small>Schuljahr {topic.schoolYear}</small>
    </header>

    <nav className="topic-register"><a href="#stunden">Stunden</a><a href="#materialien">Materialien</a><a href="#vorbereitung">Vorbereitung</a></nav>

    <section id="stunden" className="planner-page">
      <header className="planner-page__heading"><div><p>Unterrichtsreihe</p><h2>{topic.lessons.length} Stunden im Überblick</h2></div><span>{topic.materials.length} Materialien insgesamt</span></header>
      <div className="lesson-book-list">{topic.lessons.map((lesson, index) => {
        const materials = topic.materials.filter((material) => material.lessonId === lesson.id);
        return <Link className="lesson-book-row" key={lesson.id} to={`/themen/${topic.id}/stunden/${lesson.id}`}>
          <span className="lesson-book-row__number">{index + 1}</span>
          <div><strong>{lesson.title}</strong><p>{lesson.objective || lesson.focus || "Ziel und Ablauf noch ergänzen"}</p><small>{materials.length ? `${materials.length} ${materials.length === 1 ? "Material" : "Materialien"}` : "Material fehlt noch"}</small></div>
          <ArrowRight />
        </Link>;
      })}</div>
    </section>

    <section id="materialien" className="planner-page">
      <header className="planner-page__heading"><div><p>Materialien</p><h2>Alles für diese Reihe</h2></div></header>
      <div className="material-quick-add"><input value={materialTitle} onChange={(event) => setMaterialTitle(event.target.value)} placeholder="Materialtitel" /><select value={materialKind} onChange={(event) => setMaterialKind(event.target.value)}><option>Arbeitsblatt</option><option>Lösungsblatt</option><option>Tafelbild</option><option>Spiel</option><option>Bild</option><option>Sonstiges</option></select><select value={lessonId} onChange={(event) => setLessonId(event.target.value)}><option value="">Für die ganze Reihe</option>{topic.lessons.map((lesson, index) => <option key={lesson.id} value={lesson.id}>Stunde {index + 1}</option>)}</select><button className="planner-primary" onClick={() => { if (materialTitle.trim()) { setTopic(addMaterial(topic, materialTitle, materialKind, lessonId)); setMaterialTitle(""); } }}><Plus />Hinzufügen</button></div>
      {topic.materials.length ? <div className="material-book-list">{topic.materials.map((material) => { const index = topic.lessons.findIndex((lesson) => lesson.id === material.lessonId); return <article key={material.id}><FileText /><div><span>{material.kind}</span><h3>{material.title}</h3><small>{index >= 0 ? `Stunde ${index + 1}` : "Ganze Reihe"}</small></div><em>{material.status}</em></article>; })}</div> : <p className="quiet-hint">Noch kein Material hinterlegt. Ergänze vorhandenes Material direkt hier oder später innerhalb einer Stunde.</p>}
    </section>

    <section id="vorbereitung" className="planner-page">
      <header className="planner-page__heading"><div><p>Vorbereitung</p><h2>Was muss noch erledigt werden?</h2></div></header>
      <div className="task-quick-add"><input value={task} onChange={(event) => setTask(event.target.value)} placeholder="z. B. Wahlzettel drucken" /><button className="planner-secondary" onClick={() => { if (task.trim()) { setTopic(addTask(topic, task)); setTask(""); } }}><Plus />Hinzufügen</button></div>
      <div className="preparation-list">{topic.tasks.map((item) => <button key={item.id} className={item.done ? "done" : ""} onClick={() => save({ ...topic, tasks: topic.tasks.map((entry) => entry.id === item.id ? { ...entry, done: !entry.done } : entry) })}>{item.done ? <CheckCircle2 /> : <Circle />}<span>{item.text}</span></button>)}</div>
    </section>
  </div>;
}

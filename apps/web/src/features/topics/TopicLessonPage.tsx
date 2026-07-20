import { useState } from "react";
import { ArrowLeft, FileText, Plus, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { addMaterial, readTopics, updateTopic, type TopicRecord } from "./topicStore";
import "./topic-center.css";

export function TopicLessonPage() {
  const { topicId, lessonId } = useParams();
  const [topic, setTopic] = useState<TopicRecord | null>(() => readTopics().find((item) => item.id === topicId) || null);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialKind, setMaterialKind] = useState("Arbeitsblatt");
  if (!topic) return <div className="planner-shell"><Link to="/themen"><ArrowLeft />Mein Unterricht</Link><p>Thema nicht gefunden.</p></div>;
  const lessonIndex = topic.lessons.findIndex((lesson) => lesson.id === lessonId);
  const lesson = topic.lessons[lessonIndex];
  if (!lesson) return <div className="planner-shell"><Link to={`/themen/${topic.id}`}><ArrowLeft />Zum Thema</Link><p>Stunde nicht gefunden.</p></div>;
  const saveLesson = (field: keyof typeof lesson, value: string) => {
    const next = { ...topic, lessons: topic.lessons.map((entry, index) => index === lessonIndex ? { ...entry, [field]: value } : entry) };
    setTopic(next); updateTopic(next);
  };
  const materials = topic.materials.filter((material) => material.lessonId === lesson.id);

  return <div className="planner-shell lesson-workspace">
    <header className="lesson-page-header"><Link to={`/themen/${topic.id}`}><ArrowLeft />{topic.title}</Link><div><p>Stunde {lessonIndex + 1} · {topic.subject} · Klasse {topic.classLevel}</p><input aria-label="Stundentitel" value={lesson.title} onChange={(event) => saveLesson("title", event.target.value)} /></div></header>

    <div className="lesson-page-grid">
      <main className="lesson-plan-sheet">
        <label className="lesson-objective"><span>Lernziel</span><textarea rows={3} value={lesson.objective} onChange={(event) => saveLesson("objective", event.target.value)} placeholder="Was sollen die Kinder am Ende können oder verstanden haben?" /></label>
        <section><h2>Einstieg</h2><textarea rows={4} value={lesson.opening} onChange={(event) => saveLesson("opening", event.target.value)} placeholder="Wie beginnt die Stunde?" /></section>
        <section><h2>Erarbeitung</h2><textarea rows={5} value={lesson.development} onChange={(event) => saveLesson("development", event.target.value)} placeholder="Was tun die Kinder? Wie wird gearbeitet?" /></section>
        <section><h2>Sicherung</h2><textarea rows={4} value={lesson.consolidation} onChange={(event) => saveLesson("consolidation", event.target.value)} placeholder="Wie werden Ergebnisse festgehalten?" /></section>
        <section><h2>Reflexion und Abschluss</h2><textarea rows={3} value={lesson.reflection} onChange={(event) => saveLesson("reflection", event.target.value)} placeholder="Wie endet die Stunde?" /></section>
        <section><h2>Eigene Notizen</h2><textarea rows={3} value={lesson.notes} onChange={(event) => saveLesson("notes", event.target.value)} placeholder="Differenzierung, Beobachtungen oder Erinnerung" /></section>
      </main>

      <aside className="lesson-material-panel">
        <header><div><p>Direkt verbunden</p><h2>Material für diese Stunde</h2></div><FileText /></header>
        {materials.length ? <div className="lesson-material-list">{materials.map((material) => <article key={material.id}><span>{material.kind}</span><strong>{material.title}</strong><small>{material.status}</small></article>)}</div> : <div className="lesson-material-empty"><FileText /><strong>Noch kein Material</strong><p>Füge vorhandenes Material hinzu oder lege direkt etwas Neues an.</p></div>}
        <div className="lesson-material-add"><input value={materialTitle} onChange={(event) => setMaterialTitle(event.target.value)} placeholder="Materialtitel" /><select value={materialKind} onChange={(event) => setMaterialKind(event.target.value)}><option>Arbeitsblatt</option><option>Lösungsblatt</option><option>Tafelbild</option><option>Spiel</option><option>Bild</option><option>Sonstiges</option></select><button className="planner-primary" onClick={() => { if (materialTitle.trim()) { setTopic(addMaterial(topic, materialTitle, materialKind, lesson.id)); setMaterialTitle(""); } }}><Plus />Material hinzufügen</button></div>
        <button className="lesson-ai-placeholder" disabled title="Die KI-Anbindung folgt später"><Sparkles />Mit KI erstellen <small>später verfügbar</small></button>
      </aside>
    </div>
  </div>;
}

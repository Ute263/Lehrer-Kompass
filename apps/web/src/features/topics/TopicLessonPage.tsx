import { useState } from "react";
import { ArrowLeft, FileText, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { addMaterial, readTopics, updateTopic, type TopicRecord } from "./topicStore";
import "./topic-center.css";

type EditableLessonField = "title" | "objective" | "opening" | "development" | "consolidation" | "reflection" | "notes";

export function TopicLessonPage() {
  const { topicId, lessonId } = useParams();
  const [topic, setTopic] = useState<TopicRecord | null>(() => readTopics().find((item) => item.id === topicId) || null);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialKind, setMaterialKind] = useState("Arbeitsblatt");
  if (!topic) return <div className="planner-portrait"><main className="planner-page"><Link to="/themen"><ArrowLeft />Zur Übersicht</Link><p>Thema nicht gefunden.</p></main></div>;
  const lessonIndex = topic.lessons.findIndex((lesson) => lesson.id === lessonId);
  const lesson = topic.lessons[lessonIndex];
  if (!lesson) return <div className="planner-portrait"><main className="planner-page"><Link to={`/themen/${topic.id}`}><ArrowLeft />Zur Reihe</Link><p>Stunde nicht gefunden.</p></main></div>;
  const saveLesson = (field: EditableLessonField, value: string) => {
    const next: TopicRecord = { ...topic, lessons: topic.lessons.map((entry, index) => index === lessonIndex ? { ...entry, [field]: value } : entry) };
    setTopic(next); updateTopic(next);
  };
  const materials = topic.materials.filter((material) => material.lessonId === lesson.id);

  return <div className="planner-portrait">
    <aside className="planner-tabs" aria-label="Planerregister">
      <Link to="/themen">Übersicht</Link>
      <Link to={`/themen/${topic.id}`}>Reihe</Link>
      <span className="active">Stunde {lessonIndex + 1}</span>
    </aside>

    <main className="planner-page lesson-page">
      <header className="lesson-plan-header">
        <Link to={`/themen/${topic.id}`}><ArrowLeft />{topic.title}</Link>
        <p>{topic.subject} · Klasse {topic.classLevel} · Stunde {lessonIndex + 1}</p>
        <input value={lesson.title} onChange={(event) => saveLesson("title", event.target.value)} aria-label="Stundentitel" />
      </header>

      <section className="lesson-date-line"><label>Datum<input type="date" /></label><label>Zeit<input placeholder="z. B. 2. Stunde" /></label></section>

      <section className="lesson-planning-grid">
        <div className="lesson-main-column">
          <label className="planner-writing-field"><span>Lernziel</span><textarea rows={3} value={lesson.objective} onChange={(event) => saveLesson("objective", event.target.value)} placeholder="Was sollen die Kinder am Ende können oder verstanden haben?" /></label>
          <label className="planner-writing-field"><span>Einstieg</span><textarea rows={4} value={lesson.opening} onChange={(event) => saveLesson("opening", event.target.value)} placeholder="Wie beginnt die Stunde?" /></label>
          <label className="planner-writing-field"><span>Erarbeitung</span><textarea rows={6} value={lesson.development} onChange={(event) => saveLesson("development", event.target.value)} placeholder="Was tun die Kinder? Welche Sozialform und welche Impulse sind geplant?" /></label>
          <label className="planner-writing-field"><span>Sicherung</span><textarea rows={4} value={lesson.consolidation} onChange={(event) => saveLesson("consolidation", event.target.value)} placeholder="Wie werden Ergebnisse festgehalten?" /></label>
          <label className="planner-writing-field"><span>Reflexion / Abschluss</span><textarea rows={3} value={lesson.reflection} onChange={(event) => saveLesson("reflection", event.target.value)} placeholder="Wie endet die Stunde?" /></label>
        </div>

        <aside className="lesson-side-column">
          <section className="material-note-box">
            <header><div><small>Direkt verbunden</small><h2>Material</h2></div><FileText /></header>
            <div className="lesson-materials">{materials.map((material) => <div key={material.id}><span>{material.kind}</span><strong>{material.title}</strong></div>)}</div>
            <div className="lesson-material-form"><input value={materialTitle} onChange={(event) => setMaterialTitle(event.target.value)} placeholder="Materialtitel" /><select value={materialKind} onChange={(event) => setMaterialKind(event.target.value)}><option>Arbeitsblatt</option><option>Lösungsblatt</option><option>Tafelbild</option><option>Spiel</option><option>Bild</option><option>Sonstiges</option></select><button onClick={() => { if (materialTitle.trim()) { setTopic(addMaterial(topic, materialTitle, materialKind, lesson.id)); setMaterialTitle(""); } }}><Plus />Hinzufügen</button></div>
          </section>
          <label className="planner-writing-field notes"><span>Notizen / Differenzierung</span><textarea rows={10} value={lesson.notes} onChange={(event) => saveLesson("notes", event.target.value)} placeholder="Beobachtungen, Hilfen, Erweiterungen oder Erinnerung" /></label>
        </aside>
      </section>
    </main>
  </div>;
}

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ExternalLink, FilePlus2, MessageCircleMore, Plus, Save } from "lucide-react";
import { Link } from "react-router-dom";
import "./planning-dialogue.css";

type LessonDraft = { title: string; focus: string; material: string };

const classOptions = ["1", "2", "3", "4"];
const subjectOptions = ["Deutsch", "Mathematik", "Sachunterricht", "Kunst", "Religion", "Musik", "Förderunterricht"];

function buildDraft(topic: string, count: number): LessonDraft[] {
  const klassensprecher = [
    ["Warum brauchen wir eine Klassensprecherin oder einen Klassensprecher?", "Aufgaben, Wünsche und demokratische Mitbestimmung klären"],
    ["Aufgaben und Grenzen des Amtes", "Gute und ungeeignete Aufgaben unterscheiden; Situationen besprechen"],
    ["Eine faire Wahl vorbereiten", "Kriterien, Kandidatur, Wahlrede und geheime Abstimmung vorbereiten"],
    ["Wählen und gemeinsam auswerten", "Wahl durchführen, Ergebnis annehmen und Zusammenarbeit vereinbaren"],
  ];
  return Array.from({ length: count }, (_, index) => {
    const sample = topic.toLowerCase().includes("klassensprecher") ? klassensprecher[index] : undefined;
    return {
      title: sample?.[0] ?? `${topic}: Unterrichtsstunde ${index + 1}`,
      focus: sample?.[1] ?? `Schwerpunkt und Lernweg für Stunde ${index + 1} gemeinsam festlegen`,
      material: "Noch offen",
    };
  });
}

export function PlanningDialoguePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [topic, setTopic] = useState("Klassensprecher");
  const [classLevel, setClassLevel] = useState("4");
  const [subject, setSubject] = useState("Sachunterricht");
  const [hours, setHours] = useState(4);
  const [notes, setNotes] = useState("Die Wahl soll am Ende der Reihe stattfinden.");
  const [lessons, setLessons] = useState<LessonDraft[]>([]);
  const [materials, setMaterials] = useState("Ich habe bereits ein Material zur Klassensprecherwahl und Wahlzettel.");
  const [saved, setSaved] = useState(false);

  const prompt = useMemo(() => `Plane mit mir eine Unterrichtsreihe zum Thema „${topic}“ für Klasse ${classLevel} im Fach ${subject}. Umfang: ${hours} Unterrichtsstunden. Hinweise: ${notes || "keine"}. Erstelle zunächst nur eine übersichtliche Grobplanung. Frage mich danach, welche Materialien ich bereits habe und welche Materialien noch erstellt werden sollen.`, [topic, classLevel, subject, hours, notes]);

  const createPlan = () => {
    setLessons(buildDraft(topic.trim() || "Neues Thema", Math.max(1, hours)));
    setStep(2);
    setSaved(false);
  };

  const updateLesson = (index: number, field: keyof LessonDraft, value: string) => {
    setLessons((current) => current.map((lesson, lessonIndex) => lessonIndex === index ? { ...lesson, [field]: value } : lesson));
  };

  const openChatGPT = async () => {
    try { await navigator.clipboard.writeText(`${prompt}\n\nVorhandene Materialien: ${materials || "noch keine Angaben"}`); } catch { /* Kopieren kann auf einzelnen Geräten blockiert sein. */ }
    window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer");
  };

  const savePrototype = () => {
    localStorage.setItem("lehrerkompass.planungsdialog.prototype", JSON.stringify({ topic, classLevel, subject, hours, notes, materials, lessons, savedAt: new Date().toISOString() }));
    setSaved(true);
  };

  return <div className="planning-dialogue">
    <header className="planning-dialogue__header">
      <Link to="/werkbank"><ArrowLeft aria-hidden="true" />Zurück</Link>
      <div><p>Unterricht planen</p><h1>Plane dein Thema im Gespräch</h1><span>Erst eine ruhige Grobplanung, danach vorhandenes und fehlendes Material.</span></div>
    </header>

    <ol className="planning-steps" aria-label="Planungsschritte">
      <li className={step >= 1 ? "active" : ""}><span>1</span>Thema</li>
      <li className={step >= 2 ? "active" : ""}><span>2</span>Grobplanung</li>
      <li className={step >= 3 ? "active" : ""}><span>3</span>Material</li>
    </ol>

    {step === 1 && <section className="planning-card planning-card--form">
      <div className="planning-card__intro"><MessageCircleMore aria-hidden="true" /><div><h2>Was möchtest du unterrichten?</h2><p>Vier Angaben reichen für den ersten Vorschlag.</p></div></div>
      <label>Thema<input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="z. B. Klassensprecher" /></label>
      <div className="planning-form-grid">
        <label>Klasse<select value={classLevel} onChange={(event) => setClassLevel(event.target.value)}>{classOptions.map((value) => <option key={value} value={value}>Klasse {value}</option>)}</select></label>
        <label>Fach<select value={subject} onChange={(event) => setSubject(event.target.value)}>{subjectOptions.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Anzahl der Stunden<input type="number" min={1} max={20} value={hours} onChange={(event) => setHours(Number(event.target.value) || 1)} /></label>
      </div>
      <label>Was ist dir wichtig? <span>optional</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} /></label>
      <button className="planning-primary" onClick={createPlan}>Grobplanung vorschlagen <ArrowRight aria-hidden="true" /></button>
    </section>}

    {step === 2 && <section className="planning-card">
      <div className="planning-result-heading"><div><p>Vorschlag</p><h2>{topic} · Klasse {classLevel}</h2><span>{hours} Unterrichtsstunden · {subject}</span></div><button className="planning-text-button" onClick={() => setStep(1)}>Angaben ändern</button></div>
      <div className="lesson-draft-list">{lessons.map((lesson, index) => <article key={index} className="lesson-draft">
        <span className="lesson-draft__number">{index + 1}</span>
        <div><label>Titel<input value={lesson.title} onChange={(event) => updateLesson(index, "title", event.target.value)} /></label><label>Grobe Idee<textarea rows={2} value={lesson.focus} onChange={(event) => updateLesson(index, "focus", event.target.value)} /></label></div>
      </article>)}</div>
      <div className="planning-actions"><button className="planning-secondary" onClick={createPlan}>Anderen Vorschlag zeigen</button><button className="planning-primary" onClick={() => setStep(3)}>Die Richtung passt <ArrowRight aria-hidden="true" /></button></div>
    </section>}

    {step === 3 && <section className="planning-card">
      <div className="planning-card__intro"><FilePlus2 aria-hidden="true" /><div><h2>Was hast du schon – und was fehlt?</h2><p>Du beschreibst dein Material ganz normal. Danach kann ChatGPT mit dir weiterplanen.</p></div></div>
      <label>Vorhandene Materialien<textarea rows={4} value={materials} onChange={(event) => setMaterials(event.target.value)} placeholder="z. B. Buchseite, Eduki-Material, eigenes PDF, Spiel …" /></label>
      <div className="material-needs">
        <h3>Direkt ergänzen</h3>
        <button><Plus aria-hidden="true" />Arbeitsblatt</button><button><Plus aria-hidden="true" />Spiel</button><button><Plus aria-hidden="true" />Tafelbild</button><button><Plus aria-hidden="true" />Lösungsblatt</button>
      </div>
      <div className="chatgpt-handoff"><div><strong>Mit deinem ChatGPT-Abo weiterarbeiten</strong><p>Beim Öffnen wird der vorbereitete Auftrag kopiert. Du fügst ihn in ChatGPT ein und planst dort im Gespräch weiter.</p></div><button className="planning-primary" onClick={openChatGPT}>ChatGPT öffnen <ExternalLink aria-hidden="true" /></button></div>
      <div className="planning-actions"><button className="planning-secondary" onClick={() => setStep(2)}>Zur Grobplanung</button><button className="planning-primary" onClick={savePrototype}><Save aria-hidden="true" />Probeweise speichern</button></div>
      {saved && <p className="planning-saved"><Check aria-hidden="true" />Der Prototyp wurde auf diesem Gerät gespeichert.</p>}
    </section>}
  </div>;
}

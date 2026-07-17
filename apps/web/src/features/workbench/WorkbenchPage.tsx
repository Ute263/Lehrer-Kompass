import { ArrowRight, BookOpen, CalendarDays, GraduationCap, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useWorkbench } from "./useWorkbench";
import "./workbench.css";

const todayLabel = () => new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "2-digit", month: "long" }).format(new Date());

export function WorkbenchPage() {
  const workbench = useWorkbench(null, null);
  const recent = useMemo(() => workbench.pinned[0] ?? workbench.current[0] ?? null, [workbench.pinned, workbench.current]);
  return <div className="home-workspace">
    <header className="home-intro"><p className="home-intro__eyebrow">Dein LehrerKompass</p><h1>Woran möchtest du arbeiten?</h1><p>{todayLabel()} · Planung und Materialien bleiben beim Thema zusammen.</p></header>
    {recent && <section className="recent-work" aria-labelledby="recent-work-title"><div className="recent-work__icon"><BookOpen /></div><div className="recent-work__content"><span>Zuletzt bearbeitet</span><h2 id="recent-work-title">{recent.title}</h2><p>{[recent.classLabel, recent.subjectLabel, recent.topicLabel].filter(Boolean).join(" · ") || recent.subtitle}</p></div><Link className="recent-work__action" to={recent.targetRoute} onClick={() => workbench.markEdited(recent.id)}>Weiterarbeiten <ArrowRight /></Link></section>}
    <main className="primary-paths" aria-label="Hauptaufgaben">
      <section className="primary-path primary-path--planning"><div className="primary-path__icon"><BookOpen /></div><div><p className="primary-path__eyebrow">Meine Themen</p><h2>Unterricht, Stunden und Materialien gemeinsam</h2><p>Öffne ein vorhandenes Thema oder beginne ein neues. Alles bleibt an diesem einen Ort verbunden.</p></div><div className="primary-path__actions"><Link className="primary-path__main-action" to="/themen">Themen öffnen <ArrowRight /></Link></div></section>
      <section className="primary-path"><div className="primary-path__icon"><CalendarDays /></div><div><p className="primary-path__eyebrow">Mein Schultag</p><h2>Stundenplan und Tagesübersicht</h2><p>Sieh, was heute ansteht und welche Vorbereitungen noch offen sind.</p></div><div className="primary-path__actions"><Link to="/stundenplan">Stundenplan öffnen</Link></div></section>
    </main>
    <footer className="secondary-access" aria-label="Weitere Bereiche"><Link to="/bibliothek"><BookOpen />Gesamte Materialsammlung</Link><Link to="/foerderunterricht"><GraduationCap />Förderunterricht</Link><Link to="/schule-grundlagen"><BookOpen />Schule und Grundlagen</Link><Link to="/einstellungen"><Settings2 />Einstellungen</Link></footer>
  </div>;
}

import { ArrowRight, BookOpen, CalendarDays, FilePlus2, FolderSearch, GraduationCap, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useWorkbench } from "./useWorkbench";
import "./workbench.css";

const todayLabel = () =>
  new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());

export function WorkbenchPage() {
  const workbench = useWorkbench(null, null);
  const recent = useMemo(
    () => workbench.pinned[0] ?? workbench.current[0] ?? null,
    [workbench.pinned, workbench.current],
  );

  return (
    <div className="home-workspace">
      <header className="home-intro">
        <p className="home-intro__eyebrow">Dein LehrerKompass</p>
        <h1>Was möchtest du gerade erledigen?</h1>
        <p>{todayLabel()} · Wähle einen klaren nächsten Schritt.</p>
      </header>

      {recent && (
        <section className="recent-work" aria-labelledby="recent-work-title">
          <div className="recent-work__icon" aria-hidden="true"><BookOpen /></div>
          <div className="recent-work__content">
            <span>Zuletzt bearbeitet</span>
            <h2 id="recent-work-title">{recent.title}</h2>
            <p>{[recent.classLabel, recent.subjectLabel, recent.topicLabel].filter(Boolean).join(" · ") || recent.subtitle}</p>
          </div>
          <Link className="recent-work__action" to={recent.targetRoute} onClick={() => workbench.markEdited(recent.id)}>Weiterarbeiten <ArrowRight aria-hidden="true" /></Link>
        </section>
      )}

      <main className="primary-paths" aria-label="Hauptaufgaben">
        <section className="primary-path primary-path--planning">
          <div className="primary-path__icon" aria-hidden="true"><CalendarDays /></div>
          <div>
            <p className="primary-path__eyebrow">Unterricht planen</p>
            <h2>Thema nennen – Grobplanung erhalten</h2>
            <p>Gib Thema, Klasse, Fach und Stundenanzahl ein. Danach entscheidest du, welche Materialien du nutzen oder erstellen möchtest.</p>
          </div>
          <div className="primary-path__actions">
            <Link className="primary-path__main-action" to="/unterricht-planen">Planung beginnen <ArrowRight aria-hidden="true" /></Link>
            <Link to="/stundenplan">Stundenplan öffnen</Link>
          </div>
        </section>

        <section className="primary-path primary-path--material">
          <div className="primary-path__icon" aria-hidden="true"><FilePlus2 /></div>
          <div>
            <p className="primary-path__eyebrow">Material erstellen</p>
            <h2>Arbeitsblatt, Spiel oder Lernmaterial</h2>
            <p>Beginne direkt mit dem Material. Thema, Klasse und Umfang werden im nächsten Schritt festgelegt.</p>
          </div>
          <div className="primary-path__actions">
            <Link className="primary-path__main-action" to="/materialien/neu">Neues Material erstellen <ArrowRight aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="primary-path primary-path--library">
          <div className="primary-path__icon" aria-hidden="true"><FolderSearch /></div>
          <div>
            <p className="primary-path__eyebrow">Material finden</p>
            <h2>Eigene Inhalte schnell wiederfinden</h2>
            <p>Suche nach Unterrichtsreihen, Stunden und Materialien, statt dich durch Kacheln zu arbeiten.</p>
          </div>
          <div className="primary-path__actions">
            <Link className="primary-path__main-action" to="/bibliothek">Bibliothek öffnen <ArrowRight aria-hidden="true" /></Link>
          </div>
        </section>
      </main>

      <footer className="secondary-access" aria-label="Weitere Bereiche">
        <Link to="/foerderunterricht"><GraduationCap aria-hidden="true" />Förderunterricht</Link>
        <Link to="/schule-grundlagen"><BookOpen aria-hidden="true" />Schule und Grundlagen</Link>
        <Link to="/einstellungen"><Settings2 aria-hidden="true" />Einstellungen</Link>
      </footer>
    </div>
  );
}

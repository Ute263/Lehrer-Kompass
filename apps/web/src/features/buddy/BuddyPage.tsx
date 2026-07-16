import { Link, useSearchParams } from "react-router-dom";
import { Bot, ChevronLeft } from "lucide-react";
import { BuddyPanel } from "./BuddyPanel";
import "./buddy.css";

export function BuddyPage() {
  const [params] = useSearchParams();
  const contextPath = params.get("context") || "/werkbank";
  const hasWorkContext = /^\/(stunden|materialien|reihen)\//.test(contextPath);

  return (
    <div className="buddy-page">
      <header className="buddy-page__header">
        <div>
          <p className="eyebrow">Planungshilfe</p>
          <h1><Bot aria-hidden="true" /> KI-Buddy</h1>
          <p>Der Buddy erstellt Vorschläge für den zuletzt geöffneten Arbeitsbereich. Änderungen werden niemals ungefragt übernommen.</p>
        </div>
        <Link className="button button--secondary" to={contextPath}>
          <ChevronLeft aria-hidden="true" /> Zurück zum Arbeitsbereich
        </Link>
      </header>
      {!hasWorkContext && (
        <p className="buddy-page__hint">Öffne zuerst eine Unterrichtsreihe, Unterrichtsstunde oder ein Material und starte dort den Buddy.</p>
      )}
      <BuddyPanel pathname={contextPath} />
    </div>
  );
}

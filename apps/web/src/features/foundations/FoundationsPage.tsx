import { FormEvent, useMemo, useState } from "react";
import { BookOpen, FileText, Link2, Plus, School, Search, Star, Trash2 } from "lucide-react";
import { Badge, Button, Card, Notice, TextAreaField, TextField } from "../../design-system/components";
import "./foundations.css";

type FoundationType = "textbook" | "curriculum" | "assessment" | "concept" | "other";
type FoundationItem = {
  id: string;
  title: string;
  type: FoundationType;
  subject: string;
  grades: string;
  publisher?: string;
  description?: string;
  source?: string;
  notes?: string;
  favourite: boolean;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "lehrerkompass-foundations-v1";
const TYPE_LABELS: Record<FoundationType, string> = {
  textbook: "Lehrwerk",
  curriculum: "Arbeitsplan",
  assessment: "Leistungskonzept",
  concept: "Schulisches Konzept",
  other: "Weitere Grundlage",
};
const seed: FoundationItem[] = [
  {
    id: "foundation-abc2",
    title: "ABC der Tiere 2",
    type: "textbook",
    subject: "Deutsch",
    grades: "Klasse 2",
    publisher: "Mildenberger",
    description: "Lehrwerk mit Teil A/B und Lernstandsheft Teil C.",
    notes: "Für Reihen- und Stundenplanung als fachliche Grundlage verwenden.",
    favourite: true,
    createdAt: "2026-07-16T08:00:00.000Z",
    updatedAt: "2026-07-16T08:00:00.000Z",
  },
  {
    id: "foundation-minimax2",
    title: "MiniMax 2",
    type: "textbook",
    subject: "Mathematik",
    grades: "Klasse 2",
    description: "Mathematiklehrwerk für die Jahresplanung und Materialzuordnung.",
    favourite: false,
    createdAt: "2026-07-16T08:00:00.000Z",
    updatedAt: "2026-07-16T08:00:00.000Z",
  },
];

function readItems(): FoundationItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") ?? seed;
  } catch {
    return seed;
  }
}
function saveItems(items: FoundationItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
function makeId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function FoundationsPage() {
  const [items, setItems] = useState<FoundationItem[]>(readItems);
  const [selectedId, setSelectedId] = useState(items[0]?.id);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | FoundationType>("all");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const selected = items.find((item) => item.id === selectedId);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("de-DE");
    return items
      .filter((item) => type === "all" || item.type === type)
      .filter((item) => !term || [item.title, item.subject, item.grades, item.publisher, item.description, item.notes].filter(Boolean).join(" ").toLocaleLowerCase("de-DE").includes(term))
      .sort((a, b) => Number(b.favourite) - Number(a.favourite) || a.title.localeCompare(b.title, "de"));
  }, [items, query, type]);

  const persist = (next: FoundationItem[]) => {
    setItems(next);
    saveItems(next);
  };
  const addItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const now = new Date().toISOString();
    const item: FoundationItem = {
      id: makeId(),
      title: String(data.get("title") ?? "").trim(),
      type: String(data.get("type")) as FoundationType,
      subject: String(data.get("subject") ?? "").trim(),
      grades: String(data.get("grades") ?? "").trim(),
      publisher: String(data.get("publisher") ?? "").trim() || undefined,
      description: String(data.get("description") ?? "").trim() || undefined,
      source: String(data.get("source") ?? "").trim() || undefined,
      notes: String(data.get("notes") ?? "").trim() || undefined,
      favourite: false,
      createdAt: now,
      updatedAt: now,
    };
    persist([...items, item]);
    setSelectedId(item.id);
    setShowForm(false);
    setMessage("Die Grundlage wurde lokal gespeichert.");
  };
  const toggleFavourite = (id: string) => persist(items.map((item) => item.id === id ? { ...item, favourite: !item.favourite, updatedAt: new Date().toISOString() } : item));
  const remove = (id: string) => {
    const next = items.filter((item) => item.id !== id);
    persist(next);
    setSelectedId(next[0]?.id);
    setMessage("Die Grundlage wurde entfernt.");
  };

  return <div className="foundations-page">
    <header className="foundations-header">
      <div><p className="eyebrow">Schulischer Rahmen</p><h1>Schule und Grundlagen</h1><p>Lehrwerke, Arbeitspläne, Leistungskonzepte und schulische Absprachen an einem Ort.</p></div>
      <Button onClick={() => setShowForm((value) => !value)}><Plus aria-hidden="true" /> Grundlage hinzufügen</Button>
    </header>

    {message && <Notice variant="success" title="Gespeichert">{message}</Notice>}

    {showForm && <Card className="foundation-form-card">
      <form className="foundation-form" onSubmit={addItem}>
        <div className="foundation-form__heading"><div><p className="eyebrow">Neue Grundlage</p><h2>Eintrag anlegen</h2></div><Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Schließen</Button></div>
        <div className="foundation-form__row">
          <TextField id="foundation-title" name="title" label="Titel" required />
          <label className="field" htmlFor="foundation-type"><span>Art</span><select id="foundation-type" name="type" defaultValue="textbook">{Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        </div>
        <div className="foundation-form__row"><TextField id="foundation-subject" name="subject" label="Fach oder Bereich" required /><TextField id="foundation-grades" name="grades" label="Jahrgang" placeholder="z. B. Klasse 2" required /></div>
        <div className="foundation-form__row"><TextField id="foundation-publisher" name="publisher" label="Verlag / Herausgeber (optional)" /><TextField id="foundation-source" name="source" label="Datei, Ordner oder Internetquelle (optional)" /></div>
        <TextAreaField id="foundation-description" name="description" label="Beschreibung" />
        <TextAreaField id="foundation-notes" name="notes" label="Hinweise für die Planung" />
        <Button type="submit">Grundlage speichern</Button>
      </form>
    </Card>}

    <section className="foundations-toolbar" aria-label="Grundlagen durchsuchen">
      <label className="foundations-search"><Search aria-hidden="true" /><span className="sr-only">Grundlagen suchen</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Lehrwerk, Fach oder Stichwort suchen …" /></label>
      <select aria-label="Nach Art filtern" value={type} onChange={(event) => setType(event.target.value as "all" | FoundationType)}><option value="all">Alle Arten</option>{Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
    </section>

    <div className="foundations-layout">
      <section className="foundations-list" aria-label="Gespeicherte Grundlagen">
        {filtered.length ? filtered.map((item) => <button key={item.id} className={selectedId === item.id ? "is-active" : ""} onClick={() => setSelectedId(item.id)}>
          <span className="foundation-icon">{item.type === "textbook" ? <BookOpen /> : item.type === "concept" ? <School /> : <FileText />}</span>
          <span><strong>{item.title}</strong><small>{TYPE_LABELS[item.type]} · {item.subject} · {item.grades}</small></span>
          {item.favourite && <Star className="foundation-star" fill="currentColor" aria-label="Favorit" />}
        </button>) : <Notice variant="info" title="Keine passenden Grundlagen">Ändere die Suche oder lege eine neue Grundlage an.</Notice>}
      </section>

      <aside className="foundation-detail" aria-label="Ausgewählte Grundlage">
        {selected ? <Card>
          <div className="foundation-detail__top"><Badge tone="info">{TYPE_LABELS[selected.type]}</Badge><button type="button" className="foundation-favourite" aria-label={selected.favourite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"} onClick={() => toggleFavourite(selected.id)}><Star fill={selected.favourite ? "currentColor" : "none"} /></button></div>
          <h2>{selected.title}</h2>
          <p>{selected.description ?? "Noch keine Beschreibung hinterlegt."}</p>
          <dl><div><dt>Fach / Bereich</dt><dd>{selected.subject}</dd></div><div><dt>Jahrgang</dt><dd>{selected.grades}</dd></div>{selected.publisher && <div><dt>Verlag / Herausgeber</dt><dd>{selected.publisher}</dd></div>}<div><dt>Zuletzt geändert</dt><dd>{new Date(selected.updatedAt).toLocaleDateString("de-DE")}</dd></div></dl>
          {selected.source && <p className="foundation-source"><Link2 aria-hidden="true" /> {selected.source}</p>}
          {selected.notes && <section className="foundation-notes"><h3>Hinweise für die Planung</h3><p>{selected.notes}</p></section>}
          <div className="foundation-detail__actions"><Button variant="secondary" onClick={() => toggleFavourite(selected.id)}><Star aria-hidden="true" /> {selected.favourite ? "Favorit entfernen" : "Als Favorit markieren"}</Button><Button variant="ghost" onClick={() => remove(selected.id)}><Trash2 aria-hidden="true" /> Entfernen</Button></div>
        </Card> : <Notice variant="info" title="Grundlage auswählen">Wähle links einen Eintrag aus.</Notice>}
      </aside>
    </div>
  </div>;
}

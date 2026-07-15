import { useEffect, useState, type FormEvent } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ArrowDown, ArrowUp, Copy, Plus } from "lucide-react";
import {
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Dialog,
  ErrorState,
  PageHeader,
  PlanningSection,
  SegmentedControl,
  SelectField,
  TextAreaField,
  TextField,
} from "../../design-system/components";
import {
  LESSON_STATUSES,
  LESSON_STATUS_LABELS,
  LESSON_TRANSITIONS,
  PHASE_TYPES,
  lessonService,
  phaseMinutes,
  qualityHints,
  type LessonPlanning,
  type LessonPhase,
  type LessonStatus,
  type PhaseType,
  type SeriesSequenceItem,
} from "../../domain";
import { useDomainData } from "../classes/useDomainData";
import { useSeriesData } from "../series/useSeriesData";
import { useLessonData } from "./useLessonData";
import "./lessons.css";
export function LessonOverview({
  implementationId,
  sequence,
}: {
  implementationId: string;
  sequence: SeriesSequenceItem[];
}) {
  const lesson = useLessonData(),
    nav = useNavigate(),
    [open, setOpen] = useState(false);
  if (!lesson.data)
    return <p role="status">Unterrichtsstunden werden geladen …</p>;
  const items = lesson.data.lessons
    .filter((v) => v.implementationId === implementationId && !v.archivedAt)
    .sort((a, b) => a.position - b.position);
  return (
    <section className="lesson-overview">
      <div className="section-title">
        <div>
          <h2>Unterrichtsstunden</h2>
          <p>Gliederung und echte Stunden bleiben getrennt.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Stunde ergänzen</Button>
      </div>
      {sequence.map((seq) => {
        const current = items.find((v) => v.sequenceItemId === seq.id);
        return (
          <Card key={seq.id}>
            <div>
              <h3>
                {seq.position + 1}. {seq.title}
              </h3>
              <p>
                {current
                  ? `${LESSON_STATUS_LABELS[current.status]} · ${current.plannedDurationMinutes} Minuten`
                  : "Noch nicht ausgearbeitet"}
              </p>
            </div>
            {current ? (
              <div className="lesson-actions">
                <Button variant="ghost" aria-label={`${current.title} nach oben`} disabled={current.position===0} onClick={async()=>{await lessonService.reorderLesson(current.id,-1);await lesson.refresh()}}><ArrowUp aria-hidden /></Button>
                <Button variant="ghost" aria-label={`${current.title} nach unten`} disabled={current.position===items.length-1} onClick={async()=>{await lessonService.reorderLesson(current.id,1);await lesson.refresh()}}><ArrowDown aria-hidden /></Button>
                <Link className="button-link" to={`/stunden/${current.id}`}>Öffnen</Link>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={async () =>
                  nav(
                    `/stunden/${await lessonService.fromSequence(implementationId, seq.id)}`,
                  )
                }
              >
                Als Unterrichtsstunde ausarbeiten
              </Button>
            )}
          </Card>
        );
      })}
      <AddLessonDialog
        open={open}
        onClose={() => setOpen(false)}
        implementationId={implementationId}
        onCreated={(id) => nav(`/stunden/${id}`)}
      />
    </section>
  );
}
function AddLessonDialog({
  open,
  onClose,
  implementationId,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  implementationId: string;
  onCreated: (id: string) => void;
}) {
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const id = await lessonService.create({
      implementationId,
      title: String(f.get("title")),
      duration: Number(f.get("duration")),
      shortDescription: String(f.get("description")),
    });
    onClose();
    onCreated(id);
  }
  return (
    <Dialog
      open={open}
      title="Unterrichtsstunde ergänzen"
      onClose={onClose}
      confirmLabel="Stunde anlegen"
      onConfirm={() =>
        document.querySelector<HTMLFormElement>("#add-lesson")?.requestSubmit()
      }
    >
      <form id="add-lesson" className="domain-form" onSubmit={submit}>
        <TextField
          id="lesson-title"
          name="title"
          label="Stundentitel"
          required
        />
        <TextField
          id="lesson-duration"
          name="duration"
          label="Geplante Dauer"
          type="number"
          min="1"
          defaultValue="45"
        />
        <TextAreaField
          id="lesson-short"
          name="description"
          label="Kurzbeschreibung (optional)"
        />
        <p>Es wird kein Termin und keine Materialdatei erzeugt.</p>
      </form>
    </Dialog>
  );
}
export function LessonPage() {
  const { lessonId } = useParams(),
    [params, setParams] = useSearchParams(),
    lessons = useLessonData(),
    series = useSeriesData(),
    domain = useDomainData(),
    [phaseOpen, setPhaseOpen] = useState(false),
    [editingPhase, setEditingPhase] = useState<LessonPhase>(),
    [statusOpen, setStatusOpen] = useState(false),
    [reflectionOpen, setReflectionOpen] = useState(false);
  const mode = params.get("mode") === "compact" ? "Kompakt" : "Ausführlich";
  if (!lessons.data || !series.data || !domain.data)
    return <p role="status">Stundenarbeitsplatz wird geladen …</p>;
  const lesson = lessons.data.lessons.find((v) => v.id === lessonId);
  if (!lesson)
    return (
      <ErrorState title="Unterrichtsstunde nicht gefunden">
        Der Verweis ist nicht mehr gültig. Deine übrigen Daten bleiben erhalten.
      </ErrorState>
    );
  const impl = series.data.implementations.find(
      (v) => v.id === lesson.implementationId,
    )!,
    template = series.data.templates.find((v) => v.id === impl.templateId)!,
    topic = domain.data.topics.find((v) => v.id === template.topicId)!,
    c = domain.data.classes.find((v) => v.id === impl.classId)!,
    subject = domain.data.subjects.find((v) => v.id === topic.subjectId)!,
    planning = lessons.data.plannings.find((v) => v.lessonId === lesson.id)!,
    phases = lessons.data.phases
      .filter((v) => v.lessonId === lesson.id)
      .sort((a, b) => a.position - b.position),
    reflection = lessons.data.reflections.find((v) => v.lessonId === lesson.id),
    ref = lessons.data.refs.find((v) => v.lessonId === lesson.id),
    sum = phaseMinutes(phases),
    hints = qualityHints(planning, phases, lesson.plannedDurationMinutes);
  return (
    <div className="lesson-page">
      <Breadcrumbs
        label="Stundenpfad"
        items={[
          { label: `Klasse ${c.label}`, href: `/klassen/${c.id}` },
          { label: subject.label },
          { label: topic.title },
          { label: template.title, href: `/reihen/${impl.id}` },
          { label: lesson.title },
        ]}
      />
      <PageHeader
        title={lesson.title}
        description={`Klasse ${c.label} · ${template.title} · Stunde ${lesson.position + 1}`}
        action={
          <Button onClick={() => setStatusOpen(true)}>Status ändern</Button>
        }
      />
      <div className="lesson-meta">
        <Badge tone={lesson.status === "cancelled" ? "warning" : "info"}>
          {LESSON_STATUS_LABELS[lesson.status]}
        </Badge>
        <strong>
          Geplant: {lesson.plannedDurationMinutes} Minuten · Phasen: {sum}{" "}
          Minuten
        </strong>
        <Button
          variant="secondary"
          onClick={async () => {
            await lessonService.toggleWorkbench(lesson.id, !ref?.isActive);
            lessons.refresh();
          }}
        >
          {ref?.isActive ? "Von Werkbank nehmen" : "Auf Werkbank legen"}
        </Button>
        <Link className="button-link" to={`/stundenplan?lessonId=${lesson.id}`}>Einplanen</Link>
        <Button variant="ghost" onClick={async()=>{await lessonService.archiveLesson(lesson.id);location.assign(`/reihen/${lesson.implementationId}`)}}>Stunde archivieren</Button>
        <Button
          variant="ghost"
          onClick={async () =>
            location.assign(
              `/stunden/${await lessonService.duplicate(lesson.id)}`,
            )
          }
        >
          <Copy aria-hidden />
          Duplizieren
        </Button>
      </div>
      <SegmentedControl
        label="Planungsansicht"
        options={["Kompakt", "Ausführlich"]}
        value={mode}
        onChange={(v) =>
          setParams({ mode: v === "Kompakt" ? "compact" : "detailed" })
        }
      />
      {hints.length > 0 && (
        <Card className="quality-notice">
          <h2>Ruhige Planungshinweise</h2>
          {hints.map((h) => (
            <p key={h}>{h}</p>
          ))}
          <Button variant="ghost">Planung trotzdem beibehalten</Button>
        </Card>
      )}
      <LessonPlanningEditor
        planning={planning}
        compact={mode === "Kompakt"}
        onSaved={lessons.refresh}
      />
      <section>
        <div className="section-title">
          <h2>Unterrichtsablauf</h2>
          <Button onClick={() => setPhaseOpen(true)}>
            <Plus aria-hidden />
            Phase ergänzen
          </Button>
        </div>
        <div className="phase-list">
          {phases.map((p, i) => (
            <Card key={p.id} draggable>
              <div>
                <Badge tone={p.optional ? "neutral" : "info"}>
                  {p.optional ? "Optional" : p.phaseType}
                </Badge>
                <h3>{p.title}</h3>
                <p>
                  {p.durationMinutes} Minuten{p.method ? ` · ${p.method}` : ""}
                </p>
              </div>
              <div>
                <Button variant="ghost" onClick={()=>setEditingPhase(p)}>Bearbeiten</Button>
                <Button variant="ghost" onClick={async()=>{await lessonService.duplicatePhase(p.id);await lessons.refresh()}}>Phase duplizieren</Button>
                <Button variant="ghost" onClick={async()=>{await lessonService.removePhase(p.id);await lessons.refresh()}}>Phase entfernen</Button>
                <Button
                  variant="ghost"
                  aria-label={`${p.title} nach oben`}
                  disabled={!i}
                  onClick={async () => {
                    await lessonService.reorderPhase(lesson.id, p.id, -1);
                    lessons.refresh();
                  }}
                >
                  <ArrowUp aria-hidden />
                </Button>
                <Button
                  variant="ghost"
                  aria-label={`${p.title} nach unten`}
                  disabled={i === phases.length - 1}
                  onClick={async () => {
                    await lessonService.reorderPhase(lesson.id, p.id, 1);
                    lessons.refresh();
                  }}
                >
                  <ArrowDown aria-hidden />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <Button variant="secondary" onClick={() => setReflectionOpen(true)}>
        Kurz reflektieren
      </Button>
      <PhaseDialog
        open={phaseOpen}
        onClose={() => setPhaseOpen(false)}
        lessonId={lesson.id}
        onSaved={lessons.refresh}
      />
      <PhaseDialog open={Boolean(editingPhase)} onClose={()=>setEditingPhase(undefined)} lessonId={lesson.id} phase={editingPhase} onSaved={lessons.refresh}/>
      <LessonStatusDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        lesson={lesson}
        planning={planning}
        phases={phases}
        onSaved={lessons.refresh}
      />
      <ReflectionDialog
        open={reflectionOpen}
        onClose={() => setReflectionOpen(false)}
        lessonId={lesson.id}
        reflection={reflection}
        onSaved={lessons.refresh}
      />
    </div>
  );
}
function LessonPlanningEditor({
  planning,
  compact,
  onSaved,
}: {
  planning: LessonPlanning;
  compact: boolean;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false),
    [saveError, setSaveError] = useState(""),
    [draft, setDraft] = useState<Record<string, string>>({});
  useEffect(
    () => () => {
      for (const [k, v] of Object.entries(draft))
        void lessonService.savePlanning(planning.lessonId, { [k]: v });
    },
    [draft, planning.lessonId],
  );
  const all = [
      ["seriesContext", "Einordnung in die Reihe"],
      ["learningPrerequisites", "Lernvoraussetzungen"],
      ["lessonGoal", "Lernziel"],
      ["successCriteria", "Erfolgskriterien"],
      ["vocabulary", "Wortspeicher"],
      ["differentiation", "Differenzierung"],
      ["materialNeeds", "Materialbedarf"],
      ["preparation", "Vorbereitung"],
      ["homework", "Hausaufgabe"],
      ["notes", "Notizen"],
    ] as const,
    shown = compact
      ? all.filter(([k]) =>
          ["lessonGoal", "materialNeeds", "preparation"].includes(k),
        )
      : all;
  return (
    <section>
      <h2>Didaktische Planung</h2>
      <p role="status">{saving ? "Wird gespeichert …" : "Lokal gespeichert"}</p>
      {saveError&&<p className="quiet-notice" role="alert">{saveError}</p>}
      {shown.map(([key, label], i) => (
        <PlanningSection
          key={key}
          title={label}
          state={planning[key] ? "started" : "closed"}
          defaultOpen={!i}
        >
          <TextAreaField
            id={`lesson-${key}`}
            label={label}
            defaultValue={planning[key] ?? ""}
            onChange={(e) => setDraft((v) => ({ ...v, [key]: e.target.value }))}
            onBlur={async (e) => {
              setSaving(true);
              try{await new Promise((r) => setTimeout(r, 200));await lessonService.savePlanning(planning.lessonId, {[key]: e.target.value});setSaveError("");onSaved()}
              catch{setSaveError("Die letzte Änderung konnte lokal nicht gespeichert werden. Dein Text bleibt im Feld erhalten.")}
              finally{setSaving(false)}
            }}
          />
        </PlanningSection>
      ))}
    </section>
  );
}
function PhaseDialog({
  open,
  onClose,
  lessonId,
  phase,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  lessonId: string;
  phase?: LessonPhase | undefined;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(phase?.title??""),
    [duration, setDuration] = useState(phase?.durationMinutes??10),
    [type, setType] = useState<PhaseType>(phase?.phaseType??"practice");
  useEffect(()=>{setTitle(phase?.title??"");setDuration(phase?.durationMinutes??10);setType(phase?.phaseType??"practice")},[phase,open]);
  return (
    <Dialog
      open={open}
      title={phase?"Unterrichtsphase bearbeiten":"Unterrichtsphase ergänzen"}
      onClose={onClose}
      confirmLabel={phase?"Änderungen speichern":"Phase ergänzen"}
      onConfirm={async () => {
        if(phase)await lessonService.updatePhase(phase.id,{title,durationMinutes:duration,phaseType:type});
        else await lessonService.addPhase(lessonId, {title,duration,phaseType:type});
        onClose();
        onSaved();
      }}
    >
      <div className="domain-form">
        <SelectField
          id="phase-type"
          label="Phasentyp"
          value={type}
          onChange={(e) => setType(e.target.value as PhaseType)}
        >
          {PHASE_TYPES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </SelectField>
        <TextField
          id="phase-title"
          label="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          id="phase-duration"
          label="Zeit in Minuten"
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>
    </Dialog>
  );
}
function LessonStatusDialog({
  open,
  onClose,
  lesson,
  planning,
  phases,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  lesson: { id: string; status: LessonStatus };
  planning: LessonPlanning;
  phases: import("../../domain").LessonPhase[];
  onSaved: () => void;
}) {
  const [next, setNext] = useState<LessonStatus>(
      LESSON_TRANSITIONS[lesson.status][0] ?? lesson.status,
    ),
    warnings =
      next === "ready" &&
      (!planning.lessonGoal ||
        !phases.some((p) => p.phaseType === "consolidation"));
  return (
    <Dialog
      open={open}
      title="Stundenstatus ändern"
      onClose={onClose}
      confirmLabel="Bewusst fortfahren"
      onConfirm={async () => {
        await lessonService.changeStatus(lesson.id, next);
        onClose();
        onSaved();
      }}
    >
      <SelectField
        id="lesson-status"
        label="Neuer Status"
        value={next}
        onChange={(e) => setNext(e.target.value as LessonStatus)}
      >
        {LESSON_STATUSES.filter((v) =>
          LESSON_TRANSITIONS[lesson.status].includes(v),
        ).map((v) => (
          <option key={v} value={v}>
            {LESSON_STATUS_LABELS[v]}
          </option>
        ))}
      </SelectField>
      {warnings && (
        <p className="quiet-notice">
          Lernziel oder Sicherung sind noch offen. Du kannst die Stunde trotzdem
          bewusst als einsatzbereit markieren.
        </p>
      )}
    </Dialog>
  );
}
function ReflectionDialog({
  open,
  onClose,
  lessonId,
  reflection,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  lessonId: string;
  reflection?: import("../../domain").LessonReflection | undefined;
  onSaved: () => void;
}) {
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await lessonService.saveReflection(lessonId, {
      workedWell: String(f.get("worked")),
      nextTimeChange: String(f.get("change")),
      actualDurationMinutes: Number(f.get("duration")) || undefined,
      followUp: String(f.get("follow")),
    });
    onClose();
    onSaved();
  }
  return (
    <Dialog
      open={open}
      title="Stunde kurz reflektieren"
      onClose={onClose}
      confirmLabel="Reflexion speichern"
      onConfirm={() =>
        document
          .querySelector<HTMLFormElement>("#reflection-form")
          ?.requestSubmit()
      }
    >
      <form id="reflection-form" className="domain-form" onSubmit={submit}>
        <TextAreaField
          id="worked"
          name="worked"
          label="Was hat gut funktioniert?"
          defaultValue={reflection?.workedWell}
        />
        <TextAreaField
          id="change"
          name="change"
          label="Was würde ich beim nächsten Mal anders machen?"
          defaultValue={reflection?.nextTimeChange}
        />
        <TextField
          id="actual-duration"
          name="duration"
          label="Tatsächlicher Zeitbedarf"
          type="number"
          min="1"
          defaultValue={reflection?.actualDurationMinutes}
        />
        <TextAreaField
          id="follow"
          name="follow"
          label="Nächster fachlicher Schritt"
          defaultValue={reflection?.followUp}
        />
      </form>
    </Dialog>
  );
}

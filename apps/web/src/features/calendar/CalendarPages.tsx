import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CalendarPlus,
} from "lucide-react";
import {
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Dialog,
  EmptyState,
  ErrorState,
  PageHeader,
  SegmentedControl,
  SelectField,
  TextAreaField,
  TextField,
} from "../../design-system/components";
import {
  CALENDAR_SEED,
  EVENT_STATUS_LABELS,
  calendarService,
  domainDb,
  nextSchoolDay,
  type CalendarEvent,
  type CalendarEventStatus,
  type TimetablePeriod,
} from "../../domain";
import { useCalendarData } from "./useCalendarData";
import "./calendar.css";

const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"],
  weekDates = [
    "2026-08-24",
    "2026-08-25",
    "2026-08-26",
    "2026-08-27",
    "2026-08-28",
  ];
const viewKey = "lehrerkompass.calendar.view";
function labelForClass(
  id: string | undefined,
  data: ReturnType<typeof useCalendarData>,
) {
  return data.domain?.classes.find((v) => v.id === id)?.label;
}
function labelForSubject(
  id: string | undefined,
  data: ReturnType<typeof useCalendarData>,
) {
  return data.domain?.subjects.find((v) => v.id === id)?.label;
}

export function CalendarPage() {
  const data = useCalendarData(),
    nav = useNavigate(),
    [params] = useSearchParams(),
    [view, setView] = useState(() =>
      localStorage.getItem(viewKey) === "Tag"
        ? "Tag"
        : typeof matchMedia!=="undefined"&&matchMedia("(max-width: 640px)").matches
          ? "Tag"
          : "Woche",
    ),
    [date, setDate] = useState(params.get("date") ?? CALENDAR_SEED.date),
    [planOpen, setPlanOpen] = useState(Boolean(params.get("lessonId"))),
    [specialOpen, setSpecialOpen] = useState(false);
  useEffect(() => localStorage.setItem(viewKey, view), [view]);
  if (data.error)
    return (
      <ErrorState title="Kalender konnte nicht geladen werden">
        {data.error}
      </ErrorState>
    );
  if (!data.data || !data.domain || !data.lessons)
    return <p role="status">Stundenplan wird geladen …</p>;
  const unscheduled = data.lessons.lessons
    .filter(
      (v) =>
        ![...data.data!.events].some(
          (e) => e.lessonId === v.id && ["planned", "moved"].includes(e.status),
        ) &&
        !v.archivedAt &&
        ["draft", "planning", "ready"].includes(v.status),
    )
    .slice(0, 4);
  return (
    <div className="calendar-page">
      <PageHeader
        title="Stundenplan"
        description="Plane deine Unterrichtszeit und verbinde sie mit vorbereiteten Stunden."
        action={
          <Button onClick={() => setPlanOpen(true)}>
            <CalendarPlus aria-hidden />
            Unterrichtsstunde einplanen
          </Button>
        }
      />
      <div className="calendar-actions">
        <Button
          variant="secondary"
          onClick={() => nav(`/tagesuebersicht/${date}`)}
        >
          Tagesübersicht
        </Button>
        <Button
          variant="ghost"
          onClick={() => nav("/stundenplan/einstellungen")}
        >
          Stundenplan bearbeiten
        </Button>
        <Button variant="ghost" onClick={() => setSpecialOpen(true)}>
          Schulischen Termin anlegen
        </Button>
      </div>
      <SegmentedControl
        label="Kalenderansicht"
        options={["Woche", "Tag"]}
        value={view}
        onChange={setView}
      />
      {view === "Woche" ? (
        <WeekView data={data} />
      ) : (
        <DayView data={data} date={date} onDate={setDate} />
      )}
      <section>
        <h2>Noch nicht eingeplant</h2>
        {unscheduled.length ? (
          <div className="unscheduled-list">
            {unscheduled.map((l) => (
              <Card key={l.id}>
                <div>
                  <h3>{l.title}</h3>
                  <p>
                    {l.plannedDurationMinutes} Minuten ·{" "}
                    {l.status === "ready" ? "Einsatzbereit" : "In Planung"}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    params.set("lessonId", l.id);
                    setPlanOpen(true);
                  }}
                >
                  Einplanen
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Alle vorbereiteten Stunden sind eingeplant."
            description="Neue Entwürfe erscheinen hier, sobald sie noch keinen aktiven Termin haben."
          />
        )}
      </section>
      <PlanLessonDialog
        open={planOpen}
        onClose={() => setPlanOpen(false)}
        data={data}
        {...(params.get("lessonId")
          ? { initialLessonId: params.get("lessonId")! }
          : {})}
      />
      <SpecialEventDialog
        open={specialOpen}
        onClose={() => setSpecialOpen(false)}
        data={data}
      />
    </div>
  );
}

function WeekView({ data }: { data: ReturnType<typeof useCalendarData> }) {
  return (
    <section aria-labelledby="week-heading">
      <h2 id="week-heading">Woche vom 24. bis 28. August 2026</h2>
      <div className="calendar-week">
        {weekDates.map((date, day) => (
          <section
            className="calendar-day-column"
            key={date}
            aria-labelledby={`day-${day}`}
          >
            <h3 id={`day-${day}`}>
              {weekdays[day]}
              <small> {date.split("-").reverse().join(".")}</small>
            </h3>
            {data
              .data!.periods.filter((p) => p.isActive)
              .sort((a, b) => a.position - b.position)
              .map((p) => {
                const event = data.data!.events.find(
                    (e) =>
                      e.date === date &&
                      e.periodId === p.id &&
                      !e.archivedAt &&
                      e.status !== "moved",
                  ),
                  slot = data.data!.slots.find(
                    (s) =>
                      s.weekday === day + 1 &&
                      s.periodId === p.id &&
                      s.status === "active",
                  );
                return (
                  <Card
                    key={p.id}
                    className={`calendar-cell ${!event && !slot ? "calendar-cell--free" : ""}`}
                  >
                    <span className="calendar-time">
                      {p.label} · {p.startsAt}
                    </span>
                    {event ? (
                      <EventCard event={event} data={data} />
                    ) : slot ? (
                      <>
                        <strong>
                          {labelForSubject(slot.subjectId, data)} · Klasse{" "}
                          {labelForClass(slot.classId, data)}
                        </strong>
                        <span>Fester Stundenplan · noch ohne Termin</span>
                      </>
                    ) : (
                      <span>Frei</span>
                    )}
                  </Card>
                );
              })}
          </section>
        ))}
      </div>
    </section>
  );
}

function DayView({
  data,
  date,
  onDate,
}: {
  data: ReturnType<typeof useCalendarData>;
  date: string;
  onDate: (v: string) => void;
}) {
  const events = data.data!.events.filter(
    (e) => e.date === date && !e.archivedAt && e.status !== "moved",
  );
  return (
    <section>
      <div className="calendar-toolbar">
        <Button
          variant="ghost"
          aria-label="Vorheriger Schultag"
          onClick={() => onDate(nextSchoolDay(date, -1))}
        >
          <ArrowLeft aria-hidden />
        </Button>
        <Button variant="secondary" onClick={() => onDate(CALENDAR_SEED.date)}>
          Heute
        </Button>
        <TextField
          id="calendar-date"
          label="Schultag"
          type="date"
          value={date}
          onChange={(e) => onDate(e.target.value)}
        />
        <Button
          variant="ghost"
          aria-label="Nächster Schultag"
          onClick={() => onDate(nextSchoolDay(date, 1))}
        >
          <ArrowRight aria-hidden />
        </Button>
      </div>
      <h2>Tagesansicht {date.split("-").reverse().join(".")}</h2>
      <div className="day-list">
        {data
          .data!.periods.filter((p) => p.isActive)
          .sort((a, b) => a.position - b.position)
          .map((p) => {
            const event = events.find((e) => e.periodId === p.id),
              slot = data.data!.slots.find(
                (s) =>
                  s.weekday === new Date(`${date}T12:00:00`).getDay() &&
                  s.periodId === p.id &&
                  s.status === "active",
              );
            return (
              <Card key={p.id} className="calendar-cell">
                <span className="calendar-time">
                  {p.startsAt}–{p.endsAt}
                </span>
                {event ? (
                  <EventCard event={event} data={data} />
                ) : slot ? (
                  <>
                    <strong>
                      {labelForSubject(slot.subjectId, data)} · Klasse{" "}
                      {labelForClass(slot.classId, data)}
                    </strong>
                    <span>Noch kein konkreter Termin</span>
                  </>
                ) : (
                  <span>Frei</span>
                )}
              </Card>
            );
          })}
      </div>
    </section>
  );
}

function EventCard({
  event,
  data,
}: {
  event: CalendarEvent;
  data: ReturnType<typeof useCalendarData>;
}) {
  return (
    <>
      <strong>{event.title}</strong>
      <span>
        {event.classId ? `Klasse ${labelForClass(event.classId, data)} · ` : ""}
        {labelForSubject(event.subjectId, data)}
      </span>
      <Badge tone={event.status === "cancelled" ? "warning" : "info"}>
        {EVENT_STATUS_LABELS[event.status]}
      </Badge>
      <Link className="button-link" to={`/kalender/termine/${event.id}`}>
        Termin öffnen
      </Link>
    </>
  );
}

function PlanLessonDialog({
  open,
  onClose,
  data,
  initialLessonId,
}: {
  open: boolean;
  onClose: () => void;
  data: ReturnType<typeof useCalendarData>;
  initialLessonId?: string;
}) {
  const [lessonId, setLessonId] = useState(initialLessonId ?? ""),
    [date, setDate] = useState(CALENDAR_SEED.date),
    [periodId, setPeriodId] = useState("period-2"),
    [error, setError] = useState("");
  useEffect(() => {
    if (initialLessonId) setLessonId(initialLessonId);
  }, [initialLessonId]);
  const lesson = data.lessons?.lessons.find((v) => v.id === lessonId);
  return (
    <Dialog
      open={open}
      title="Unterrichtsstunde einplanen"
      onClose={onClose}
      confirmLabel="Termin verbindlich anlegen"
      onConfirm={async () => {
        try {
          if (!lesson) throw new Error("Wähle eine Unterrichtsstunde.");
          const implementation = await domainDb.seriesImplementations.get(lesson.implementationId);
          const template = implementation
            ? await domainDb.seriesTemplates.get(implementation.templateId)
            : undefined;
          const topic = template
            ? data.domain?.topics.find((v) => v.id === template.topicId)
            : undefined;
          await calendarService.createEvent({
            schoolYearId: implementation!.schoolYearId,
            date,
            periodId,
            classId: implementation!.classId,
            subjectId: topic!.subjectId,
            lessonId: lesson.id,
            title: lesson.title,
            eventType: "lesson",
          });
          onClose();
          await data.refresh();
        } catch (e) {
          setError(
            e instanceof Error
              ? e.message
              : "Termin konnte nicht angelegt werden.",
          );
        }
      }}
    >
      <div className="domain-form">
        <SelectField
          id="plan-lesson"
          label="Unterrichtsstunde"
          value={lessonId}
          onChange={(e) => setLessonId(e.target.value)}
        >
          <option value="">Bitte wählen</option>
          {data.lessons?.lessons
            .filter((v) => !v.archivedAt)
            .map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
        </SelectField>
        <TextField
          id="plan-date"
          label="Datum"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <SelectField
          id="plan-period"
          label="Unterrichtsblock"
          value={periodId}
          onChange={(e) => setPeriodId(e.target.value)}
        >
          {data.data?.periods
            .filter((v) => v.isActive)
            .map((v) => (
              <option key={v.id} value={v.id}>
                {v.label} · {v.startsAt}–{v.endsAt}
              </option>
            ))}
        </SelectField>
        {error && (
          <p role="alert" className="quiet-notice">
            {error}
          </p>
        )}
        <p>Die Unterrichtsplanung und ihre Phasen bleiben unverändert.</p>
      </div>
    </Dialog>
  );
}

function SpecialEventDialog({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: ReturnType<typeof useCalendarData>;
}) {
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await calendarService.createEvent({
      schoolYearId: "year-2026",
      date: String(f.get("date")),
      periodId: String(f.get("period")),
      title: String(f.get("title")),
      location: String(f.get("location")),
      notes: String(f.get("notes")),
      eventType: String(f.get("type")) as
        | "school_event"
        | "assessment"
        | "organization",
    });
    onClose();
    await data.refresh();
  }
  return (
    <Dialog
      open={open}
      title="Schulischen Termin anlegen"
      onClose={onClose}
      confirmLabel="Termin anlegen"
      onConfirm={() =>
        document
          .querySelector<HTMLFormElement>("#special-event-form")
          ?.requestSubmit()
      }
    >
      <form id="special-event-form" className="domain-form" onSubmit={submit}>
        <TextField id="special-title" name="title" label="Titel" required />
        <TextField
          id="special-date"
          name="date"
          label="Datum"
          type="date"
          defaultValue="2026-08-27"
        />
        <SelectField
          id="special-period"
          name="period"
          label="Unterrichtsblock"
          defaultValue="period-3"
        >
          {data.data?.periods.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </SelectField>
        <SelectField
          id="special-type"
          name="type"
          label="Terminart"
          defaultValue="school_event"
        >
          <option value="school_event">Schulischer Termin</option>
          <option value="assessment">Lernzielkontrolle</option>
          <option value="organization">Schulische Organisation</option>
        </SelectField>
        <TextField
          id="special-location"
          name="location"
          label="Ort (optional)"
        />
        <TextAreaField
          id="special-notes"
          name="notes"
          label="Organisatorische Notiz (optional)"
        />
        <p>Private Termine gehören nicht in LehrerKompass.</p>
      </form>
    </Dialog>
  );
}

export function EventPage() {
  const { eventId } = useParams(),
    data = useCalendarData(),
    nav = useNavigate(),
    [move, setMove] = useState(false),
    [cancel, setCancel] = useState(false),
    [complete, setComplete] = useState(false);
  if (!data.data) return <p role="status">Termin wird geladen …</p>;
  const event = data.data.events.find((v) => v.id === eventId);
  if (!event)
    return (
      <ErrorState title="Termin nicht gefunden">
        Der Kalenderverweis ist nicht mehr gültig.
      </ErrorState>
    );
  const period = data.data.periods.find((v) => v.id === event.periodId);
  return (
    <div className="calendar-page">
      <Breadcrumbs
        label="Kalenderpfad"
        items={[
          { label: "Stundenplan", href: "/stundenplan" },
          { label: event.title },
        ]}
      />
      <PageHeader
        title={event.title}
        description={`${event.date.split("-").reverse().join(".")} · ${period?.startsAt ?? event.startsAt ?? "ohne Uhrzeit"}`}
        action={
          <Badge tone={event.status === "cancelled" ? "warning" : "info"}>
            {EVENT_STATUS_LABELS[event.status]}
          </Badge>
        }
      />
      <Card>
        <p>
          Klasse {labelForClass(event.classId, data) ?? "–"} ·{" "}
          {labelForSubject(event.subjectId, data) ?? "Schulischer Termin"}
        </p>
        <p>{event.location ?? "Kein Raum angegeben"}</p>
        {event.lessonId && (
          <Link to={`/stunden/${event.lessonId}`}>
            Unterrichtsstunde öffnen
          </Link>
        )}
      </Card>
      {["planned", "moved"].includes(event.status) && (
        <div className="event-actions">
          <Button onClick={() => setMove(true)}>Verschieben</Button>
          <Button variant="secondary" onClick={() => setCancel(true)}>
            Termin fällt aus
          </Button>
          <Button variant="secondary" onClick={() => setComplete(true)}>
            Als durchgeführt markieren
          </Button>
        </div>
      )}
      <MoveDialog
        open={move}
        onClose={() => setMove(false)}
        event={event}
        data={data}
        onMoved={(id) => nav(`/kalender/termine/${id}`)}
      />
      <ConfirmStatusDialog
        open={cancel}
        onClose={() => setCancel(false)}
        event={event}
        status="cancelled"
        data={data}
      />
      <ConfirmStatusDialog
        open={complete}
        onClose={() => setComplete(false)}
        event={event}
        status="completed"
        data={data}
      />
    </div>
  );
}

function MoveDialog({
  open,
  onClose,
  event,
  data,
  onMoved,
}: {
  open: boolean;
  onClose: () => void;
  event: CalendarEvent;
  data: ReturnType<typeof useCalendarData>;
  onMoved: (id: string) => void;
}) {
  const [date, setDate] = useState(nextSchoolDay(event.date, 1)),
    [period, setPeriod] = useState(event.periodId ?? "period-1"),
    [error, setError] = useState("");
  return (
    <Dialog
      open={open}
      title="Termin verschieben"
      onClose={onClose}
      confirmLabel="Verschiebung bestätigen"
      onConfirm={async () => {
        try {
          const id = await calendarService.moveEvent(event.id, {
            date,
            periodId: period,
          });
          onClose();
          onMoved(id);
        } catch (e) {
          setError(
            e instanceof Error
              ? e.message
              : "Termin konnte nicht verschoben werden.",
          );
        }
      }}
    >
      <TextField
        id="move-date"
        label="Neues Datum"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <SelectField
        id="move-period"
        label="Neuer Unterrichtsblock"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
      >
        {data.data?.periods
          .filter((v) => v.isActive)
          .map((v) => (
            <option value={v.id} key={v.id}>
              {v.label}
            </option>
          ))}
      </SelectField>
      {error && (
        <p role="alert" className="quiet-notice">
          {error}
        </p>
      )}
      <p>
        Nur der Termin wird verschoben. Planung und Phasen bleiben unverändert.
      </p>
    </Dialog>
  );
}

function ConfirmStatusDialog({
  open,
  onClose,
  event,
  status,
  data,
}: {
  open: boolean;
  onClose: () => void;
  event: CalendarEvent;
  status: "cancelled" | "completed";
  data: ReturnType<typeof useCalendarData>;
}) {
  const [alsoLesson, setAlsoLesson] = useState(false);
  return (
    <Dialog
      open={open}
      title={status === "cancelled" ? "Termin fällt aus" : "Termin durchführen"}
      onClose={onClose}
      confirmLabel={
        status === "cancelled"
          ? "Als ausgefallen markieren"
          : "Als durchgeführt markieren"
      }
      onConfirm={async () => {
        await calendarService.changeStatus(event.id, status, alsoLesson);
        onClose();
        await data.refresh();
      }}
    >
      <p>
        {status === "cancelled"
          ? "Der Termin wird als ausgefallen markiert. Die Unterrichtsstunde und ihre Planung bleiben erhalten."
          : "Der Kalendereintrag wird als durchgeführt markiert."}
      </p>
      {status === "cancelled" ? (
        <p>
          Die Stunde bleibt ungeplant und kann später bewusst neu terminiert
          werden.
        </p>
      ) : (
        event.lessonId && (
          <label>
            <input
              type="checkbox"
              checked={alsoLesson}
              onChange={(e) => setAlsoLesson(e.target.checked)}
            />{" "}
            Zugehörige Unterrichtsstunde ebenfalls als durchgeführt markieren
          </label>
        )
      )}
    </Dialog>
  );
}

export function CalendarSettingsPage() {
  const data = useCalendarData(),
    [periodOpen, setPeriodOpen] = useState(false),
    [editingPeriod,setEditingPeriod]=useState<TimetablePeriod>(),
    [slotOpen, setSlotOpen] = useState(false),
    [error, setError] = useState("");
  if (!data.data) return <p role="status">Einstellungen werden geladen …</p>;
  return (
    <div className="calendar-page">
      <Breadcrumbs
        label="Stundenplanpfad"
        items={[
          { label: "Stundenplan", href: "/stundenplan" },
          { label: "Einstellungen" },
        ]}
      />
      <PageHeader
        title="Stundenplan bearbeiten"
        description="Unterrichtszeiten und feste Wochenstruktur ruhig verwalten."
      />
      <div className="calendar-settings-grid">
        <section>
          <div className="section-title">
            <h2>Unterrichtsblöcke</h2>
            <Button onClick={() => setPeriodOpen(true)}>Block anlegen</Button>
          </div>
          <div className="settings-list">
            {data.data.periods
              .sort((a, b) => a.position - b.position)
              .map((p, i) => (
                <Card key={p.id}>
                  <div>
                    <h3>{p.label}</h3>
                    <p>
                      {p.startsAt}–{p.endsAt} ·{" "}
                      {p.isActive ? "Aktiv" : "Inaktiv"}
                    </p>
                  </div>
                  <div className="period-actions">
                    <Button
                      variant="ghost"
                      aria-label={`${p.label} nach oben`}
                      disabled={!i}
                      onClick={async () => {
                        await calendarService.reorderPeriod(p.id, -1);
                        data.refresh();
                      }}
                    >
                      <ArrowUp aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      aria-label={`${p.label} nach unten`}
                      disabled={i === data.data!.periods.length - 1}
                      onClick={async () => {
                        await calendarService.reorderPeriod(p.id, 1);
                        data.refresh();
                      }}
                    >
                      <ArrowDown aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={async () => {
                        try {
                          await calendarService.updatePeriod(p.id, {
                            isActive: !p.isActive,
                          });
                          await data.refresh();
                        } catch (e) {
                          setError(e instanceof Error ? e.message : "");
                        }
                      }}
                    >
                      {p.isActive ? "Deaktivieren" : "Aktivieren"}
                    </Button>
                    <Button variant="ghost" onClick={()=>setEditingPeriod(p)}>Bearbeiten</Button>
                  </div>
                </Card>
              ))}
          </div>
        </section>
        <section>
          <div className="section-title">
            <h2>Fester Wochenstundenplan</h2>
            <Button onClick={() => setSlotOpen(true)}>Slot ergänzen</Button>
          </div>
          {error && (
            <p role="alert" className="quiet-notice">
              {error}
            </p>
          )}
          <div className="settings-list">
            {data.data.slots.map((s) => (
              <Card key={s.id}>
                <h3>
                  {weekdays[s.weekday - 1]} ·{" "}
                  {data.data!.periods.find((p) => p.id === s.periodId)?.label}
                </h3>
                <p>
                  {labelForSubject(s.subjectId, data)} · Klasse{" "}
                  {labelForClass(s.classId, data)} · {s.room}
                </p>
                <Button variant="ghost" onClick={async()=>{await calendarService.updateSlot(s.id,{status:s.status==="active"?"inactive":"active"});await data.refresh()}}>{s.status==="active"?"Deaktivieren":"Aktivieren"}</Button>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <PeriodDialog
        open={periodOpen}
        onClose={() => setPeriodOpen(false)}
        data={data}
      />
      <PeriodDialog open={Boolean(editingPeriod)} onClose={()=>setEditingPeriod(undefined)} data={data} period={editingPeriod}/>
      <SlotDialog
        open={slotOpen}
        onClose={() => setSlotOpen(false)}
        data={data}
      />
    </div>
  );
}

function PeriodDialog({
  open,
  onClose,
  data,
  period,
}: {
  open: boolean;
  onClose: () => void;
  data: ReturnType<typeof useCalendarData>;
  period?:TimetablePeriod|undefined;
}) {
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      const value={label:String(f.get("label")),startsAt:String(f.get("start")),endsAt:String(f.get("end"))};
      if(period)await calendarService.updatePeriod(period.id,value);else await calendarService.createPeriod(value);
      onClose();
      await data.refresh();
    } catch (x) {
      setError(x instanceof Error ? x.message : "");
    }
  }
  return (
    <Dialog
      open={open}
      title={period?"Unterrichtsblock bearbeiten":"Unterrichtsblock anlegen"}
      onClose={onClose}
      confirmLabel={period?"Änderungen speichern":"Block anlegen"}
      onConfirm={() =>
        document.querySelector<HTMLFormElement>("#period-form")?.requestSubmit()
      }
    >
      <form id="period-form" className="domain-form" onSubmit={submit}>
        <TextField
          id="period-label"
          name="label"
          label="Bezeichnung"
          required defaultValue={period?.label}
        />
        <TextField
          id="period-start"
          name="start"
          label="Beginn"
          type="time"
          required defaultValue={period?.startsAt}
        />
        <TextField
          id="period-end"
          name="end"
          label="Ende"
          type="time"
          required defaultValue={period?.endsAt}
        />
        {error && <p role="alert">{error}</p>}
      </form>
    </Dialog>
  );
}
function SlotDialog({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: ReturnType<typeof useCalendarData>;
}) {
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      await calendarService.createSlot({
        schoolYearId: "year-2026",
        weekday: Number(f.get("weekday")) as 1 | 2 | 3 | 4 | 5,
        periodId: String(f.get("period")),
        classId: String(f.get("class")),
        subjectId: String(f.get("subject")),
        room: String(f.get("room")),
      });
      onClose();
      await data.refresh();
    } catch (x) {
      setError(x instanceof Error ? x.message : "");
    }
  }
  return (
    <Dialog
      open={open}
      title="Wochenstunde ergänzen"
      onClose={onClose}
      confirmLabel="Slot ergänzen"
      onConfirm={() =>
        document.querySelector<HTMLFormElement>("#slot-form")?.requestSubmit()
      }
    >
      <form id="slot-form" className="domain-form" onSubmit={submit}>
        <SelectField id="slot-weekday" name="weekday" label="Wochentag">
          {weekdays.map((v, i) => (
            <option key={v} value={i + 1}>
              {v}
            </option>
          ))}
        </SelectField>
        <SelectField id="slot-period" name="period" label="Unterrichtsblock">
          {data.data?.periods
            .filter((v) => v.isActive)
            .map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
        </SelectField>
        <SelectField id="slot-class" name="class" label="Klasse">
          {data.domain?.classes
            .filter((v) => v.isActive)
            .map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
        </SelectField>
        <SelectField id="slot-subject" name="subject" label="Fach">
          {data.domain?.subjects.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </SelectField>
        <TextField
          id="slot-room"
          name="room"
          label="Raum oder Kurzbezeichnung"
        />
        {error && <p role="alert">{error}</p>}
      </form>
    </Dialog>
  );
}

export function DayOverviewPage({
  substitute = false,
}: {
  substitute?: boolean;
}) {
  const { date = CALENDAR_SEED.date } = useParams(),
    data = useCalendarData(),
    [rows, setRows] =
      useState<Awaited<ReturnType<typeof calendarService.dayOverview>>>();
  useEffect(() => {
    if(data.data)void calendarService.dayOverview(date, substitute).then(setRows);
  }, [date, substitute,data.data]);
  if (!data.data || !rows)
    return <p role="status">Tagesübersicht wird geladen …</p>;
  return (
    <div className="calendar-page">
      <Breadcrumbs
        label="Übersichtspfad"
        items={[
          { label: "Stundenplan", href: "/stundenplan" },
          { label: substitute ? "Vertretungsübersicht" : "Tagesübersicht" },
        ]}
      />
      <PageHeader
        title={substitute ? "Vertretungsübersicht" : "Tagesübersicht"}
        description={date.split("-").reverse().join(".")}
      />
      {substitute && (
        <p className="privacy-notice">
          <strong>Für die Weitergabe reduzierte Ansicht.</strong> Persönliche
          Reflexionen, private Notizen und sensible Förderinformationen sind
          ausgeschlossen.
        </p>
      )}
      <div className="day-list">
        {rows.length ? (
          rows.map((r) => (
            <Card key={r.eventId}>
              <div>
                <span className="calendar-time">{r.time}</span>
                <h2>{r.title}</h2>
                <p>
                  {r.classLabel && `Klasse ${r.classLabel} · `}
                  {r.subjectLabel}
                  {r.topic && ` · ${r.topic}`}
                </p>
                <Badge tone="info">{EVENT_STATUS_LABELS[r.status]}</Badge>
              </div>
              {r.lessonGoal && (
                <p>
                  <strong>Lernziel:</strong> {r.lessonGoal}
                </p>
              )}
              {r.phases.length > 0 && (
                <ul className="overview-phases">
                  {r.phases.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              )}
              {r.materialNeeds && (
                <p>
                  <strong>Materialbedarf:</strong> {r.materialNeeds}
                </p>
              )}
              {r.preparation && (
                <p>
                  <strong>Vorbereitung:</strong> {r.preparation}
                </p>
              )}
              {r.homework && (
                <p>
                  <strong>Hausaufgabe:</strong> {r.homework}
                </p>
              )}
              {r.organizational && (
                <p>
                  <strong>Organisatorisch:</strong> {r.organizational}
                </p>
              )}
            </Card>
          ))
        ) : (
          <EmptyState
            title="Für diesen Tag gibt es keine Termine."
            description="Wähle im Stundenplan einen anderen Schultag."
          />
        )}
      </div>
      {!substitute && (
        <Link className="button-link" to={`/vertretungsuebersicht/${date}`}>
          Vertretungsübersicht öffnen
        </Link>
      )}
    </div>
  );
}

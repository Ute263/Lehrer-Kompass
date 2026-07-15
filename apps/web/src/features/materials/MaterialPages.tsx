import { useEffect, useState, type FormEvent } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ArrowDown, ArrowUp, Copy, Plus, RotateCcw } from "lucide-react";
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
  BLOCK_TYPES,
  MATERIAL_SEED,
  MATERIAL_STATUS_LABELS,
  MATERIAL_TRANSITIONS,
  MATERIAL_TYPES,
  VARIANT_TYPES,
  layoutIssues,
  materialService,
  domainDb,
  type MaterialBlock,
  type MaterialBlockType,
  type MaterialPage,
  type MaterialStatus,
} from "../../domain";
import { useMaterialData } from "./useMaterialData";
import "./materials.css";
const blockLabels: Record<MaterialBlockType, string> = {
  heading: "Überschrift",
  instruction: "Arbeitsauftrag",
  text: "Text",
  task: "Aufgabe",
  image: "Bild",
  table: "Tabelle",
  writing_lines: "Schreiblinien",
  math_grid: "Rechenraster",
  answer_field: "Antwortfeld",
  card_grid: "Kartenraster",
  page_break: "Seitenumbruch",
  footer: "Fußzeile",
};

export function NewMaterialPage() {
  const nav = useNavigate(),
    [params] = useSearchParams(),
    data = useMaterialData(),
    lessonId = params.get("lessonId") ?? undefined;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      lesson = lessonId ? await domainDb.lessons.get(lessonId) : undefined,
      impl = lesson
        ? await domainDb.seriesImplementations.get(lesson.implementationId)
        : undefined,
      template = impl
        ? await domainDb.seriesTemplates.get(impl.templateId)
        : undefined,
      topic = template
        ? data.domain?.topics.find((v) => v.id === template.topicId)
        : undefined;
    const id = await materialService.create({
      title: String(f.get("title")),
      materialType: String(f.get("type")) as (typeof MATERIAL_TYPES)[number],
      variantType: String(f.get("variant")) as (typeof VARIANT_TYPES)[number],
      variantLabel: String(f.get("label")),
      pageFormat: String(f.get("format")) as "A4_PORTRAIT" | "A4_LANDSCAPE",
      ...(lesson && impl && topic
        ? {
            lessonId: lesson.id,
            implementationId: impl.id,
            templateId: template!.id,
            topicId: topic.id,
            classId: impl.classId,
            subjectId: topic.subjectId,
          }
        : {}),
      targetGroup: String(f.get("target")),
      ...(Number(f.get("minutes"))
        ? { estimatedWorkingMinutes: Number(f.get("minutes")) }
        : {}),
    });
    nav(`/materialien/${id}`);
  }
  return (
    <div className="material-workshop">
      <Breadcrumbs
        label="Materialpfad"
        items={[
          ...(lessonId
            ? [{ label: "Unterrichtsstunde", href: `/stunden/${lessonId}` }]
            : []),
          { label: "Neues Material" },
        ]}
      />
      <PageHeader
        title={
          lessonId
            ? "Material aus Unterrichtsstunde anlegen"
            : "Eigenständiges Material anlegen"
        }
        description="Lege Struktur und Kontext bewusst fest. Es werden keine Inhalte automatisch erzeugt."
      />
      <Card>
        <form className="domain-form" onSubmit={submit} id="new-material-form">
          <TextField
            id="material-title"
            name="title"
            label="Materialtitel"
            required
          />
          <SelectField
            id="material-type"
            name="type"
            label="Materialart"
            defaultValue="worksheet"
          >
            {MATERIAL_TYPES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </SelectField>
          <SelectField
            id="material-variant"
            name="variant"
            label="Variante"
            defaultValue="standard"
          >
            {VARIANT_TYPES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </SelectField>
          <TextField
            id="variant-label"
            name="label"
            label="Sichtbarer Variantenname"
            defaultValue="Standard"
          />
          <SelectField
            id="page-format"
            name="format"
            label="Seitenformat"
            defaultValue="A4_PORTRAIT"
          >
            <option value="A4_PORTRAIT">A4 Hochformat</option>
            <option value="A4_LANDSCAPE">A4 Querformat</option>
          </SelectField>
          <TextField
            id="target-group"
            name="target"
            label="Zielgruppe (optional)"
          />
          <TextField
            id="working-minutes"
            name="minutes"
            label="Geschätzte Bearbeitungszeit"
            type="number"
            min="1"
          />
          <p>
            {lessonId
              ? "Klasse, Fach, Thema, Reihe und Stunde werden als IDs übernommen."
              : "Das Material wird bewusst ohne Pflichtkontext angelegt."}
          </p>
          <Button type="submit">Materialwerkstatt öffnen</Button>
        </form>
      </Card>
    </div>
  );
}

export function MaterialWorkshopPage() {
  const { materialId } = useParams(),
    data = useMaterialData(),
    nav = useNavigate(),
    [pageId, setPageId] = useState<string>(),
    [blockId, setBlockId] = useState<string>(),
    [addOpen, setAddOpen] = useState(false),
    [variantOpen, setVariantOpen] = useState(false),
    [linkOpen, setLinkOpen] = useState(false),
    [statusOpen, setStatusOpen] = useState(false),
    [undoNotice, setUndoNotice] = useState(false);
  if (data.error)
    return (
      <ErrorState title="Material konnte nicht geladen werden">
        {data.error}
      </ErrorState>
    );
  if (!data.data || !data.domain)
    return <p role="status">Materialwerkstatt wird geladen …</p>;
  const material = data.data.materials.find((v) => v.id === materialId);
  if (!material)
    return (
      <ErrorState title="Material nicht gefunden">
        Der Materialverweis ist nicht mehr gültig. Andere Materialien bleiben
        erhalten.
      </ErrorState>
    );
  const family = data.data.families.find((v) => v.id === material.familyId)!,
    variant = data.data.variants.find((v) => v.materialId === material.id)!,
    doc = data.data.documents.find((v) => v.materialId === material.id)!,
    pages = data.data.pages
      .filter((v) => v.documentId === doc.id && !v.archivedAt)
      .sort((a, b) => a.position - b.position),
    activePage =
      pages.find((v) => v.id === (pageId ?? pages[0]?.id)) ?? pages[0],
    blocks = data.data.blocks
      .filter((v) => v.pageId === activePage?.id && !v.archivedAt)
      .sort((a, b) => a.position - b.position),
    selected = blocks.find((v) => v.id === blockId),
    solutions = data.data.solutions,
    issues = layoutIssues(blocks, solutions),
    c = data.domain.classes.find((v) => v.id === material.classId),
    subject = data.domain.subjects.find((v) => v.id === material.subjectId),
    topic = data.domain.topics.find((v) => v.id === material.topicId);
  return (
    <div className="material-workshop">
      <Breadcrumbs
        label="Materialpfad"
        items={[
          ...(c
            ? [{ label: `Klasse ${c.label}`, href: `/klassen/${c.id}` }]
            : []),
          ...(subject ? [{ label: subject.label }] : []),
          ...(topic ? [{ label: topic.title }] : []),
          ...(material.lessonId
            ? [
                {
                  label: "Unterrichtsstunde",
                  href: `/stunden/${material.lessonId}`,
                },
              ]
            : []),
          { label: material.title },
        ]}
      />
      <PageHeader
        title={material.title}
        description={`${material.materialType} · ${variant.label} · ${c ? `Klasse ${c.label}` : "Eigenständig"}`}
        action={
          <Button onClick={() => nav(`/materialien/${material.id}/vorschau`)}>
            Vorschau prüfen
          </Button>
        }
      />
      <div className="workshop-actions">
        <Badge tone="info">{MATERIAL_STATUS_LABELS[material.status]}</Badge>
        <Button variant="secondary" onClick={() => setVariantOpen(true)}>
          Variante erstellen
        </Button>
        <Button variant="secondary" onClick={() => setLinkOpen(true)}>
          Verknüpfen
        </Button>
        <Button variant="ghost" onClick={() => setStatusOpen(true)}>
          Status ändern
        </Button>
        <Button
          variant="ghost"
          onClick={async () => {
            await materialService.archive(material.id);
            await data.refresh();
          }}
        >
          Archivieren
        </Button>
        <Link
          className="button-link"
          to={`/materialien/${material.id}/varianten`}
        >
          Materialfamilie
        </Link>
      </div>
      {undoNotice && (
        <Card>
          <span>Block wurde entfernt.</span>
          <Button
            variant="ghost"
            onClick={async () => {
              await materialService.undoLast();
              setUndoNotice(false);
              await data.refresh();
            }}
          >
            <RotateCcw aria-hidden />
            Rückgängig
          </Button>
        </Card>
      )}
      <div className="workshop-grid">
        <aside className="page-sidebar" aria-label="Seitenübersicht">
          <div className="section-title">
            <h2>Seiten</h2>
            <Button
              variant="ghost"
              aria-label="Seite hinzufügen"
              onClick={async () => {
                const id = await materialService.addPage(material.id);
                setPageId(id);
                await data.refresh();
              }}
            >
              <Plus aria-hidden />
            </Button>
          </div>
          <ol className="page-list">
            {pages.map((p, i) => (
              <li key={p.id}>
                <Button
                  variant={p.id === activePage?.id ? "secondary" : "ghost"}
                  onClick={() => setPageId(p.id)}
                >
                  {i + 1}. {p.title ?? "Seite"} · {p.pageRole}
                </Button>
                <div className="block-actions">
                  <Button
                    variant="ghost"
                    aria-label={`${p.title ?? "Seite"} nach oben`}
                    disabled={!i}
                    onClick={async () => {
                      await materialService.reorderPage(p.id, -1);
                      await data.refresh();
                    }}
                  >
                    <ArrowUp aria-hidden />
                  </Button>
                  <Button
                    variant="ghost"
                    aria-label={`${p.title ?? "Seite"} nach unten`}
                    disabled={i === pages.length - 1}
                    onClick={async () => {
                      await materialService.reorderPage(p.id, 1);
                      await data.refresh();
                    }}
                  >
                    <ArrowDown aria-hidden />
                  </Button>
                  <Button
                    variant="ghost"
                    aria-label={`${p.title ?? "Seite"} duplizieren`}
                    onClick={async () => {
                      await materialService.duplicatePage(p.id);
                      await data.refresh();
                    }}
                  >
                    <Copy aria-hidden />
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        </aside>
        <div className="workshop-main">
          <div className="preview-banner">
            Drucknahe Arbeitsansicht · noch kein PDF- oder DOCX-Export
          </div>
          {activePage ? (
            <MaterialPageView
              page={activePage}
              blocks={blocks}
              solutions={solutions}
              selectedId={blockId}
              onSelect={setBlockId}
            />
          ) : (
            <EmptyState
              title="Keine Seite verfügbar"
              description="Lege eine Seite an."
            />
          )}
          <Button onClick={() => setAddOpen(true)}>Block hinzufügen</Button>
          <section aria-labelledby="issues-heading">
            <h2 id="issues-heading">Layout- und Prüfhilfen</h2>
            {issues.length ? (
              <div className="issue-list">
                {issues.map((v, i) => (
                  <Card
                    key={`${v.code}-${i}`}
                    className={`issue--${v.severity}`}
                  >
                    <strong>
                      {v.severity === "error" ? "Pflichtprüfung" : "Hinweis"}
                    </strong>
                    <p>{v.message}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <p>Keine strukturellen Hinweise für diese Seite.</p>
            )}
          </section>
        </div>
        <aside className="block-inspector" aria-label="Blockeinstellungen">
          <h2>Blockeinstellungen</h2>
          {selected ? (
            <BlockEditor
              block={selected}
              solution={solutions.find((s) => s.id === selected.solutionId)}
              onSaved={data.refresh}
              onRemove={async () => {
                await materialService.archiveBlock(selected.id);
                setBlockId(undefined);
                setUndoNotice(true);
                await data.refresh();
              }}
            />
          ) : (
            <p>Wähle einen Block in der Seite aus.</p>
          )}
          <span className="complex-note">
            Komplexe Tabellen- und Kartenbearbeitung ist auf kleinen
            Bildschirmen eingeschränkt.
          </span>
        </aside>
      </div>
      <AddBlockDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        pageId={activePage?.id}
        onSaved={data.refresh}
      />
      <VariantDialog
        open={variantOpen}
        onClose={() => setVariantOpen(false)}
        materialId={material.id}
        onCreated={(id) => nav(`/materialien/${id}`)}
      />
      <LinkDialog
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        materialId={material.id}
        data={data}
      />
      <StatusDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        material={material}
        onSaved={data.refresh}
      />
    </div>
  );
}

function MaterialPageView({
  page,
  blocks,
  solutions,
  selectedId,
  onSelect,
  bw = false,
}: {
  page: MaterialPage;
  blocks: MaterialBlock[];
  solutions: import("../../domain").MaterialSolution[];
  selectedId?: string | undefined;
  onSelect?: ((id: string) => void) | undefined;
  bw?: boolean | undefined;
}) {
  return (
    <article
      className={`a4-page ${bw ? "a4-page--bw" : ""}`}
      aria-label={`Materialseite ${page.position + 1}`}
    >
      <div className="material-blocks">
        {blocks.map((b) => (
          <section
            key={b.id}
            className={`material-block ${b.id === selectedId ? "material-block--selected" : ""}`}
            onClick={() => onSelect?.(b.id)}
            aria-label={`${blockLabels[b.blockType]} bearbeiten`}
          >
            {renderBlock(
              b,
              solutions.find((s) => s.id === b.solutionId),
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
function renderBlock(
  b: MaterialBlock,
  solution?: import("../../domain").MaterialSolution,
) {
  switch (b.blockType) {
    case "heading":
      return b.level === "page" ? (
        <h1>{b.text}</h1>
      ) : b.level === "subsection" ? (
        <h3>{b.text}</h3>
      ) : (
        <h2>{b.text}</h2>
      );
    case "instruction":
      return (
        <p>
          <strong>Arbeitsauftrag:</strong> {b.text}
        </p>
      );
    case "text":
      return <p>{b.text}</p>;
    case "task":
      return (
        <div>
        <h2>Aufgabe {b.taskNumber}</h2>
          <p>{b.instruction}</p>
          <p>{b.prompt}</p>
          {b.responseMode === "lines" && (
            <div className="writing-lines">
              <span />
              <span />
              <span />
            </div>
          )}
          {solution && (
            <details>
              <summary>Lösung</summary>
              <p>
                {solution.expectedAnswer} ·{" "}
                {solution.isVerified ? "Geprüft" : "Ungeprüft"}
              </p>
            </details>
          )}
        </div>
      );
    case "image":
      return (
        <figure>
          <div className="material-placeholder">Sicherer Bildplatzhalter</div>
          <figcaption>
            {b.altText || "Alt-Text fehlt"} · Rechte: {b.rightsStatus}
          </figcaption>
        </figure>
      );
    case "table":
      return (
        <table className="material-table">
          <tbody>
            {Array.from({ length: b.rows ?? 1 }, (_, r) => (
              <tr key={r}>
                {Array.from({ length: b.columns ?? 1 }, (_, c) => (
                  <td key={c}>{b.cells?.[r * (b.columns ?? 1) + c]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "writing_lines":
      return (
        <div>
          <p>{b.text}</p>
          <div className="writing-lines">
            {Array.from({ length: b.lineCount ?? 4 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>
      );
    case "math_grid":
      return (
        <div
          className="math-grid"
          style={{ gridTemplateColumns: `repeat(${b.columns ?? 5},1fr)` }}
        >
          {Array.from({ length: (b.rows ?? 5) * (b.columns ?? 5) }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      );
    case "answer_field":
      return (
        <div
          className="material-placeholder"
          style={{ minHeight: `${b.heightMm ?? 20}mm` }}
        >
          {b.text ?? "Antwort"}
        </div>
      );
    case "card_grid":
      return (
        <div
          className="card-grid"
          style={{ gridTemplateColumns: `repeat(${b.columns ?? 3},1fr)` }}
        >
          {Array.from({ length: (b.rows ?? 2) * (b.columns ?? 3) }, (_, i) => (
            <span key={i}>{b.cells?.[i]}</span>
          ))}
        </div>
      );
    case "footer":
      return (
        <footer className="material-footer">
          {b.text}
          {b.showPageNumber && " · Seite"}
        </footer>
      );
    case "page_break":
      return <hr />;
  }
}

function BlockEditor({
  block,
  solution,
  onSaved,
  onRemove,
}: {
  block: MaterialBlock;
  solution?: import("../../domain").MaterialSolution | undefined;
  onSaved: () => void;
  onRemove: () => void;
}) {
  const [text, setText] = useState(block.text ?? block.instruction ?? ""),
    [rows, setRows] = useState(block.rows ?? 3),
    [columns, setColumns] = useState(block.columns ?? 3),
    [alt, setAlt] = useState(block.altText ?? ""),
    [rights, setRights] = useState(block.rightsStatus ?? "unknown");
  useEffect(() => {
    setText(block.text ?? block.instruction ?? "");
    setRows(block.rows ?? 3);
    setColumns(block.columns ?? 3);
    setAlt(block.altText ?? "");
    setRights(block.rightsStatus ?? "unknown");
  }, [block]);
  return (
    <div className="domain-form">
      <strong>{blockLabels[block.blockType]}</strong>
      {["heading", "instruction", "text", "task", "footer"].includes(
        block.blockType,
      ) && (
        <TextAreaField
          id="block-text"
          label={block.blockType === "task" ? "Aufgabenstellung" : "Text"}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}{" "}
      {block.blockType === "image" && (
        <>
          <TextAreaField
            id="block-alt"
            label="Alt-Text"
            required
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />
          <SelectField
            id="block-rights"
            label="Rechtestatus"
            value={rights}
            onChange={(e) => setRights(e.target.value as typeof rights)}
          >
            <option value="unknown">Unbekannt</option>
            <option value="self_created">Selbst erstellt</option>
            <option value="licensed">Lizenziert</option>
            <option value="not_applicable">Nicht anwendbar</option>
          </SelectField>
        </>
      )}
      {["table", "math_grid", "card_grid"].includes(block.blockType) && (
        <>
          <TextField
            id="block-rows"
            label="Zeilen"
            type="number"
            min="1"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
          />
          <TextField
            id="block-columns"
            label="Spalten"
            type="number"
            min="1"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
          />
        </>
      )}
      {block.blockType === "writing_lines" && (
        <TextField
          id="line-count"
          label="Anzahl Schreiblinien"
          type="number"
          min="1"
          value={block.lineCount ?? 5}
          onChange={(e) => setRows(Number(e.target.value))}
        />
      )}
      <SelectField
        id="block-width"
        label="Breite"
        defaultValue={block.widthMode}
      >
        <option value="full">Voll</option>
        <option value="wide">Breit</option>
        <option value="medium">Mittel</option>
        <option value="narrow">Schmal</option>
      </SelectField>
      <Button
        onClick={async () => {
          await materialService.updateBlock(block.id, {
            ...(block.blockType === "task" ? { instruction: text } : { text }),
            rows,
            columns,
            altText: alt,
            rightsStatus: rights,
            lineCount:
              block.blockType === "writing_lines" ? rows : block.lineCount,
          });
          await onSaved();
        }}
      >
        Änderungen speichern
      </Button>
      {block.blockType === "task" && (
        <SolutionEditor
          blockId={block.id}
          solution={solution}
          onSaved={onSaved}
        />
      )}
      <div className="block-actions">
        <Button
          variant="ghost"
          onClick={async () => {
            await materialService.reorderBlock(block.id, -1);
            await onSaved();
          }}
        >
          <ArrowUp aria-hidden />
          Nach oben
        </Button>
        <Button
          variant="ghost"
          onClick={async () => {
            await materialService.reorderBlock(block.id, 1);
            await onSaved();
          }}
        >
          <ArrowDown aria-hidden />
          Nach unten
        </Button>
        <Button
          variant="ghost"
          onClick={async () => {
            await materialService.duplicateBlock(block.id);
            await onSaved();
          }}
        >
          Duplizieren
        </Button>
        <Button variant="ghost" onClick={onRemove}>
          Entfernen
        </Button>
      </div>
    </div>
  );
}
function SolutionEditor({
  blockId,
  solution,
  onSaved,
}: {
  blockId: string;
  solution?: import("../../domain").MaterialSolution | undefined;
  onSaved: () => void;
}) {
  const [answer, setAnswer] = useState(solution?.expectedAnswer ?? ""),
    [verified, setVerified] = useState(solution?.isVerified ?? false);
  return (
    <fieldset>
      <legend>Lösung bearbeiten</legend>
      <TextAreaField
        id="solution-answer"
        label="Erwartete Lösung"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={verified}
          onChange={(e) => setVerified(e.target.checked)}
        />{" "}
        Fachlich geprüft
      </label>
      <Button
        variant="secondary"
        onClick={async () => {
          await materialService.saveSolution(blockId, {
            expectedAnswer: answer,
            isVerified: verified,
          });
          await onSaved();
        }}
      >
        Lösung speichern
      </Button>
    </fieldset>
  );
}
function AddBlockDialog({
  open,
  onClose,
  pageId,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  pageId?: string | undefined;
  onSaved: () => void;
}) {
  return (
    <Dialog open={open} title="Block hinzufügen" onClose={onClose}>
      <div className="block-picker">
        {BLOCK_TYPES.filter((v) => v !== "page_break").map((v) => (
          <Button
            key={v}
            variant="secondary"
            onClick={async () => {
              if (pageId) await materialService.addBlock(pageId, v);
              onClose();
              await onSaved();
            }}
          >
            {blockLabels[v]}
          </Button>
        ))}
      </div>
    </Dialog>
  );
}
function VariantDialog({
  open,
  onClose,
  materialId,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  materialId: string;
  onCreated: (id: string) => void;
}) {
  const [type, setType] =
      useState<import("../../domain").VariantType>("support"),
    [label, setLabel] = useState("Basis");
  return (
    <Dialog
      open={open}
      title="Variante erstellen"
      onClose={onClose}
      confirmLabel="Variante bewusst kopieren"
      onConfirm={async () => {
        const id = await materialService.createVariant(materialId, type, label);
        onClose();
        onCreated(id);
      }}
    >
      <SelectField
        id="variant-type-new"
        label="Interner Variantentyp"
        value={type}
        onChange={(e) => setType(e.target.value as typeof type)}
      >
        {VARIANT_TYPES.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </SelectField>
      <TextField
        id="variant-name-new"
        label="Sichtbarer neutraler Name"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <p>
        Seiten und Blöcke erhalten neue IDs. Das Original bleibt unverändert.
      </p>
    </Dialog>
  );
}
function LinkDialog({
  open,
  onClose,
  materialId,
  data,
}: {
  open: boolean;
  onClose: () => void;
  materialId: string;
  data: ReturnType<typeof useMaterialData>;
}) {
  const [type, setType] =
      useState<import("../../domain").MaterialLink["targetType"]>("topic"),
    [target, setTarget] = useState("topic-nomen"),
    [error, setError] = useState("");
  return (
    <Dialog
      open={open}
      title="Material verknüpfen"
      onClose={onClose}
      confirmLabel="Verknüpfen"
      onConfirm={async () => {
        try {
          await materialService.addLink(materialId, type, target);
          onClose();
          await data.refresh();
        } catch (e) {
          setError(e instanceof Error ? e.message : "");
        }
      }}
    >
      <SelectField
        id="link-type"
        label="Zieltyp"
        value={type}
        onChange={(e) => setType(e.target.value as typeof type)}
      >
        <option value="lesson">Unterrichtsstunde</option>
        <option value="series_implementation">Durchführung</option>
        <option value="series_template">Stammreihe</option>
        <option value="topic">Thema</option>
      </SelectField>
      <TextField
        id="link-target"
        label="Technische Ziel-ID"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />
      {error && <p role="alert">{error}</p>}
      <p>Die Verknüpfung kopiert keine Materialinhalte.</p>
    </Dialog>
  );
}
function StatusDialog({
  open,
  onClose,
  material,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  material: import("../../domain").Material;
  onSaved: () => void;
}) {
  const [next, setNext] = useState<MaterialStatus>(
      MATERIAL_TRANSITIONS[material.status][0] ?? material.status,
    ),
    [error, setError] = useState("");
  return (
    <Dialog
      open={open}
      title="Materialstatus ändern"
      onClose={onClose}
      confirmLabel="Status setzen"
      onConfirm={async () => {
        try {
          await materialService.changeStatus(material.id, next);
          onClose();
          await onSaved();
        } catch (e) {
          setError(e instanceof Error ? e.message : "");
        }
      }}
    >
      <SelectField
        id="material-status"
        label="Neuer Status"
        value={next}
        onChange={(e) => setNext(e.target.value as MaterialStatus)}
      >
        {MATERIAL_TRANSITIONS[material.status].map((v) => (
          <option key={v} value={v}>
            {MATERIAL_STATUS_LABELS[v]}
          </option>
        ))}
      </SelectField>
      {error && (
        <p role="alert" className="quiet-notice">
          {error}
        </p>
      )}
    </Dialog>
  );
}

export function MaterialPreviewPage() {
  const { materialId } = useParams(),
    data = useMaterialData(),
    [zoom, setZoom] = useState("Seite"),
    [bw, setBw] = useState(false);
  if (!data.data) return <p role="status">Vorschau wird geladen …</p>;
  const material = data.data.materials.find((v) => v.id === materialId);
  if (!material)
    return (
      <ErrorState title="Material nicht gefunden">
        Die Vorschau kann nicht geöffnet werden.
      </ErrorState>
    );
  const doc = data.data.documents.find((v) => v.materialId === material.id)!,
    pages = data.data.pages
      .filter((v) => v.documentId === doc.id && !v.archivedAt)
      .sort((a, b) => a.position - b.position),
    allBlocks = data.data.blocks.filter(
      (v) => pages.some((p) => p.id === v.pageId) && !v.archivedAt,
    ),
    issues = layoutIssues(allBlocks, data.data.solutions);
  return (
    <div className="material-workshop">
      <Breadcrumbs
        label="Vorschaupfad"
        items={[
          { label: material.title, href: `/materialien/${material.id}` },
          { label: "Vorschau" },
        ]}
      />
      <PageHeader title="Drucknahe Vorschau" description={material.title} />
      <p className="preview-banner">
        Drucknahe Vorschau – Export folgt in einem späteren Paket.
      </p>
      <div className="workshop-actions">
        <SegmentedControl
          label="Vorschau-Zoom"
          options={["Seite", "Breite", "100 Prozent"]}
          value={zoom}
          onChange={setZoom}
        />
        <label>
          <input
            type="checkbox"
            checked={bw}
            onChange={(e) => setBw(e.target.checked)}
          />{" "}
          Schwarz-Weiß-Vorschau
        </label>
      </div>
      <div className="a4-stage" data-zoom={zoom}>
        {pages.map((p) => (
          <MaterialPageView
            key={p.id}
            page={p}
            blocks={allBlocks.filter((b) => b.pageId === p.id)}
            solutions={data.data!.solutions}
            bw={bw}
          />
        ))}
      </div>
      {issues.length > 0 && (
        <section>
          <h2>Layout- und Überlaufhinweise</h2>
          {issues.map((v, i) => (
            <Card key={i} className={`issue--${v.severity}`}>
              {v.message}
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
export function MaterialFamilyPage() {
  const { materialId } = useParams(),
    data = useMaterialData();
  if (!data.data) return <p role="status">Materialfamilie wird geladen …</p>;
  const material = data.data.materials.find((v) => v.id === materialId);
  if (!material)
    return (
      <ErrorState title="Material nicht gefunden">
        Die Familie kann nicht geöffnet werden.
      </ErrorState>
    );
  const family = data.data.families.find((v) => v.id === material.familyId)!,
    members = data.data.materials.filter((v) => v.familyId === family.id);
  return (
    <div className="material-workshop">
      <Breadcrumbs
        label="Materialfamilienpfad"
        items={[
          { label: material.title, href: `/materialien/${material.id}` },
          { label: "Materialfamilie" },
        ]}
      />
      <PageHeader
        title={family.title}
        description="Zusammengehörige Fassungen mit eigenständigen Inhalten."
      />
      <div className="family-list">
        {members.map((m) => {
          const v = data.data!.variants.find((x) => x.materialId === m.id);
          return (
            <Card key={m.id}>
              <div>
                <h2>{m.title}</h2>
                <p>
                  {v?.label} · {MATERIAL_STATUS_LABELS[m.status]}
                </p>
              </div>
              <Link className="button-link" to={`/materialien/${m.id}`}>
                Öffnen
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

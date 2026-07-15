import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  LoadingState,
  Notice,
  TextAreaField,
} from "../../design-system/components";
import { domainDb } from "../../domain";
import {
  BuddyError,
  buddyService,
  capabilityFor,
  capabilitiesFor,
  type BuddyCapabilityKey,
  type BuddySuggestionChange,
  type BuddySuggestionRecord,
  type BuddyTargetType,
} from "../../ai";
import "./buddy.css";
type Target = { type: BuddyTargetType; id: string; label: string };
function targetFromPath(path: string): Target | undefined {
  let m = path.match(/^\/stunden\/([^/]+)/);
  if (m) return { type: "lesson", id: m[1]!, label: "Unterrichtsstunde" };
  m = path.match(/^\/materialien\/([^/]+)/);
  if (m && m[1] !== "neu")
    return { type: "material", id: m[1]!, label: "Material" };
  m = path.match(/^\/reihen\/([^/]+)/);
  if (m)
    return {
      type: "series_implementation",
      id: m[1]!,
      label: "Unterrichtsreihe",
    };
  return undefined;
}
const operationText = (row: BuddySuggestionChange) => {
  const op = row.operation;
  switch (op.type) {
    case "replace_field":
      return `${op.oldValue || "Noch offen"} → ${op.newValue}`;
    case "update_lesson_phase":
      return `Phase: ${op.changes.durationMinutes ?? "unverändert"} Minuten · ${op.changes.title ?? "Titel bleibt"}`;
    case "update_material_task":
      return `Bisher: ${op.changes.instruction ? "vorhandener Arbeitsauftrag" : "unverändert"} · Vorgeschlagen: ${op.changes.instruction ?? op.changes.prompt}`;
    case "add_material_variant_plan":
      return op.proposedChanges.map((v) => v.description).join(" · ");
    case "advisory_note":
      return op.content;
  }
};
export function BuddyPanel({ pathname }: { pathname: string }) {
  const target = useMemo(() => targetFromPath(pathname), [pathname]),
    [title, setTitle] = useState("Aktueller Arbeitsplatz"),
    [capability, setCapability] = useState<BuddyCapabilityKey>(),
    [preview, setPreview] = useState<{ used: string[]; excluded: string[] }>(),
    [loading, setLoading] = useState(false),
    [result, setResult] = useState<{
      suggestion: BuddySuggestionRecord;
      changes: BuddySuggestionChange[];
    }>(),
    [free, setFree] = useState(""),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [lastVersion, setLastVersion] = useState<string>(),
    [historyCount, setHistoryCount] = useState(0);
  const caps = target ? capabilitiesFor(target.type).slice(0, 5) : [];
  useEffect(() => {
    setCapability(undefined);
    setResult(undefined);
    setPreview(undefined);
    setError("");
    setSuccess("");
    if (!target) return;
    void (async () => {
      const row =
        target.type === "lesson"
          ? await domainDb.lessons.get(target.id)
          : target.type === "material"
            ? await domainDb.materials.get(target.id)
            : await domainDb.seriesImplementations.get(target.id);
      setTitle(
        (row &&
          ("title" in row
            ? row.title
            : "titleOverride" in row
              ? row.titleOverride
              : undefined)) ??
          target.label,
      );
      setHistoryCount(
        (await buddyService.history(target.type, target.id)).length,
      );
    })();
  }, [target?.id, target?.type]);
  function choose(key: BuddyCapabilityKey) {
    if (!target) return;
    setCapability(key);
    setResult(undefined);
    setError("");
    const selectedCapability = capabilityFor(key);
    setPreview({
      used: selectedCapability?.allowedContextSections ?? [],
      excluded: [
        "Kindernamen und Diagnosen",
        "private Notizen",
        "vollständiger Datenbestand",
        "andere Materialien und Arbeitsplätze",
        ...(!selectedCapability?.allowedContextSections.includes("reflection")
          ? ["persönliche Reflexion"]
          : []),
      ],
    });
  }
  async function generate() {
    if (!target || !capability) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const id = await buddyService.generate({
        capabilityKey: capability,
        targetType: target.type,
        targetId: target.id,
        ...(free ? { freeInstruction: free } : {}),
      });
      setResult(await buddyService.suggestion(id));
      setHistoryCount((v) => v + 1);
    } catch (e) {
      setError(
        e instanceof BuddyError
          ? e.message
          : "Der Vorschlag konnte nicht erstellt werden. Deine Planung wurde nicht verändert.",
      );
    } finally {
      setLoading(false);
    }
  }
  async function apply() {
    if (!result) return;
    try {
      const selected = result.changes
          .filter((v) => v.selected)
          .map((v) => v.id),
        version = await buddyService.apply(result.suggestion.id, selected);
      setLastVersion(version);
      setResult(await buddyService.suggestion(result.suggestion.id));
      setSuccess(
        selected.length === result.changes.length
          ? "Alle ausgewählten Änderungen wurden bewusst übernommen."
          : "Die ausgewählten Änderungen wurden teilweise übernommen.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Übernahme fehlgeschlagen.");
    }
  }
  return (
    <div className="buddy-panel">
      {!target ? (
        <Notice variant="info" title="Kein Buddy-Kontext">
          Öffne eine Unterrichtsreihe, Stunde oder ein Material. Außerhalb
          dieser Arbeitsplätze verändert der Buddy nichts.
        </Notice>
      ) : (
        <>
          <Badge tone="info">Lokaler Testmodus – keine echte KI-Anfrage.</Badge>
          <p>
            <strong>
              {target.label}: {title}
            </strong>
          </p>
          <p className="buddy-subtle">
            Der Buddy bereitet Entscheidungen vor. Er trifft sie nicht.
          </p>
          <section aria-labelledby="buddy-capabilities">
            <h3 id="buddy-capabilities">Passende Fähigkeiten</h3>
            <div className="buddy-capabilities">
              {caps.map((c) => (
                <Button
                  key={c.key}
                  variant={capability === c.key ? "secondary" : "ghost"}
                  onClick={() => choose(c.key)}
                >
                  {c.title}
                </Button>
              ))}
            </div>
          </section>
          {capability && preview && (
            <section aria-labelledby="buddy-context">
              <h3 id="buddy-context">Kontextvorschau</h3>
              <Card>
                <strong>Der Buddy verwendet:</strong>
                <ul>
                  {preview.used.map((v) => (
                    <li key={v}>{sectionLabel(v)}</li>
                  ))}
                </ul>
                <strong>Nicht verwendet:</strong>
                <ul>
                  {preview.excluded.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </Card>
              <TextAreaField
                id="buddy-free"
                label="Ergänzende freie Anfrage (optional)"
                value={free}
                onChange={(e) => setFree(e.target.value)}
                hint="Keine Namen, Diagnosen oder privaten Angaben eingeben."
              />
              <Button onClick={generate}>Vorschlag bewusst starten</Button>
            </section>
          )}
          {loading && <LoadingState />}
          {error && (
            <Notice variant="error" title="Vorschlag nicht angewendet">
              <p>{error}</p>
              <details>
                <summary>Details anzeigen</summary>
                <p>Deine Fachdaten wurden nicht verändert.</p>
              </details>
            </Notice>
          )}
          {result && (
            <SuggestionView
              result={result}
              onToggle={async (row, selected) => {
                setResult((current) =>
                  current
                    ? {
                        ...current,
                        changes: current.changes.map((change) =>
                          change.id === row.id
                            ? { ...change, selected }
                            : change,
                        ),
                      }
                    : current,
                );
                await buddyService.setSelected(row.id, selected);
              }}
              onApply={apply}
              onDiscard={async () => {
                await buddyService.discard(result.suggestion.id);
                setResult(undefined);
                setSuccess(
                  "Vorschlag verworfen. Fachdaten blieben unverändert.",
                );
              }}
            />
          )}
          {success && (
            <Notice variant="success" title="Übernahme abgeschlossen">
              <p>{success}</p>
              {lastVersion && (
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await buddyService.rollback(lastVersion);
                    setSuccess("Der vorherige Stand wurde wiederhergestellt.");
                  }}
                >
                  Vorherigen Stand wiederherstellen
                </Button>
              )}
            </Notice>
          )}
          <p className="buddy-history">
            Lokaler Verlauf für dieses Ziel: {historyCount} Vorschläge
          </p>
        </>
      )}
    </div>
  );
}
function SuggestionView({
  result,
  onToggle,
  onApply,
  onDiscard,
}: {
  result: {
    suggestion: BuddySuggestionRecord;
    changes: BuddySuggestionChange[];
  };
  onToggle: (row: BuddySuggestionChange, selected: boolean) => void;
  onApply: () => void;
  onDiscard: () => void;
}) {
  return (
    <section
      className="buddy-suggestion"
      aria-labelledby="buddy-suggestion-title"
    >
      <h3 id="buddy-suggestion-title">Vorschlag</h3>
      <Card>
        <h4>{result.suggestion.summary}</h4>
        {result.suggestion.rationale && <p>{result.suggestion.rationale}</p>}
        <div className="buddy-changes">
          {result.changes.map((row, i) => (
            <Card key={row.id}>
              <Checkbox
                id={`buddy-change-${row.id}`}
                label={`Änderung ${i + 1} auswählen`}
                checked={row.selected}
                disabled={row.applied}
                onChange={(e) => onToggle(row, e.target.checked)}
              />
              <p>{row.operation.reason}</p>
              <div className="buddy-compare">
                <strong>Bisher / vorgeschlagen</strong>
                <p>{operationText(row)}</p>
              </div>
            </Card>
          ))}
        </div>
        <h4>Quellen</h4>
        {result.suggestion.sourcesUsed.length ? (
          <ul>
            {result.suggestion.sourcesUsed.map((v) => (
              <li key={v.id}>{v.title}</li>
            ))}
          </ul>
        ) : (
          <p>Keine externen Quellen verwendet.</p>
        )}
        <h4>Unsicherheiten</h4>
        {result.suggestion.uncertainties.length ? (
          <ul>
            {result.suggestion.uncertainties.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        ) : (
          <p>Keine zusätzlichen Unsicherheiten ausgewiesen.</p>
        )}
        <h4>Schutzregeln</h4>
        <ul>
          {result.suggestion.safeguards.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
        <div className="buddy-actions">
          <Button onClick={onApply}>Ausgewählte übernehmen</Button>
          <Button variant="secondary" onClick={onDiscard}>
            Vorschlag verwerfen
          </Button>
        </div>
      </Card>
    </section>
  );
}
function sectionLabel(v: string) {
  return (
    (
      {
        class: "Klasse und Jahrgang",
        subject: "Fach und Thema",
        series: "Reihenkontext",
        lesson: "Stundenziel und Planung",
        phases: "Unterrichtsphasen",
        material: "Material",
        tasks: "Aufgaben",
        reflection: "Vorhandene Reflexionsnotizen",
        sources: "Freigegebene Quellen",
      } as Record<string, string>
    )[v] ?? v
  );
}

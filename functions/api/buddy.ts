interface Env { OPENAI_API_KEY?: string; OPENAI_MODEL?: string }

type BuddyRequest = { capabilityKey?: string; context?: unknown; freeInstruction?: string };

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.OPENAI_API_KEY) return json({ error: "Der KI-Buddy ist noch nicht freigeschaltet. In Cloudflare fehlt OPENAI_API_KEY." }, 503);
  let input: BuddyRequest;
  try { input = await request.json<BuddyRequest>(); } catch { return json({ error: "Die Anfrage konnte nicht gelesen werden." }, 400); }
  if (!input.capabilityKey || !input.context) return json({ error: "Der notwendige Arbeitskontext fehlt." }, 400);
  const system = `Du bist der KI-Buddy einer deutschen Grundschullehrerin. Antworte ausschließlich als valides JSON-Objekt. Nutze nur den übergebenen anonymisierten Kontext. Keine Diagnosen, Benotungen, Kindernamen oder erfundenen Daten. Gib genau diese Felder zurück: summary (String), rationale (optionaler String), changes (Array), sourcesUsed (Array), uncertainties (Array von Strings), safeguards (Array von Strings). Jede Änderung muss eine der im Kontext passenden Operationen sein: replace_field, update_lesson_phase, update_material_task, add_material_variant_plan oder advisory_note. Änderungen werden nur vorgeschlagen und niemals automatisch angewendet.`;
  const user = JSON.stringify({ capabilityKey: input.capabilityKey, freeInstruction: input.freeInstruction ?? "", context: input.context });
  const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { authorization: `Bearer ${env.OPENAI_API_KEY}`, "content-type": "application/json" }, body: JSON.stringify({ model: env.OPENAI_MODEL || "gpt-5-mini", instructions: system, input: user, text: { format: { type: "json_object" } } }) });
  if (!response.ok) { const detail = await response.text(); console.error("OpenAI Buddy error", response.status, detail.slice(0, 500)); return json({ error: "Die KI-Verbindung ist momentan nicht verfügbar. Deine Planung wurde nicht verändert." }, 502); }
  const data = await response.json<any>();
  const output = data.output_text ?? data.output?.flatMap((v:any)=>v.content??[]).find((v:any)=>v.type==="output_text")?.text;
  if (!output) return json({ error: "Die KI hat keinen verwertbaren Vorschlag geliefert." }, 502);
  try { return json(JSON.parse(output)); } catch { return json({ error: "Die KI-Antwort hatte ein unerwartetes Format." }, 502); }
};

export const onRequest = async (context: Parameters<typeof onRequestPost>[0]) => context.request.method === "POST" ? onRequestPost(context) : json({ error: "Nur POST ist erlaubt." }, 405);

import { z } from "zod";
import { WORKBENCH_FILTERS, type WorkbenchFilter, type WorkbenchItem } from "./workbench-model";

export const WORKBENCH_STORAGE_KEY = "lehrerkompass.workbench.v1";
export const WORKBENCH_STORAGE_VERSION = 1;

const overrideSchema = z.object({ pinned: z.boolean().optional(), removedFromWorkbench: z.boolean().optional(), lastEditedAt: z.string().datetime().optional() });
const storedSchema = z.object({ version: z.literal(WORKBENCH_STORAGE_VERSION), filter: z.enum(WORKBENCH_FILTERS), overrides: z.record(z.string(), overrideSchema) });
export type WorkbenchStoredState = z.infer<typeof storedSchema>;
export const DEFAULT_STORED_STATE: WorkbenchStoredState = { version: 1, filter: "all", overrides: {} };

export function readWorkbenchState(storage: Pick<Storage,"getItem"> = localStorage): WorkbenchStoredState {
  try { const raw = storage.getItem(WORKBENCH_STORAGE_KEY); if (!raw) return DEFAULT_STORED_STATE; const parsed = storedSchema.safeParse(JSON.parse(raw)); return parsed.success ? parsed.data : DEFAULT_STORED_STATE; } catch { return DEFAULT_STORED_STATE; }
}
export function writeWorkbenchState(state: WorkbenchStoredState, storage: Pick<Storage,"setItem"> = localStorage): void { try { storage.setItem(WORKBENCH_STORAGE_KEY, JSON.stringify(storedSchema.parse(state))); } catch { /* lokale UI bleibt mit aktuellem Zustand nutzbar */ } }
export function applyWorkbenchOverrides(items: WorkbenchItem[], state: WorkbenchStoredState): WorkbenchItem[] { return items.map((item) => { const override=state.overrides[item.id]; if(!override)return item; return { ...item, ...(override.pinned===undefined?{}:{pinned:override.pinned}), ...(override.removedFromWorkbench===undefined?{}:{removedFromWorkbench:override.removedFromWorkbench}), ...(override.lastEditedAt===undefined?{}:{lastEditedAt:override.lastEditedAt}) }; }); }
export function updateItemOverride(state: WorkbenchStoredState, id: string, patch: Partial<Pick<WorkbenchItem,"pinned"|"removedFromWorkbench"|"lastEditedAt">>): WorkbenchStoredState { return { ...state, overrides: { ...state.overrides, [id]: { ...(state.overrides[id] ?? {}), ...patch } } }; }
export function updateStoredFilter(state: WorkbenchStoredState, filter: WorkbenchFilter): WorkbenchStoredState { return { ...state, filter }; }

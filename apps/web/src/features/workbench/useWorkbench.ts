import { useMemo, useState } from "react";
import { DEMO_WORKBENCH_ITEMS } from "./workbench-data";
import { matchesWorkbenchFilter, sortWorkbenchItems, type WorkbenchFilter } from "./workbench-model";
import { applyWorkbenchOverrides, readWorkbenchState, updateItemOverride, updateStoredFilter, writeWorkbenchState } from "./workbench-storage";

export function useWorkbench(forcedState?: string | null, forcedFilter?: WorkbenchFilter | null) {
  const [stored, setStored] = useState(readWorkbenchState);
  const persist = (next: typeof stored) => { setStored(next); writeWorkbenchState(next); };
  const allItems = useMemo(() => forcedState === "default" ? DEMO_WORKBENCH_ITEMS : applyWorkbenchOverrides(DEMO_WORKBENCH_ITEMS, stored), [forcedState,stored]);
  const filter = forcedFilter ?? stored.filter;
  const visible = forcedState === "empty" ? [] : allItems.filter((item) => !item.removedFromWorkbench && matchesWorkbenchFilter(item, filter));
  const active = sortWorkbenchItems(visible.filter((item) => item.status !== "completed"));
  const completed = sortWorkbenchItems(visible.filter((item) => item.status === "completed")).slice(0,3);
  return {
    filter, pinned: active.filter((item) => item.pinned), current: active.filter((item) => !item.pinned), completed,
    setFilter: (next: WorkbenchFilter) => persist(updateStoredFilter(stored,next)),
    togglePinned: (id: string) => { const item=allItems.find((entry)=>entry.id===id); if(item) persist(updateItemOverride(stored,id,{pinned:!item.pinned})); },
    remove: (id: string) => persist(updateItemOverride(stored,id,{removedFromWorkbench:true})),
    undoRemove: (id: string) => persist(updateItemOverride(stored,id,{removedFromWorkbench:false})),
    markEdited: (id: string) => persist(updateItemOverride(stored,id,{lastEditedAt:new Date().toISOString()}))
  };
}

import { describe, expect, it } from "vitest";
import { DEMO_WORKBENCH_ITEMS } from "../workbench-data";
import { DEFAULT_STORED_STATE, WORKBENCH_STORAGE_KEY, applyWorkbenchOverrides, readWorkbenchState, updateItemOverride, writeWorkbenchState } from "../workbench-storage";

function memoryStorage(initial?: string) { let value=initial??null;return {getItem:(key:string)=>key===WORKBENCH_STORAGE_KEY?value:null,setItem:(_key:string,next:string)=>{value=next;},value:()=>value}; }

describe("Werkbank-Speicherung",()=>{
  it("ignoriert ungültige lokale Daten sicher",()=>{expect(readWorkbenchState(memoryStorage("kein-json"))).toEqual(DEFAULT_STORED_STATE);expect(readWorkbenchState(memoryStorage(JSON.stringify({version:99})))).toEqual(DEFAULT_STORED_STATE);});
  it("speichert und validiert Schema-Version 1",()=>{const storage=memoryStorage();const next=updateItemOverride(DEFAULT_STORED_STATE,"material-worksheet",{pinned:true});writeWorkbenchState(next,storage);expect(readWorkbenchState(storage)).toEqual(next);});
  it("wendet nur Werkbank-Overrides auf Verweise an",()=>{const state=updateItemOverride(DEFAULT_STORED_STATE,"series-nouns",{removedFromWorkbench:true});const items=applyWorkbenchOverrides(DEMO_WORKBENCH_ITEMS,state);expect(items.find((item)=>item.id==="series-nouns")?.removedFromWorkbench).toBe(true);expect(items.find((item)=>item.id==="series-nouns")?.title).toBe("Nomen entdecken");});
});

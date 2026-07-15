import { SegmentedControl } from "../../design-system/components";
import type { WorkbenchFilter } from "./workbench-model";
const options: Array<{value:WorkbenchFilter;label:string}>=[{value:"all",label:"Alle"},{value:"series",label:"Reihen"},{value:"lesson",label:"Stunden"},{value:"material",label:"Materialien"},{value:"support",label:"Förderung"}];
export function WorkbenchFilterControl({ value, onChange }: { value:WorkbenchFilter; onChange:(value:WorkbenchFilter)=>void }) { const current=options.find((option)=>option.value===value)?.label??"Alle"; return <SegmentedControl label="Werkbank filtern" options={options.map(({label})=>label)} value={current} onChange={(label)=>{const next=options.find((option)=>option.label===label);if(next)onChange(next.value);}} />; }

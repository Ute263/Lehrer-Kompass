import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Notice, PageHeader } from "../../design-system/components";
import { DEMO_WORKBENCH_ITEMS } from "../../features/workbench/workbench-data";

export function PrototypeWorkspacePage(){const location=useLocation();const item=DEMO_WORKBENCH_ITEMS.find((entry)=>entry.targetRoute===location.pathname);return <div className="placeholder-page"><PageHeader title={item?.title??"Arbeitsplatz-Vorschau"} description="Dieser Arbeitsplatz wird in einem späteren Paket umgesetzt."/><Notice variant="info" title="Noch keine Fachfunktion aktiv"><p>{[item?.classLabel,item?.subjectLabel,item?.subtitle].filter(Boolean).join(" · ")||"Künstlicher Demonstrationskontext"}</p><p>Letzter Bearbeitungsschritt: {item?.nextStep??"Noch nicht festgelegt"}</p></Notice><p className="prototype-back"><Link to="/werkbank"><ArrowLeft aria-hidden="true" size={18}/>Zurück zur Werkbank</Link></p></div>;}

import type { WorkbenchItem } from "./workbench-model";

export const DEMO_WORKBENCH_ITEMS: WorkbenchItem[] = [
  { id:"series-nouns",type:"series",title:"Nomen entdecken",classLabel:"Klasse 2",subjectLabel:"Deutsch",status:"planning",nextStep:"Stundenfolge weiterplanen",progressText:"4 von 6 Stunden vorbereitet",lastEditedAt:"2026-07-15T08:30:00.000Z",pinned:true,removedFromWorkbench:false,targetRoute:"/prototyp/reihe/nomen-entdecken" },
  { id:"lesson-articles",type:"lesson",title:"Nomen mit Artikeln erkennen",classLabel:"Klasse 2",subjectLabel:"Deutsch",subtitle:"Stunde 3",status:"ready",nextStep:"Material prüfen",nextDate:"2026-07-17",lastEditedAt:"2026-07-15T07:40:00.000Z",pinned:false,removedFromWorkbench:false,targetRoute:"/prototyp/stunde/nomen-artikel" },
  { id:"material-worksheet",type:"material",title:"Arbeitsblatt: Nomen mit Artikeln",classLabel:"Klasse 2",subjectLabel:"Deutsch",status:"draft",nextStep:"Lösung ergänzen",lastEditedAt:"2026-07-14T15:20:00.000Z",pinned:false,removedFromWorkbench:false,targetRoute:"/prototyp/material/nomen-arbeitsblatt" },
  { id:"support-reading",type:"support-series",title:"Lesetraining in der Kleingruppe",subtitle:"Förderunterricht",status:"planning",nextStep:"Einheit 2 vorbereiten",lastEditedAt:"2026-07-13T12:00:00.000Z",pinned:false,removedFromWorkbench:false,targetRoute:"/prototyp/foerderreihe/lesetraining" },
  { id:"day-thursday",type:"day-overview",title:"Tagesübersicht Donnerstag",subtitle:"Unterrichtstag",status:"draft",nextStep:"Hinweise für Vertretung ergänzen",nextDate:"2026-07-16",lastEditedAt:"2026-07-12T09:10:00.000Z",pinned:false,removedFromWorkbench:false,targetRoute:"/prototyp/tagesuebersicht/donnerstag" },
  { id:"series-complete",type:"series",title:"Wortarten wiederholen",classLabel:"Klasse 2",subjectLabel:"Deutsch",status:"completed",nextStep:"Bei Bedarf wieder öffnen",lastEditedAt:"2026-07-10T10:00:00.000Z",pinned:false,removedFromWorkbench:false,targetRoute:"/prototyp/reihe/wortarten" }
];

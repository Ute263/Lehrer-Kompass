import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, EmptyState } from "../../design-system/components";

export function WorkbenchEmptyState() { const navigate=useNavigate();const[notice,setNotice]=useState<string|null>(null);return <><EmptyState title="Deine Werkbank ist frei." description="Aktive Unterrichtsreihen, Stunden und Materialien erscheinen später hier."><div className="empty-actions"><Button onClick={()=>setNotice("Neue Unterrichtsreihe")}>Neue Unterrichtsreihe</Button><Button variant="secondary" onClick={()=>setNotice("Frühere Reihe übernehmen")}>Frühere Reihe übernehmen</Button><Button variant="ghost" onClick={()=>navigate("/klassen")}>Klassen öffnen</Button></div></EmptyState><Dialog open={notice!==null} title={notice??"Später verfügbar"} onClose={()=>setNotice(null)} confirmLabel="Verstanden"><p>Diese Funktion wird in einem späteren Paket umgesetzt. Es wurden keine Daten angelegt.</p></Dialog></>; }

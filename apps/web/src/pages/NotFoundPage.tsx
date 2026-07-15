import { useNavigate } from "react-router-dom";
import { Button, PageHeader } from "../design-system/components";

export function NotFoundPage() {
  const navigate = useNavigate();
  return <div className="placeholder-page"><PageHeader title="Diese Seite wurde nicht gefunden." description="Der aufgerufene Bereich ist in LehrerKompass nicht vorhanden." /><div className="not-found-actions"><Button onClick={() => navigate("/werkbank")}>Zur Werkbank</Button><Button variant="secondary" onClick={() => navigate(-1)}>Zurück</Button></div></div>;
}

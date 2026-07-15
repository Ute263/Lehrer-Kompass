import { Navigate, Route, Routes } from "react-router-dom";
import { DesignSystemPage } from "../prototype/DesignSystemPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { AppShell } from "./AppShell";
import { APP_ROUTES } from "./routes";

const pages = [
  [APP_ROUTES.workbench, "Werkbank", "Hier liegen später deine aktiven Unterrichtsreihen, Stunden und Materialien."],
  [APP_ROUTES.classes, "Klassen", "Hier entsteht später die fachliche Ordnung nach Klasse, Fach und Thema."],
  [APP_ROUTES.timetable, "Stundenplan", "Hier werden später Unterrichtszeit und geplante Stunden miteinander verbunden."],
  [APP_ROUTES.library, "Bibliothek", "Hier findest und verknüpfst du später deine Materialien."],
  [APP_ROUTES.support, "Förderunterricht", "Hier entstehen später Fördergruppen, Förderreihen und konkrete Fördereinheiten."],
  [APP_ROUTES.foundations, "Schule und Grundlagen", "Hier werden später Lehrwerke, Arbeitspläne und weitere schulische Grundlagen hinterlegt."],
  [APP_ROUTES.settings, "Einstellungen", "Hier werden später persönliche, technische und datenschutzbezogene Einstellungen verwaltet."]
] as const;

export function AppRoutes() {
  return <Routes>
    <Route path={APP_ROUTES.designSystem} element={<DesignSystemPage />} />
    <Route element={<AppShell />}>
      <Route index element={<Navigate to={APP_ROUTES.workbench} replace />} />
      {pages.map(([path, title, description]) => <Route key={path} path={path} element={<PlaceholderPage title={title} description={description} />} />)}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>;
}

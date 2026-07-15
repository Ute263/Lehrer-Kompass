import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { PrototypeWorkspacePage } from "../pages/prototype/PrototypeWorkspacePage";
import { WorkbenchPage } from "../features/workbench/WorkbenchPage";
import {
  ClassesPage,
  ClassDetailPage,
  SchoolYearsPage,
  SubjectPage,
} from "../features/classes/ClassWorkspace";
import {
  NewSeriesPage,
  SeriesDashboard,
  TemplatePage,
  TopicSeriesPage,
} from "../features/series/SeriesPages";
import { LessonPage } from "../features/lessons/LessonPages";
import { AppShell } from "./AppShell";
import { APP_ROUTES } from "./routes";
import { ServerModePage } from "../features/server/ServerModePage";
import { BackupPage, DataPage, ImportPage, InstallationPage } from "../features/local-app/LocalAppPages";

const DesignSystemPage = lazy(() => import("../prototype/DesignSystemPage").then((module) => ({ default: module.DesignSystemPage })));
const calendarPages = () => import("../features/calendar/CalendarPages");
const CalendarPage = lazy(() => calendarPages().then((module) => ({ default: module.CalendarPage })));
const CalendarSettingsPage = lazy(() => calendarPages().then((module) => ({ default: module.CalendarSettingsPage })));
const DayOverviewPage = lazy(() => calendarPages().then((module) => ({ default: module.DayOverviewPage })));
const EventPage = lazy(() => calendarPages().then((module) => ({ default: module.EventPage })));
const materialPages = () => import("../features/materials/MaterialPages");
const NewMaterialPage = lazy(() => materialPages().then((module) => ({ default: module.NewMaterialPage })));
const MaterialWorkshopPage = lazy(() => materialPages().then((module) => ({ default: module.MaterialWorkshopPage })));
const MaterialPreviewPage = lazy(() => materialPages().then((module) => ({ default: module.MaterialPreviewPage })));
const MaterialFamilyPage = lazy(() => materialPages().then((module) => ({ default: module.MaterialFamilyPage })));
const deferred = (page: ReactNode) => <Suspense fallback={<p role="status">Arbeitsbereich wird geladen …</p>}>{page}</Suspense>;

const pages = [
  [
    APP_ROUTES.library,
    "Bibliothek",
    "Hier findest und verknüpfst du später deine Materialien.",
  ],
  [
    APP_ROUTES.support,
    "Förderunterricht",
    "Hier entstehen später Fördergruppen, Förderreihen und konkrete Fördereinheiten.",
  ],
  [
    APP_ROUTES.foundations,
    "Schule und Grundlagen",
    "Hier werden später Lehrwerke, Arbeitspläne und weitere schulische Grundlagen hinterlegt.",
  ],
  [
    APP_ROUTES.settings,
    "Einstellungen",
    "Hier werden später persönliche, technische und datenschutzbezogene Einstellungen verwaltet.",
  ],
] as const;

export function AppRoutes() {
  return (
    <Routes>
      <Route path={APP_ROUTES.designSystem} element={deferred(<DesignSystemPage />)} />
      <Route element={<AppShell />}>
        <Route index element={<Navigate to={APP_ROUTES.workbench} replace />} />
        <Route path={APP_ROUTES.workbench} element={<WorkbenchPage />} />
        <Route path="/server-test" element={<ServerModePage />} />
        <Route path="/einstellungen/sicherung" element={<BackupPage />} />
        <Route path="/einstellungen/import" element={<ImportPage />} />
        <Route path="/einstellungen/daten" element={<DataPage />} />
        <Route path="/einstellungen/installation" element={<InstallationPage />} />
        <Route path={APP_ROUTES.classes} element={<ClassesPage />} />
        <Route path="/klassen/schuljahre" element={<SchoolYearsPage />} />
        <Route path="/klassen/:id" element={<ClassDetailPage />} />
        <Route
          path="/klassen/:id/faecher/:subjectId"
          element={<SubjectPage />}
        />
        <Route
          path="/klassen/:id/faecher/:subjectId/themen/:topicId"
          element={<TopicSeriesPage />}
        />
        <Route path="/reihen/neu" element={<NewSeriesPage />} />
        <Route path="/reihen/:implementationId" element={<SeriesDashboard />} />
        <Route path="/stammreihen/:templateId" element={<TemplatePage />} />
      <Route path="/stunden/:lessonId" element={<LessonPage />} />
      <Route path="/stundenplan" element={deferred(<CalendarPage />)} />
      <Route path="/stundenplan/tag/:date" element={deferred(<CalendarPage />)} />
      <Route path="/stundenplan/einstellungen" element={deferred(<CalendarSettingsPage />)} />
      <Route path="/kalender/termine/:eventId" element={deferred(<EventPage />)} />
      <Route path="/tagesuebersicht/:date" element={deferred(<DayOverviewPage />)} />
      <Route path="/vertretungsuebersicht/:date" element={deferred(<DayOverviewPage substitute />)} />
      <Route path="/materialien/neu" element={deferred(<NewMaterialPage />)} />
      <Route path="/materialien/:materialId" element={deferred(<MaterialWorkshopPage />)} />
      <Route path="/materialien/:materialId/vorschau" element={deferred(<MaterialPreviewPage />)} />
      <Route path="/materialien/:materialId/varianten" element={deferred(<MaterialFamilyPage />)} />
        {pages.map(([path, title, description]) => (
          <Route
            key={path}
            path={path}
            element={
              <PlaceholderPage title={title} description={description} />
            }
          />
        ))}
        <Route
          path="/prototyp/:bereich/:slug"
          element={<PrototypeWorkspacePage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

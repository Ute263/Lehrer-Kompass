import { BookOpen, CalendarDays, GraduationCap, Library, Settings, Shapes, Wrench, type LucideIcon } from "lucide-react";
import { APP_ROUTES } from "./routes";

export interface NavigationItem { label: string; path: string; icon: LucideIcon; }

export const MAIN_NAVIGATION: NavigationItem[] = [
  { label: "Werkbank", path: APP_ROUTES.workbench, icon: Wrench },
  { label: "Klassen", path: APP_ROUTES.classes, icon: GraduationCap },
  { label: "Stundenplan", path: APP_ROUTES.timetable, icon: CalendarDays },
  { label: "Bibliothek", path: APP_ROUTES.library, icon: Library },
  { label: "Förderunterricht", path: APP_ROUTES.support, icon: Shapes },
  { label: "Schule und Grundlagen", path: APP_ROUTES.foundations, icon: BookOpen },
  { label: "Einstellungen", path: APP_ROUTES.settings, icon: Settings }
];

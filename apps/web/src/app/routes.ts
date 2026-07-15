export const APP_ROUTES = {
  workbench: "/werkbank",
  classes: "/klassen",
  timetable: "/stundenplan",
  library: "/bibliothek",
  support: "/foerderunterricht",
  foundations: "/schule-grundlagen",
  settings: "/einstellungen",
  designSystem: "/design-system"
} as const;

export type AppRoutePath = (typeof APP_ROUTES)[keyof Omit<typeof APP_ROUTES, "designSystem">];

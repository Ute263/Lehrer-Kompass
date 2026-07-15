import { MAIN_NAVIGATION } from "./navigation";

export function breadcrumbsForPath(pathname: string): Array<{ label: string; href?: string }> {
  if (pathname.startsWith("/prototyp/")) return [{ label: "Werkbank", href: "/werkbank" }, { label: "Arbeitsplatz-Vorschau" }];
  if (pathname.startsWith("/klassen/")) return [{ label: "Klassen", href: "/klassen" }, { label: pathname === "/klassen/schuljahre" ? "Schuljahre" : "Fachstruktur" }];
  const item = MAIN_NAVIGATION.find(({ path }) => path === pathname);
  return [{ label: item?.label ?? "Seite nicht gefunden" }];
}

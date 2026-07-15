import { MAIN_NAVIGATION } from "./navigation";

export function breadcrumbsForPath(pathname: string): Array<{ label: string; href?: string }> {
  if (pathname.startsWith("/prototyp/")) return [{ label: "Werkbank", href: "/werkbank" }, { label: "Arbeitsplatz-Vorschau" }];
  const item = MAIN_NAVIGATION.find(({ path }) => path === pathname);
  return [{ label: item?.label ?? "Seite nicht gefunden" }];
}

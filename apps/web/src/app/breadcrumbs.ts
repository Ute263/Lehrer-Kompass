import { MAIN_NAVIGATION } from "./navigation";

export function breadcrumbsForPath(pathname: string): Array<{ label: string; href?: string }> {
  if(pathname.startsWith("/einstellungen/"))return[{label:"Einstellungen",href:"/einstellungen"},{label:pathname.endsWith("/sicherung")?"Sicherung":pathname.endsWith("/import")?"Import":pathname.endsWith("/daten")?"Lokale Daten":"Installation"}];
  if(pathname==="/server-test")return[{label:"Server-Testmodus"}];
  if (pathname.startsWith("/prototyp/")) return [{ label: "Werkbank", href: "/werkbank" }, { label: "Arbeitsplatz-Vorschau" }];
  if (pathname.startsWith("/klassen/")) return [{ label: "Klassen", href: "/klassen" }, { label: pathname === "/klassen/schuljahre" ? "Schuljahre" : "Fachstruktur" }];
  if(pathname.startsWith("/reihen/"))return[{label:"Klassen",href:"/klassen"},{label:"Unterrichtsreihe"}];
  if(pathname.startsWith("/stammreihen/"))return[{label:"Klassen",href:"/klassen"},{label:"Stammreihe"}];
  if(pathname.startsWith("/stunden/"))return[{label:"Klassen",href:"/klassen"},{label:"Unterrichtsstunde"}];
  const item = MAIN_NAVIGATION.find(({ path }) => path === pathname);
  return [{ label: item?.label ?? "Seite nicht gefunden" }];
}

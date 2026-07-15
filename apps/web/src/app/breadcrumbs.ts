import { MAIN_NAVIGATION } from "./navigation";

export function breadcrumbsForPath(pathname: string): Array<{ label: string; href?: string }> {
  const item = MAIN_NAVIGATION.find(({ path }) => path === pathname);
  return [{ label: item?.label ?? "Seite nicht gefunden" }];
}

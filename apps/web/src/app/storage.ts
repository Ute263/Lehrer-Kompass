export const NAVIGATION_STORAGE_KEY = "lehrerkompass.navigation.collapsed";

export function readNavigationCollapsed(storage: Pick<Storage, "getItem"> = localStorage): boolean {
  try { return storage.getItem(NAVIGATION_STORAGE_KEY) === "true"; } catch { return false; }
}

export function writeNavigationCollapsed(collapsed: boolean, storage: Pick<Storage, "setItem"> = localStorage): void {
  try { storage.setItem(NAVIGATION_STORAGE_KEY, collapsed ? "true" : "false"); } catch { /* sicherer UI-Standard bleibt aktiv */ }
}

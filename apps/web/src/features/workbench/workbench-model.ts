import { z } from "zod";

export const WORKBENCH_ITEM_TYPES = ["series", "lesson", "material", "support-series", "day-overview"] as const;
export const WORKBENCH_STATUSES = ["draft", "planning", "ready", "completed", "needs-revision"] as const;
export const WORKBENCH_FILTERS = ["all", "series", "lesson", "material", "support"] as const;

export type WorkbenchItemType = (typeof WORKBENCH_ITEM_TYPES)[number];
export type WorkbenchStatus = (typeof WORKBENCH_STATUSES)[number];
export type WorkbenchFilter = (typeof WORKBENCH_FILTERS)[number];

export const workbenchItemSchema = z.object({
  id: z.string().min(1), type: z.enum(WORKBENCH_ITEM_TYPES), title: z.string().min(1), subtitle: z.string().optional(),
  classLabel: z.string().optional(), subjectLabel: z.string().optional(), topicLabel: z.string().optional(),
  classId: z.string().optional(), subjectId: z.string().optional(), topicId: z.string().optional(),
  templateId:z.string().optional(),implementationId:z.string().optional(),
  status: z.enum(WORKBENCH_STATUSES), nextStep: z.string().optional(), progressText: z.string().optional(), nextDate: z.string().optional(),
  lastEditedAt: z.string().datetime(), pinned: z.boolean(), removedFromWorkbench: z.boolean(), targetRoute: z.string().startsWith("/")
});

export type WorkbenchItem = z.infer<typeof workbenchItemSchema>;

export const STATUS_LABELS: Record<WorkbenchStatus, string> = { draft: "Entwurf", planning: "In Planung", ready: "Einsatzbereit", completed: "Abgeschlossen", "needs-revision": "Überarbeiten" };
export const TYPE_LABELS: Record<WorkbenchItemType, string> = { series: "Unterrichtsreihe", lesson: "Unterrichtsstunde", material: "Material", "support-series": "Förderreihe", "day-overview": "Tagesübersicht" };

export function matchesWorkbenchFilter(item: WorkbenchItem, filter: WorkbenchFilter): boolean {
  if (filter === "all") return true; if (filter === "support") return item.type === "support-series"; return item.type === filter;
}

export function sortWorkbenchItems(items: WorkbenchItem[]): WorkbenchItem[] {
  return [...items].sort((a, b) => b.lastEditedAt.localeCompare(a.lastEditedAt) || (a.nextDate ?? "9999").localeCompare(b.nextDate ?? "9999") || a.type.localeCompare(b.type));
}

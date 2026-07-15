import { z } from "zod";

export const apiErrorSchema = z.object({ error: z.object({ code: z.string(), message: z.string(), requestId: z.string(), details: z.unknown().optional() }) });
export const resourceKindSchema = z.enum(["class", "topic", "series", "lesson", "material"]);
export const resourceInputSchema = z.object({ kind: resourceKindSchema, title: z.string().trim().min(1).max(160), parentId: z.string().min(1).optional(), version: z.number().int().positive().optional(), workspaceId: z.string().optional() });
export const localImportSchema = z.object({
  objects: z.array(z.object({ localId: z.string().min(1).max(120), kind: resourceKindSchema, title: z.string().trim().min(1).max(160), parentLocalId: z.string().optional() })).max(500),
});
export const buddyRequestSchema = z.object({ targetType: z.enum(["lesson", "material", "series"]), targetId: z.string().min(1), capabilityKey: z.string().min(1).max(80), instruction: z.string().max(600).optional(), workspaceId: z.string().optional() });
export type ResourceKind = z.infer<typeof resourceKindSchema>;
export type LocalImport = z.infer<typeof localImportSchema>;


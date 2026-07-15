import { z } from "zod";

export const AppErrorSchema = z.object({
  error: z.object({
    code: z.string().min(1),
    message: z.string().min(1),
    retryable: z.boolean(),
    details: z.record(z.string(), z.unknown()).optional()
  })
});

export type AppError = z.infer<typeof AppErrorSchema>;

export function appError(code: string, message: string, retryable = false): AppError {
  return AppErrorSchema.parse({ error: { code, message, retryable } });
}


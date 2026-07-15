import { z } from "zod";
const schema=z.object({NODE_ENV:z.enum(["development","test","production"]).default("development"),FRONTEND_ORIGIN:z.string().url().default("http://127.0.0.1:4173"),SESSION_SECRET:z.string().min(32).default("local-test-only-session-secret-32-chars"),IDENTITY_MODE:z.enum(["mock","microsoft"]).default("mock"),MICROSOFT_CLIENT_ID:z.string().optional(),MICROSOFT_CLIENT_SECRET:z.string().optional(),MICROSOFT_REDIRECT_URI:z.string().url().optional(),OPENAI_API_KEY:z.string().optional(),OPENAI_MODEL_FAST:z.string().optional(),OPENAI_MODEL_STANDARD:z.string().optional(),OPENAI_MODEL_DEEP:z.string().optional()});
export type ApiConfig=z.infer<typeof schema>;
export const readConfig=(input:NodeJS.ProcessEnv=process.env)=>schema.parse(input);


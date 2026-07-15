import OpenAI from "openai";import { z } from "zod";import type { ApiConfig } from "../config.js";
const result=z.object({summary:z.string(),changes:z.array(z.object({id:z.string(),description:z.string()})).max(5)});
export type BuddyResult=z.infer<typeof result>;
export class MockBuddyProvider{async generate(title:string):Promise<BuddyResult>{return result.parse({summary:`Ruhiger Vorschlag für ${title}`,changes:[{id:"change-1",description:"Struktur klarer fassen"}]})}}
export class PreparedOpenAIProvider{constructor(private c:ApiConfig){}async generate(input:string):Promise<BuddyResult>{if(!this.c.OPENAI_API_KEY||!this.c.OPENAI_MODEL_STANDARD||process.env.RUN_REAL_OPENAI_TEST!=="true")throw new Error("BUDDY_PROVIDER_UNAVAILABLE");const client=new OpenAI({apiKey:this.c.OPENAI_API_KEY,timeout:15_000,maxRetries:1});const response=await client.responses.create({model:this.c.OPENAI_MODEL_STANDARD,input,max_output_tokens:500});return result.parse(JSON.parse(response.output_text))}}


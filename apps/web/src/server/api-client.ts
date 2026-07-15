import { z } from "zod";
const errorSchema=z.object({error:z.object({code:z.string(),message:z.string(),requestId:z.string()})});
export class ApiClient{
 private csrf="";constructor(private baseUrl=import.meta.env.VITE_API_BASE_URL??"http://127.0.0.1:4180"){}
 async request<T>(path:string,init:RequestInit={}){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10_000);try{const response=await fetch(this.baseUrl+path,{...init,credentials:"include",signal:controller.signal,headers:{"content-type":"application/json","x-request-id":crypto.randomUUID(),...(this.csrf?{"x-csrf-token":this.csrf}:{}),...init.headers}});const body=await response.json();if(!response.ok){const parsed=errorSchema.safeParse(body);throw new Error(parsed.success?parsed.data.error.message:"Der Server ist gerade nicht erreichbar.")}if(body.csrfToken)this.csrf=body.csrfToken;return body as T}catch(error){if(error instanceof Error&&error.message!=="Failed to fetch")throw error;throw new Error("Der Server ist gerade nicht erreichbar. Lokale Daten bleiben unverändert.")}finally{clearTimeout(timer)}}
 login(userId:string){return this.request<{user:{displayName:string};workspace:{name:string};csrfToken:string}>("/api/v1/auth/mock-login",{method:"POST",body:JSON.stringify({userId})})}
 session(){return this.request<any>("/api/v1/session")}
 logout(){return this.request("/api/v1/auth/logout",{method:"POST"})}
 preview(objects:unknown[]){return this.request<any>("/api/v1/import/local-preview",{method:"POST",body:JSON.stringify({objects})})}
}
export const apiClient=new ApiClient();

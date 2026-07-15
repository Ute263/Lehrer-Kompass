import { createRemoteJWKSet, jwtVerify } from "jose";
import type { ApiConfig } from "../config.js";
export class MockIdentityAdapter{users=["personal-user-a","personal-user-b"] as const; authenticate(id:string){if(!this.users.includes(id as never))throw new Error("AUTH_TOKEN_INVALID");return id}}
export class MicrosoftIdentityAdapter{
 constructor(private config:ApiConfig){}
 assertConfigured(){if(!this.config.MICROSOFT_CLIENT_ID||!this.config.MICROSOFT_CLIENT_SECRET||!this.config.MICROSOFT_REDIRECT_URI)throw new Error("AUTH_NOT_CONFIGURED")}
 async validateIdToken(token:string,nonce:string){this.assertConfigured();const issuer="https://login.microsoftonline.com/consumers/v2.0",audience=this.config.MICROSOFT_CLIENT_ID!,jwks=createRemoteJWKSet(new URL("https://login.microsoftonline.com/consumers/discovery/v2.0/keys"));return jwtVerify(token,jwks,{issuer,audience,requiredClaims:["sub","nonce"],maxTokenAge:"10m"}).then(r=>{if(r.payload.nonce!==nonce)throw new Error("AUTH_INVALID_NONCE");return r.payload})}
}

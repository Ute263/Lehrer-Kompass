// @vitest-environment node
import { readFile, stat } from "node:fs/promises";
import { describe, expect, it } from "vitest";
const root=new URL("../../../public/",import.meta.url);
describe("PWA und Offlinecache",()=>{
  it("besitzt ein gültiges Manifest und beide PNG-Icons",async()=>{const manifest=JSON.parse(await readFile(new URL("manifest.webmanifest",root),"utf8"));expect(manifest).toMatchObject({name:"LehrerKompass",start_url:"/werkbank",display:"standalone"});expect(manifest.icons.map((v:{sizes:string})=>v.sizes)).toEqual(["192x192","512x512"]);await expect(stat(new URL("icons/icon-192.png",root))).resolves.toBeTruthy();await expect(stat(new URL("icons/icon-512.png",root))).resolves.toBeTruthy();});
  it("registriert Kernrouten und schließt API-Antworten aus",async()=>{const sw=await readFile(new URL("sw.js",root),"utf8");expect(sw).toContain("/einstellungen/sicherung");expect(sw).toContain("url.pathname.startsWith(\"/api/\")");expect(sw).toContain("lehrerkompass-app-v1");expect(sw).not.toMatch(/token|secret|session/i);});
  it("unterstützt kontrollierte Aktivierung",async()=>{const sw=await readFile(new URL("sw.js",root),"utf8");expect(sw).toContain("SKIP_WAITING");expect(sw).not.toContain("self.skipWaiting(); }); });");});
});

import{describe,expect,it}from"vitest";
import{readFileSync,readdirSync,statSync}from"node:fs";
import{join}from"node:path";
const root=process.cwd();
function files(dir:string):string[]{return readdirSync(dir).flatMap(n=>{const p=join(dir,n);return statSync(p).isDirectory()?files(p):[p]})}
describe("Secret-Scan",()=>{
  it("enthält keine typischen Secrets in Quellcode oder Frontend",()=>{const targets=[...files(join(root,"apps/web/src")),...files(join(root,"apps/api/src")),join(root,".env.example")];for(const f of targets){const s=readFileSync(f,"utf8");expect(s).not.toMatch(/sk-[A-Za-z0-9]{20,}/);expect(s).not.toMatch(/client_secret[ \t]*[:=][ \t]*["']?[A-Za-z0-9_-]{12,}/i)}});
  it("ignoriert .env und Beispiel enthält nur leere Werte",()=>{expect(readFileSync(join(root,".gitignore"),"utf8")).toMatch(/^\.env$/m);for(const line of readFileSync(join(root,".env.example"),"utf8").split("\n").filter(x=>x&&!x.startsWith("#")))expect(line).toMatch(/^[A-Z0-9_]+=$/)})
});

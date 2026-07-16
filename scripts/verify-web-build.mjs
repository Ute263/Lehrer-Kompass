import { access, readdir, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const outputDir = resolve("apps/web/dist");
const indexFile = resolve(outputDir, "index.html");

try {
  await access(indexFile, constants.R_OK);
} catch {
  console.error(`Cloudflare-Build fehlgeschlagen: ${indexFile} wurde nicht erzeugt.`);
  process.exit(1);
}

const entries = await readdir(outputDir);
const details = await Promise.all(
  entries.map(async (name) => {
    const info = await stat(resolve(outputDir, name));
    return `${info.isDirectory() ? "Ordner" : "Datei"}: ${name}`;
  }),
);

console.log("Cloudflare-Build geprüft: apps/web/dist/index.html ist vorhanden.");
console.log(details.join("\n"));

import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { entries } from "./library.js";

const dir = path.resolve("prototypes/library-index/test-files");
fs.mkdirSync(dir, { recursive: true });
const tinyPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z8S8AAAAASUVORK5CYII=", "base64");

for (const entry of entries) {
  const output = path.join("prototypes/library-index", entry.location);
  if (entry.fileType === "txt") fs.writeFileSync(output, `${entry.title}\n${entry.extractedText}\nAusschließlich künstliche Testdaten.\n`);
  if (entry.fileType === "png") fs.writeFileSync(output, tinyPng);
  if (entry.fileType === "pdf") await new Promise<void>((resolve, reject) => {
    const pdf = new PDFDocument({ size: "A4" }); const stream = fs.createWriteStream(output); pdf.pipe(stream);
    pdf.fontSize(18).text(entry.title).moveDown().fontSize(11).text(entry.extractedText).moveDown().text("Ausschließlich künstliche Testdaten."); pdf.end();
    stream.on("finish", resolve); stream.on("error", reject);
  });
  if (entry.fileType === "docx") {
    const doc = new Document({ sections: [{ children: [new Paragraph({ children: [new TextRun({ text: entry.title, bold: true, size: 30 })] }), new Paragraph(entry.extractedText), new Paragraph("Ausschließlich künstliche Testdaten.")] }] });
    fs.writeFileSync(output, await Packer.toBuffer(doc));
  }
}
fs.writeFileSync(path.resolve("prototypes/library-index/index.json"), JSON.stringify(entries, null, 2));
console.log("10 künstliche Bibliotheksdateien und Index erzeugt.");


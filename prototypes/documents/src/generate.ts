import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import {
  AlignmentType, BorderStyle, Document, Footer, Header, Packer, PageBreak,
  PageNumber, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType
} from "docx";
import { demoMaterial, MaterialSchema, type Material } from "./material.js";

const outDir = path.resolve("artifacts/machbarkeit");
fs.mkdirSync(outDir, { recursive: true });

function drawPdfHeader(doc: PDFKit.PDFDocument, solution: boolean): void {
  doc.x = 62;
  doc.y = 48;
  doc.font("Helvetica-Bold").fontSize(18).fillColor("black").text(solution ? `${demoMaterial.title} - Lösung` : demoMaterial.title, 62, 48, { width: 471 });
  doc.x = 62;
  doc.moveDown(0.35).font("Helvetica").fontSize(10).text(`Deutsch · Klasse ${demoMaterial.grade}`);
  if (!solution) {
    doc.moveDown(0.7).fontSize(11).text("Name: ______________________________    Datum: ________________");
  }
  doc.moveDown(0.7).fontSize(10).text(`Lernziel: ${demoMaterial.learningGoal}`);
  doc.moveDown(0.8);
}

function drawPdfTask(doc: PDFKit.PDFDocument, task: Material["tasks"][number], index: number): void {
  doc.font("Helvetica-Bold").fontSize(12).text(`${index + 1}. ${task.instruction}`);
  doc.moveDown(0.25).font("Helvetica").fontSize(11).text(task.items.join("     "));
  if (task.imagePlaceholder) {
    const y = doc.y + 6;
    doc.rect(70, y, 170, 55).stroke().rect(290, y, 170, 55).stroke();
    doc.fontSize(9).text("Neutrales Bildfeld", 112, y + 22).text("Neutrales Bildfeld", 332, y + 22);
    doc.y = y + 65;
    doc.x = 62;
  }
  for (let line = 0; line < task.writingLines; line += 1) {
    doc.moveDown(0.7).moveTo(62, doc.y).lineTo(533, doc.y).strokeColor("black").stroke();
  }
  doc.moveDown(0.8);
}

function writePdf(material: Material, output: string): Promise<void> {
  MaterialSchema.parse(material);
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margins: { top: 48, bottom: 48, left: 62, right: 62 }, autoFirstPage: true });
    const stream = fs.createWriteStream(output);
    doc.pipe(stream);
    drawPdfHeader(doc, false);
    material.tasks.forEach((task, index) => drawPdfTask(doc, task, index));
    doc.addPage();
    drawPdfHeader(doc, true);
    material.tasks.forEach((task, index) => {
      doc.font("Helvetica-Bold").fontSize(12).text(`${index + 1}. ${task.instruction}`);
      doc.moveDown(0.2).font("Helvetica").fontSize(11).text(task.answer).moveDown(0.8);
    });
    doc.fontSize(9).text("Hinweis: Bei Aufgabe 4 sind andere fachlich richtige Sätze möglich.");
    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

const borders = { top: { style: BorderStyle.SINGLE, size: 6, color: "A8B8B2" }, bottom: { style: BorderStyle.SINGLE, size: 6, color: "A8B8B2" }, left: { style: BorderStyle.SINGLE, size: 6, color: "A8B8B2" }, right: { style: BorderStyle.SINGLE, size: 6, color: "A8B8B2" } };

function taskParagraphs(task: Material["tasks"][number], index: number): Paragraph[] {
  const paragraphs = [
    new Paragraph({ spacing: { before: 220, after: 90 }, children: [new TextRun({ text: `${index + 1}. ${task.instruction}`, bold: true, size: 24 })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: task.items.join("     "), size: 22 })] })
  ];
  for (let line = 0; line < task.writingLines; line += 1) {
    paragraphs.push(new Paragraph({ spacing: { before: 90, after: 30 }, children: [new TextRun({ text: "________________________________________________________________________________", size: 18, color: "777777" })] }));
  }
  return paragraphs;
}

async function writeDocx(material: Material, output: string): Promise<void> {
  MaterialSchema.parse(material);
  const children: Array<Paragraph | Table> = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: material.title, bold: true, size: 34 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 220 }, children: [new TextRun({ text: `Deutsch · Klasse ${material.grade}`, size: 20 })] }),
    new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: "Name: ______________________________    Datum: ________________", size: 22 })] }),
    new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: `Lernziel: ${material.learningGoal}`, size: 20 })] })
  ];
  material.tasks.forEach((task, index) => {
    children.push(...taskParagraphs(task, index));
    if (task.imagePlaceholder) {
      children.push(new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [4560, 4560], rows: [new TableRow({ children: [1, 2].map((n) => new TableCell({ width: { size: 4560, type: WidthType.DXA }, borders, shading: { fill: "F2F5F4", type: ShadingType.CLEAR }, margins: { top: 450, bottom: 450, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(`Neutrales Bildfeld ${n}`)] })] })) })] }));
    }
  });
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: `${material.title} - Lösung`, bold: true, size: 34 })] }));
  material.tasks.forEach((task, index) => {
    children.push(new Paragraph({ spacing: { before: 180, after: 70 }, children: [new TextRun({ text: `${index + 1}. ${task.instruction}`, bold: true, size: 24 })] }));
    children.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: task.answer, size: 22 })] }));
  });
  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 22, color: "000000" }, paragraph: { spacing: { after: 120, line: 276 } } } } },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 1276, bottom: 1134, left: 1276 } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "LehrerKompass · Machbarkeitsprototyp", size: 16, color: "4D6B63" })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ children: ["Seite ", PageNumber.CURRENT], size: 16 })] })] }) },
      children
    }]
  });
  fs.writeFileSync(output, await Packer.toBuffer(doc));
}

await writePdf(demoMaterial, path.join(outDir, "Nomen_mit_Artikeln_Test.pdf"));
await writeDocx(demoMaterial, path.join(outDir, "Nomen_mit_Artikeln_Test.docx"));
console.log("Dokumentartefakte erzeugt.");

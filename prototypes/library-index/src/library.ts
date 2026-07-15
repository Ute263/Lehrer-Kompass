import { z } from "zod";

export const LibraryEntrySchema = z.object({
  id: z.string(), title: z.string(), fileType: z.enum(["pdf", "docx", "txt", "png"]), grade: z.number().int().nullable(),
  subject: z.string(), topic: z.string(), materialType: z.string(), rating: z.enum(["bewährt", "gut, aber anpassen", "nur Ideenquelle", "noch nicht geprüft"]),
  location: z.string(), extractedText: z.string(), indexStatus: z.enum(["Text extrahiert", "Nur Metadaten", "Nicht automatisch lesbar", "Zuordnung prüfen"]),
  hasSolution: z.boolean(), lowWriting: z.boolean(), links: z.array(z.object({ targetType: z.enum(["Stunde", "Reihe", "Fördergruppe"]), targetId: z.string() })).min(1)
});
export type LibraryEntry = z.infer<typeof LibraryEntrySchema>;

export const entries: LibraryEntry[] = [
  { id:"m1",title:"Nomen mit Artikeln - Arbeitsblatt",fileType:"pdf",grade:2,subject:"Deutsch",topic:"Nomen",materialType:"Arbeitsblatt",rating:"bewährt",location:"test-files/nomen-artikel.pdf",extractedText:"Nomen Klasse 2 der die das wenig schreiben Lösung vorhanden",indexStatus:"Text extrahiert",hasSolution:true,lowWriting:true,links:[{targetType:"Stunde",targetId:"de-2-nomen-3"},{targetType:"Reihe",targetId:"de-2-nomen"}] },
  { id:"m2",title:"Nomen-Karten",fileType:"docx",grade:2,subject:"Deutsch",topic:"Nomen",materialType:"Karten",rating:"gut, aber anpassen",location:"test-files/nomen-karten.docx",extractedText:"Nomen erkennen Artikel Karten",indexStatus:"Text extrahiert",hasSolution:false,lowWriting:true,links:[{targetType:"Stunde",targetId:"de-2-nomen-2"}] },
  { id:"m3",title:"Wasser-Versuch schwimmen und sinken",fileType:"txt",grade:2,subject:"Sachunterricht",topic:"Wasser",materialType:"Versuch",rating:"bewährt",location:"test-files/wasser-versuch.txt",extractedText:"Wasser Versuch Schwimmen Sinken Beobachtung Lösung vorhanden",indexStatus:"Text extrahiert",hasSolution:true,lowWriting:false,links:[{targetType:"Stunde",targetId:"su-2-wasser-1"}] },
  { id:"m4",title:"Wasserkreislauf Bild",fileType:"png",grade:3,subject:"Sachunterricht",topic:"Wasser",materialType:"Bild",rating:"noch nicht geprüft",location:"test-files/wasserkreislauf.png",extractedText:"",indexStatus:"Nicht automatisch lesbar",hasSolution:false,lowWriting:false,links:[{targetType:"Reihe",targetId:"su-3-wasser"}] },
  { id:"m5",title:"Plusaufgaben bis 100",fileType:"pdf",grade:2,subject:"Mathematik",topic:"Addition",materialType:"Arbeitsblatt",rating:"bewährt",location:"test-files/plus-bis-100.pdf",extractedText:"Mathematik Klasse 2 Addition Arbeitsblatt Lösung vorhanden",indexStatus:"Text extrahiert",hasSolution:true,lowWriting:false,links:[{targetType:"Stunde",targetId:"ma-2-add-4"}] },
  { id:"m6",title:"Lesetext Wald",fileType:"docx",grade:3,subject:"Deutsch",topic:"Lesen",materialType:"Lesetext",rating:"nur Ideenquelle",location:"test-files/lesetext-wald.docx",extractedText:"Lesetext Wald Fragen",indexStatus:"Text extrahiert",hasSolution:false,lowWriting:false,links:[{targetType:"Stunde",targetId:"de-3-lesen-1"}] },
  { id:"m7",title:"Rhythmus-Karten",fileType:"txt",grade:2,subject:"Musik",topic:"Rhythmus",materialType:"Karten",rating:"gut, aber anpassen",location:"test-files/rhythmus-karten.txt",extractedText:"Rhythmus klatschen Karten",indexStatus:"Text extrahiert",hasSolution:false,lowWriting:true,links:[{targetType:"Stunde",targetId:"mu-2-rhythmus"}] },
  { id:"m8",title:"Farben mischen",fileType:"png",grade:2,subject:"Kunst",topic:"Farben",materialType:"Bildimpuls",rating:"noch nicht geprüft",location:"test-files/farben-mischen.png",extractedText:"",indexStatus:"Nur Metadaten",hasSolution:false,lowWriting:false,links:[{targetType:"Stunde",targetId:"ku-2-farben"}] },
  { id:"m9",title:"Bewegungspause Tiere",fileType:"pdf",grade:1,subject:"Sport",topic:"Bewegung",materialType:"Karten",rating:"bewährt",location:"test-files/bewegung-tiere.pdf",extractedText:"Bewegung Tiere Pause",indexStatus:"Text extrahiert",hasSolution:false,lowWriting:true,links:[{targetType:"Fördergruppe",targetId:"fg-motorik-demo"}] },
  { id:"m10",title:"Unklare Materialnotiz",fileType:"txt",grade:null,subject:"Unklar",topic:"Unklar",materialType:"Notiz",rating:"noch nicht geprüft",location:"test-files/unklar.txt",extractedText:"künstliche unsortierte Notiz",indexStatus:"Zuordnung prüfen",hasSolution:false,lowWriting:false,links:[{targetType:"Reihe",targetId:"pruefen"}] }
].map((entry) => LibraryEntrySchema.parse(entry));

const normalize = (value: string) => value.toLocaleLowerCase("de-DE").replace(/[^a-z0-9äöüß]+/g, " ").replace(/\bbewährtes\b/g, "bewährt").trim();

export function search(query: string, filters: Partial<Pick<LibraryEntry, "subject" | "grade" | "materialType">> = {}): LibraryEntry[] {
  const terms = normalize(query).split(" ").filter(Boolean);
  return entries
    .filter((entry) => filters.subject === undefined || entry.subject === filters.subject)
    .filter((entry) => filters.grade === undefined || entry.grade === filters.grade)
    .filter((entry) => filters.materialType === undefined || entry.materialType === filters.materialType)
    .map((entry) => {
      const searchable = normalize([entry.title, entry.fileType, entry.grade ? `Klasse ${entry.grade}` : "", entry.subject, entry.topic, entry.materialType, entry.rating, entry.extractedText, entry.hasSolution ? "Lösung vorhanden" : "", entry.lowWriting ? "wenig schreiben" : ""].join(" "));
      const score = terms.reduce((sum, term) => sum + (searchable.includes(term) ? 1 : 0), 0);
      return { entry, score };
    })
    .filter(({ score }) => score === terms.length)
    .sort((a, b) => b.score - a.score || (a.entry.rating === "bewährt" ? -1 : 1))
    .map(({ entry }) => entry);
}

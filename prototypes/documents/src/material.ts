import { z } from "zod";

const TaskSchema = z.object({
  id: z.string().min(1),
  instruction: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
  answer: z.string().min(1),
  writingLines: z.number().int().min(1).max(8),
  imagePlaceholder: z.string().optional()
});

export const MaterialSchema = z.object({
  title: z.string().min(1),
  grade: z.number().int().positive(),
  subject: z.string().min(1),
  learningGoal: z.string().min(1),
  tasks: z.array(TaskSchema).length(4)
});

export type Material = z.infer<typeof MaterialSchema>;

export const demoMaterial: Material = MaterialSchema.parse({
  title: "Nomen mit Artikeln erkennen",
  grade: 2,
  subject: "Deutsch",
  learningGoal: "Nomen erkennen und die passenden Artikel der, die oder das zuordnen.",
  tasks: [
    { id: "t1", instruction: "Kreise alle Nomen ein.", items: ["laufen", "Hund", "Schule", "klein", "Ball", "lachen"], answer: "Hund, Schule, Ball", writingLines: 2 },
    { id: "t2", instruction: "Schreibe den passenden Artikel vor jedes Nomen.", items: ["___ Tisch", "___ Blume", "___ Fenster", "___ Katze"], answer: "der Tisch, die Blume, das Fenster, die Katze", writingLines: 2 },
    { id: "t3", instruction: "Benenne die neutralen Bildfelder mit Artikel.", items: ["Bildfeld 1", "Bildfeld 2"], answer: "Beispiellösung: der Ball, die Tasse", writingLines: 3, imagePlaceholder: "neutrales Bildfeld" },
    { id: "t4", instruction: "Schreibe einen Satz mit einem Nomen und unterstreiche das Nomen.", items: ["Mein Satz:"], answer: "Beispiellösung: Der Hund spielt." , writingLines: 4 }
  ]
});


export type TopicLesson = {
  id: string;
  title: string;
  focus: string;
  objective: string;
  opening: string;
  development: string;
  consolidation: string;
  reflection: string;
  notes: string;
  materialIds: string[];
};
export type TopicMaterial = { id: string; title: string; kind: string; lessonId?: string; status: "fertig" | "entwurf"; createdAt: string };
export type TopicTask = { id: string; text: string; done: boolean };
export type TopicRecord = { id: string; title: string; subject: string; classLevel: string; schoolYear: string; description: string; lessons: TopicLesson[]; materials: TopicMaterial[]; tasks: TopicTask[]; updatedAt: string };

const KEY = "lehrerkompass.themen.v1";
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const normalizeLesson = (lesson: Partial<TopicLesson> & Pick<TopicLesson, "id" | "title">): TopicLesson => ({
  id: lesson.id,
  title: lesson.title,
  focus: lesson.focus || "",
  objective: lesson.objective || lesson.focus || "",
  opening: lesson.opening || "",
  development: lesson.development || "",
  consolidation: lesson.consolidation || "",
  reflection: lesson.reflection || "",
  notes: lesson.notes || "",
  materialIds: lesson.materialIds || [],
});

export function readTopics(): TopicRecord[] {
  try {
    const topics = JSON.parse(localStorage.getItem(KEY) || "[]") as TopicRecord[];
    return topics.map((topic) => ({ ...topic, lessons: topic.lessons.map(normalizeLesson) }));
  } catch { return []; }
}
export function writeTopics(topics: TopicRecord[]) {
  localStorage.setItem(KEY, JSON.stringify(topics));
  window.dispatchEvent(new Event("lehrerkompass:topics"));
}
export function createTopic(input: Pick<TopicRecord, "title" | "subject" | "classLevel" | "schoolYear" | "description"> & { lessonCount: number }): TopicRecord {
  const topic: TopicRecord = {
    id: makeId("thema"), title: input.title.trim(), subject: input.subject, classLevel: input.classLevel,
    schoolYear: input.schoolYear, description: input.description.trim(),
    lessons: Array.from({ length: input.lessonCount }, (_, index) => normalizeLesson({ id: makeId("stunde"), title: `Stunde ${index + 1}` })),
    materials: [], tasks: [], updatedAt: new Date().toISOString(),
  };
  writeTopics([topic, ...readTopics()]); return topic;
}
export function updateTopic(next: TopicRecord) {
  writeTopics(readTopics().map((topic) => topic.id === next.id ? { ...next, updatedAt: new Date().toISOString() } : topic));
}
export function addMaterial(topic: TopicRecord, title: string, kind: string, lessonId?: string) {
  const material: TopicMaterial = { id: makeId("material"), title: title.trim(), kind, lessonId: lessonId || undefined, status: "entwurf", createdAt: new Date().toISOString() };
  const lessons = topic.lessons.map((lesson) => lesson.id === lessonId ? { ...lesson, materialIds: [...lesson.materialIds, material.id] } : lesson);
  const next = { ...topic, lessons, materials: [...topic.materials, material] }; updateTopic(next); return next;
}
export function addTask(topic: TopicRecord, text: string) {
  const next = { ...topic, tasks: [...topic.tasks, { id: makeId("aufgabe"), text: text.trim(), done: false }] }; updateTopic(next); return next;
}

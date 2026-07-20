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
const emptyLesson = (id: string, title: string, focus = ""): TopicLesson => ({
  id, title, focus, objective: focus, opening: "", development: "", consolidation: "", reflection: "", notes: "", materialIds: [],
});

function normalizeTopic(topic: TopicRecord): TopicRecord {
  return {
    ...topic,
    lessons: (topic.lessons || []).map((lesson) => ({
      ...emptyLesson(lesson.id, lesson.title, lesson.focus || ""),
      ...lesson,
      objective: lesson.objective ?? lesson.focus ?? "",
      materialIds: lesson.materialIds || [],
    })),
    materials: topic.materials || [],
    tasks: topic.tasks || [],
  };
}

export function readTopics(): TopicRecord[] {
  try { return (JSON.parse(localStorage.getItem(KEY) || "[]") as TopicRecord[]).map(normalizeTopic); } catch { return []; }
}
export function writeTopics(topics: TopicRecord[]) {
  localStorage.setItem(KEY, JSON.stringify(topics));
  window.dispatchEvent(new Event("lehrerkompass:topics"));
}
export function createTopic(input: Pick<TopicRecord, "title" | "subject" | "classLevel" | "schoolYear" | "description"> & { lessonCount: number }): TopicRecord {
  const topic: TopicRecord = {
    id: makeId("thema"), title: input.title.trim(), subject: input.subject, classLevel: input.classLevel,
    schoolYear: input.schoolYear, description: input.description.trim(),
    lessons: Array.from({ length: input.lessonCount }, (_, index) => emptyLesson(makeId("stunde"), `Stunde ${index + 1}`)),
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

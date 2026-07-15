import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { demoLesson, MemoryLessonServer, OfflineDatabase, OfflineLessonService } from "./store.js";

const names: string[] = [];
function setup() {
  const name = `offline-${crypto.randomUUID()}`; names.push(name);
  const db = new OfflineDatabase(name);
  const server = new MemoryLessonServer(); server.seed(demoLesson);
  return { db, server, service: new OfflineLessonService(db, server) };
}
afterEach(async () => { for (const name of names.splice(0)) await new OfflineDatabase(name).delete(); });

describe("offline copy, queue and conflict protection", () => {
  it("persists an edit across a database reopen and synchronizes after reconnect", async () => {
    const { db, server, service } = setup();
    await db.lessons.put(demoLesson);
    server.online = false;
    await service.edit(demoLesson.id, { notes: "offline geändert" });
    await service.sync();
    expect((await db.lessons.get(demoLesson.id))?.status).toBe("fehlgeschlagen");
    const reopened = new OfflineDatabase(db.name);
    expect((await reopened.lessons.get(demoLesson.id))?.notes).toBe("offline geändert");
    server.online = true;
    await new OfflineLessonService(reopened, server).sync();
    expect((await reopened.lessons.get(demoLesson.id))?.status).toBe("synchronisiert");
    expect(await reopened.queue.count()).toBe(0);
    db.close(); reopened.close();
  });

  it("keeps local and server versions when versions conflict", async () => {
    const { db, server, service } = setup();
    await db.lessons.put(demoLesson);
    await service.edit(demoLesson.id, { notes: "lokale Fassung" });
    server.seed({ ...demoLesson, version: 2, notes: "Server-Fassung" });
    await service.sync();
    const conflict = await db.conflicts.get(demoLesson.id);
    expect(conflict?.local.notes).toBe("lokale Fassung");
    expect(conflict?.server.notes).toBe("Server-Fassung");
    expect((await db.lessons.get(demoLesson.id))?.status).toBe("Konflikt");
    expect(await db.queue.count()).toBe(1);
    db.close();
  });
});


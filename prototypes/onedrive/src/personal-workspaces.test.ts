import { describe, expect, it } from "vitest";
import { PersonalWorkspaceRepository, ServerSessionService } from "./personal-workspaces.js";

describe("independent personal Microsoft workspaces", () => {
  it("derives stable separate workspaces from authenticated personal identities", () => {
    const sessions = new ServerSessionService();
    const personA = sessions.create({ provider: "microsoft", accountType: "personal", providerAccountId: "personal-a" });
    const personAAgain = sessions.create({ provider: "microsoft", accountType: "personal", providerAccountId: "personal-a" });
    const personB = sessions.create({ provider: "microsoft", accountType: "personal", providerAccountId: "personal-b" });
    expect(personA.userId).toBe(personAAgain.userId);
    expect(personA.workspaceId).toBe(personAAgain.workspaceId);
    expect(personA.workspaceId).not.toBe(personB.workspaceId);
  });

  it("ignores a client-supplied foreign userId and prevents cross-workspace reads", () => {
    const sessions = new ServerSessionService(); const repository = new PersonalWorkspaceRepository();
    const personA = sessions.create({ provider: "microsoft", accountType: "personal", providerAccountId: "personal-a" });
    const personB = sessions.create({ provider: "microsoft", accountType: "personal", providerAccountId: "personal-b" });
    const saved = repository.saveObject(personA, { id: "lesson-1", kind: "lesson", title: "Nur Person A", userId: personB.userId });
    expect(saved.workspaceId).toBe(personA.workspaceId);
    expect(repository.listObjects(personB)).toEqual([]);
    expect(() => repository.getObject(personB, "lesson-1")).toThrow();
  });

  it("keeps OneDrive bindings account-scoped across an account switch", () => {
    const sessions = new ServerSessionService(); const repository = new PersonalWorkspaceRepository();
    const personA = sessions.create({ provider: "microsoft", accountType: "personal", providerAccountId: "personal-a" });
    const personB = sessions.create({ provider: "microsoft", accountType: "personal", providerAccountId: "personal-b" });
    repository.bindOneDrive(personA, { driveId: "drive-a", folderId: "folder-a" });
    repository.bindOneDrive(personB, { driveId: "drive-b", folderId: "folder-b" });
    expect(repository.getOneDriveBinding(personA).driveId).toBe("drive-a");
    expect(repository.getOneDriveBinding(personB).driveId).toBe("drive-b");
    expect(repository.getOneDriveBinding(personB)).not.toMatchObject({ folderId: "folder-a" });
  });
});

import { createHash } from "node:crypto";
import { z } from "zod";
import { appError } from "../../shared/error.js";

export const AuthenticatedIdentitySchema = z.object({
  provider: z.literal("microsoft"),
  accountType: z.literal("personal"),
  providerAccountId: z.string().min(1)
});
export type AuthenticatedIdentity = z.infer<typeof AuthenticatedIdentitySchema>;

export const SessionSchema = z.object({
  sessionId: z.string().min(1),
  userId: z.string().min(1),
  workspaceId: z.string().min(1),
  providerAccountId: z.string().min(1)
});
export type Session = z.infer<typeof SessionSchema>;

export class ServerSessionService {
  create(identityInput: AuthenticatedIdentity): Session {
    const identity = AuthenticatedIdentitySchema.parse(identityInput);
    const digest = createHash("sha256").update(`microsoft-personal:${identity.providerAccountId}`).digest("hex").slice(0, 24);
    return SessionSchema.parse({
      sessionId: crypto.randomUUID(),
      userId: `user_${digest}`,
      workspaceId: `workspace_${digest}`,
      providerAccountId: identity.providerAccountId
    });
  }
}

export interface WorkspaceObject { id: string; workspaceId: string; kind: string; title: string }
export interface OneDriveBinding { workspaceId: string; providerAccountId: string; driveId: string; folderId: string }

export class PersonalWorkspaceRepository {
  private readonly objects = new Map<string, WorkspaceObject>();
  private readonly bindings = new Map<string, OneDriveBinding>();

  saveObject(session: Session, input: { id: string; kind: string; title: string; userId?: string }): WorkspaceObject {
    const object = { id: input.id, workspaceId: session.workspaceId, kind: input.kind, title: input.title };
    this.objects.set(`${session.workspaceId}:${input.id}`, object);
    return structuredClone(object);
  }

  listObjects(session: Session): WorkspaceObject[] {
    return [...this.objects.values()].filter((object) => object.workspaceId === session.workspaceId).map((object) => structuredClone(object));
  }

  getObject(session: Session, id: string): WorkspaceObject {
    const object = this.objects.get(`${session.workspaceId}:${id}`);
    if (!object) throw appError("WORKSPACE_OBJECT_NOT_FOUND", "Objekt ist im persönlichen Workspace nicht vorhanden.");
    return structuredClone(object);
  }

  bindOneDrive(session: Session, binding: Omit<OneDriveBinding, "workspaceId" | "providerAccountId">): OneDriveBinding {
    const stored = { ...binding, workspaceId: session.workspaceId, providerAccountId: session.providerAccountId };
    this.bindings.set(session.workspaceId, stored);
    return structuredClone(stored);
  }

  getOneDriveBinding(session: Session): OneDriveBinding {
    const binding = this.bindings.get(session.workspaceId);
    if (!binding || binding.providerAccountId !== session.providerAccountId) {
      throw appError("ONEDRIVE_BINDING_NOT_FOUND", "Keine OneDrive-Verknüpfung für dieses persönliche Konto.");
    }
    return structuredClone(binding);
  }
}


import {
  createRouter,
  type CreateTestAppReturnT,
} from "@/server/lib/create-app";
import { updateInviteCodeHandler } from "./update-invite-code.handler";
import { updateInviteCodeRoute } from "./update-invite-code.route";
import * as http from "@/server/lib/http-status-codes";
import { WorkspaceRoles } from "@/server/db/schemas";

const MOCK_USER = vi.hoisted(() => ({
  id: crypto.randomUUID(),
  name: "Test User",
}));

const MOCK_WORKSPACE = {
  id: crypto.randomUUID(),
  name: "Mocked Workspace",
  role: WorkspaceRoles.admin,
};

const API_ENDPOINT = `/api/workspaces/${MOCK_WORKSPACE.id}/invite-code`;

const options = {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
};

const db = vi.hoisted(() => ({
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  innerJoin: vi.fn().mockReturnThis(),
  where: vi.fn(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
}));

vi.mock("@/server/db", () => ({ db }));

vi.mock("@/server/middlewares/session", async () => {
  const { sessionMiddlewareMockFactory } = await import(
    "@/server/middlewares/session/session.mock"
  );
  return sessionMiddlewareMockFactory(MOCK_USER);
});

describe("POST /api/workspaces/{id}/invite-code", () => {
  let app: CreateTestAppReturnT;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createRouter();
    app.openapi(updateInviteCodeRoute, updateInviteCodeHandler);
  });

  it("should return 200 OK when the owner changes invite code", async () => {
    db.where.mockResolvedValueOnce([
      { ...MOCK_WORKSPACE, role: WorkspaceRoles.owner },
    ]);
    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(http.OK);

    const data = (await res.json()) as { id: string; inviteCode: string };
    expect(data?.id).toEqual(MOCK_WORKSPACE.id);
    expect(data?.inviteCode).toBeTypeOf("string");
    expect(data?.inviteCode).toHaveLength(6);

    expect(db.update).toHaveBeenCalledOnce();
    expect(db.set).toHaveBeenCalledOnce();
  });

  it("should return 200 OK when an admin changes invite code", async () => {
    db.where.mockResolvedValueOnce([MOCK_WORKSPACE]);
    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(http.OK);

    const data = (await res.json()) as { id: string; inviteCode: string };
    expect(data?.id).toEqual(MOCK_WORKSPACE.id);
    expect(data?.inviteCode).toBeTypeOf("string");
    expect(data?.inviteCode).toHaveLength(6);

    expect(db.update).toHaveBeenCalledOnce();
    expect(db.set).toHaveBeenCalledOnce();
  });

  it("should return 200 OK when an removes the invite code", async () => {
    db.where.mockResolvedValueOnce([MOCK_WORKSPACE]);
    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify({ remove: true }),
    });
    expect(res.status).toBe(http.OK);

    const data = (await res.json()) as { id: string; inviteCode: undefined };
    expect(data?.id).toEqual(MOCK_WORKSPACE.id);
    expect(data?.inviteCode).toBeUndefined();

    expect(db.update).toHaveBeenCalledOnce();
    expect(db.set).toHaveBeenCalledOnce();
    expect(db.set).toHaveBeenCalledWith({ inviteCode: null });
  });

  it("should return 401 Unauthorized when a user tries to update invite code and is not an admin", async () => {
    const requestBody = {};
    db.where.mockResolvedValueOnce([
      { ...MOCK_WORKSPACE, role: WorkspaceRoles.user },
    ]);
    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });
    expect(res.status).toBe(http.UNAUTHORIZED);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("should return 422 Unprocessable Entity for invalid input", async () => {
    const requestBody = { remove: 1738 };

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.UNPROCESSABLE_ENTITY);
  });

  it("should return 500 Internal Server Error if the database returning fails", async () => {
    const requestBody = {};
    const dbError = new Error("returning failed");
    db.select.mockRejectedValue(dbError);

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.INTERNAL_SERVER_ERROR);
    expect(await res.json()).toEqual({ error: "Internal Server Error" });
  });
});

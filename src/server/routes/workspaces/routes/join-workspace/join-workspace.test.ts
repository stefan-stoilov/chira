import {
  createRouter,
  type CreateTestAppReturnT,
} from "@/server/lib/create-app";
import { joinWorkspaceHandler } from "./join-workspace.handler";
import { joinWorkspaceRoute } from "./join-workspace.route";
import * as http from "@/server/lib/http-status-codes";

const MOCK_USER = vi.hoisted(() => ({
  id: crypto.randomUUID(),
  name: "Test User",
}));

const MOCK_WORKSPACE = {
  id: crypto.randomUUID(),
  name: "Mocked Workspace",
  inviteCode: "TEST12",
  userId: MOCK_USER.id,
};

const API_ENDPOINT = `/api/workspaces/${MOCK_WORKSPACE.id}/join`;

const options = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
};

const db = vi.hoisted(() => ({
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  innerJoin: vi.fn().mockReturnThis(),
  where: vi.fn(),
  delete: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
}));

vi.mock("@/server/db", () => ({ db }));

vi.mock("@/server/middlewares/session", async () => {
  const { sessionMiddlewareMockFactory } = await import(
    "@/server/middlewares/session/session.mock"
  );
  return sessionMiddlewareMockFactory(MOCK_USER);
});

describe("POST /api/workspaces/{id}/join", () => {
  let app: CreateTestAppReturnT;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createRouter();
    app.openapi(joinWorkspaceRoute, joinWorkspaceHandler);
  });

  it("should return 200 OK, delete a join request if it exist and create a new join request for workspace", async () => {
    const requestBody = { inviteCode: MOCK_WORKSPACE.inviteCode };
    db.where.mockResolvedValueOnce([MOCK_WORKSPACE]);
    db.where.mockResolvedValueOnce([]);

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.OK);
    expect(await res.json()).toEqual({ name: MOCK_WORKSPACE.name });
    expect(db.delete).toHaveBeenCalledOnce();
    expect(db.insert).toHaveBeenCalledOnce();
    expect(db.values).toHaveBeenCalledOnce();
    expect(db.values).toHaveBeenCalledWith({
      userId: MOCK_USER.id,
      workspaceId: MOCK_WORKSPACE.id,
    });
  });

  it("should return 401 Unauthorized if the invite code in payload does not match that of the workspace", async () => {
    const requestBody = { inviteCode: "123456" };
    db.where.mockResolvedValue([MOCK_WORKSPACE]);

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.UNAUTHORIZED);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("should return 401 Unauthorized if the invite code is being sent from an existing member of the workspace", async () => {
    const requestBody = { inviteCode: MOCK_WORKSPACE.inviteCode };
    db.where
      .mockResolvedValueOnce([MOCK_WORKSPACE])
      .mockResolvedValueOnce([{ id: MOCK_USER.id }]);

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.UNAUTHORIZED);
    expect(await res.json()).toEqual({
      error: `You are already a member of workspace - ${MOCK_WORKSPACE.name}`,
    });
  });

  it("should return 404 Not Found if workspace is not found", async () => {
    const requestBody = { inviteCode: MOCK_WORKSPACE.inviteCode };
    db.where.mockResolvedValue([]);

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.NOT_FOUND);
    expect(await res.json()).toEqual({ error: "Not found" });
  });

  it("should return 422 Unprocessable Entity for invalid input", async () => {
    const requestBody = { inviteCode: 1738 };

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.UNPROCESSABLE_ENTITY);
  });

  it("should return 500 Internal Server Error if the database returning fails", async () => {
    const requestBody = { inviteCode: MOCK_WORKSPACE.inviteCode };
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

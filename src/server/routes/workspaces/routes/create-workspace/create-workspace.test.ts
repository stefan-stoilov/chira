import {
  createRouter,
  type CreateTestAppReturnT,
} from "@/server/lib/create-app";
import { createWorkspaceHandler } from "./create-workspace.handler";
import { createWorkspaceRoute } from "./create-workspace.route";
import { WorkspaceRoles } from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

const db = vi.hoisted(() => ({
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  returning: vi.fn(),
}));

vi.mock("@/server/db", () => ({ db }));

vi.mock("@/server/middlewares/session", async () => {
  const { sessionMiddlewareMockFactory } = await import(
    "@/server/middlewares/session/session.mock"
  );
  return sessionMiddlewareMockFactory();
});

describe("POST /api/workspaces", () => {
  let app: CreateTestAppReturnT;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createRouter();
    app.openapi(createWorkspaceRoute, createWorkspaceHandler);
  });

  it("should create a new workspace and return it", async () => {
    const requestBody = { name: "New Awesome Workspace" };
    const newWorkspaceId = crypto.randomUUID();
    const expectedResponse = {
      id: newWorkspaceId,
      name: requestBody.name,
      role: WorkspaceRoles.owner,
      allowMemberInviteManagement: true,
    };

    db.returning.mockResolvedValue([{ workspaceId: expectedResponse.id }]);

    const res = await app.request("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.CREATED);
    expect(await res.json()).toEqual(expectedResponse);
    expect(db.returning).toHaveBeenCalledOnce();
  });

  it("should return 422 Unprocessable Entity for invalid input", async () => {
    const requestBody = { name: " " };

    const res = await app.request("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.UNPROCESSABLE_ENTITY);
  });

  it("should return 500 Internal Server Error if the database returning fails", async () => {
    const requestBody = { name: "Failing Workspace" };
    const dbError = new Error("returning failed");
    db.returning.mockRejectedValue(dbError);

    const res = await app.request("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.INTERNAL_SERVER_ERROR);
    expect(await res.json()).toEqual({ error: "Internal Server Error" });
  });
});

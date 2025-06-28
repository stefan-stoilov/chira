import {
  createRouter,
  type CreateTestAppReturnT,
} from "@/server/lib/create-app";
import { updateWorkspaceHandler } from "./update-workspace.handler";
import { updateWorkspaceRoute } from "./update-workspace.route";
import { WorkspaceRoles } from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

const MOCK_WORKSPACE = {
  id: crypto.randomUUID(),
  name: "Mocked Workspace",
  role: WorkspaceRoles.owner,
  allowMemberInviteManagement: true,
};

const API_ENDPOINT = `/api/workspaces/${MOCK_WORKSPACE.id}`;

const options = {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
};

const db = vi.hoisted(() => ({
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  innerJoin: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  where: vi.fn(),
}));

vi.mock("@/server/db", () => ({ db }));

vi.mock("@/server/middlewares/session", async () => {
  const { sessionMiddlewareMockFactory } = await import(
    "@/server/middlewares/session/session.mock"
  );
  return sessionMiddlewareMockFactory();
});

describe("PATCH /api/workspaces/{id}", () => {
  let app: CreateTestAppReturnT;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createRouter();
    app.openapi(updateWorkspaceRoute, updateWorkspaceHandler);
  });

  it("should return 200 OK, update a workspace name successfully and return id, the new name and allowMemberInviteManagement", async () => {
    const requestBody = { name: "Updated name" };
    db.where.mockResolvedValue([MOCK_WORKSPACE]);
    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.OK);
    expect(await res.json()).toEqual({
      id: MOCK_WORKSPACE.id,
      name: requestBody.name,
      allowMemberInviteManagement: MOCK_WORKSPACE.allowMemberInviteManagement,
    });
  });

  it("should return 401 Unauthorized if the member of the workspace is not it's owner", async () => {
    const requestBody = { name: "Updated name" };
    db.where.mockResolvedValue([
      { ...MOCK_WORKSPACE, role: WorkspaceRoles.admin },
    ]);
    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.UNAUTHORIZED);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("should return 404 Not Found if workspace is not found", async () => {
    const requestBody = { name: "Updated name" };
    db.where.mockResolvedValue([]);

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.NOT_FOUND);
    expect(await res.json()).toEqual({ error: "Not found" });
  });

  it("should return 422 Unprocessable Entity for invalid input", async () => {
    const requestBody = { name: 1738 };

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.UNPROCESSABLE_ENTITY);
  });

  it("should return 500 Internal Server Error if the database returning fails", async () => {
    const requestBody = { name: "Updated name" };
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

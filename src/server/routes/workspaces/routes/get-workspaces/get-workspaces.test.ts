import {
  createRouter,
  type CreateTestAppReturnT,
} from "@/server/lib/create-app";
import { getWorkspacesHandler } from "./get-workspaces.handler";
import { getWorkspacesRoute } from "./get-workspaces.route";
import { WorkspaceRoles } from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

const MOCK_GET_WORKSPACES_RESPONSE = [
  {
    id: crypto.randomUUID(),
    name: "Mocked Workspace 1",
    role: WorkspaceRoles.owner,
  },
  {
    id: crypto.randomUUID(),
    name: "Mocked Workspace 2",
    role: WorkspaceRoles.user,
  },
];

const db = vi.hoisted(() => ({
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  innerJoin: vi.fn().mockReturnThis(),
  where: vi.fn(),
}));

vi.mock("@/server/db", () => ({ db }));

vi.mock("@/server/middlewares/session", async () => {
  const { sessionMiddlewareMockFactory } = await import(
    "@/server/middlewares/session/session.mock"
  );

  return sessionMiddlewareMockFactory();
});

describe("GET /api/workspaces", () => {
  let app: CreateTestAppReturnT;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createRouter();
    app.openapi(getWorkspacesRoute, getWorkspacesHandler);
  });

  it("should return a list of workspaces for the user", async () => {
    db.where.mockResolvedValue(MOCK_GET_WORKSPACES_RESPONSE);

    const res = await app.request("/api/workspaces");

    expect(res.status).toBe(http.OK);
    expect(await res.json()).toEqual({
      workspaces: MOCK_GET_WORKSPACES_RESPONSE,
    });
    expect(db.where).toHaveBeenCalled();
  });

  it("should return an empty list if the user has no workspaces", async () => {
    db.where.mockResolvedValue([]);

    const res = await app.request("/api/workspaces");

    expect(res.status).toBe(http.OK);
    expect(await res.json()).toEqual({ workspaces: [] });
  });

  it("should return 500 Internal Server Error if the database query fails", async () => {
    const dbError = new Error("Database connection lost");
    db.where.mockRejectedValue(dbError);

    const res = await app.request("/api/workspaces");

    expect(res.status).toBe(http.INTERNAL_SERVER_ERROR);
    expect(await res.json()).toEqual({ error: "Internal Server Error" });
  });
});

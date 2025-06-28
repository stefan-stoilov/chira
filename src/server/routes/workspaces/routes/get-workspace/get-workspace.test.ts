import {
  createRouter,
  type CreateTestAppReturnT,
} from "@/server/lib/create-app";
import { getWorkspaceHandler } from "./get-workspace.handler";
import { getWorkspaceRoute } from "./get-workspace.route";
import { WorkspaceRoles } from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

const MOCK_GET_WORKSPACE_RESPONSE = {
  id: crypto.randomUUID(),
  name: "Mocked Workspace",
  role: WorkspaceRoles.owner,
  inviteCode: "ABCDEF",
  allowMemberInviteManagement: true,
};

const db = vi.hoisted(() => ({
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  innerJoin: vi.fn(),
}));

vi.mock("@/server/db", () => ({ db }));

vi.mock("@/server/middlewares/session", async () => {
  const { sessionMiddlewareMockFactory } = await import(
    "@/server/middlewares/session/session.mock"
  );
  return sessionMiddlewareMockFactory();
});

describe("GET /api/workspaces/{id}", () => {
  let app: CreateTestAppReturnT;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createRouter();
    app.openapi(getWorkspaceRoute, getWorkspaceHandler);
  });

  it("should return workspace details for a valid member", async () => {
    db.innerJoin.mockResolvedValue([MOCK_GET_WORKSPACE_RESPONSE]);

    const res = await app.request(
      `/api/workspaces/${MOCK_GET_WORKSPACE_RESPONSE.id}`,
    );

    expect(res.status).toBe(http.OK);
    expect(await res.json()).toEqual(MOCK_GET_WORKSPACE_RESPONSE);
    expect(db.where).toHaveBeenCalled();
  });

  it("should return workspace details without invite code if it is null", async () => {
    const workspaceWithoutInvite = {
      ...MOCK_GET_WORKSPACE_RESPONSE,
      inviteCode: null,
    };
    const { id, name, role, allowMemberInviteManagement } =
      workspaceWithoutInvite;
    const expectedResponse = { id, name, role, allowMemberInviteManagement };

    db.innerJoin.mockResolvedValue([workspaceWithoutInvite]);

    const res = await app.request(
      `/api/workspaces/${MOCK_GET_WORKSPACE_RESPONSE.id}`,
    );

    expect(res.status).toBe(http.OK);
    expect(await res.json()).toEqual(expectedResponse);
  });

  it("should return 404 Not Found if user is not a member or workspace does not exist", async () => {
    db.innerJoin.mockResolvedValue([]);

    const res = await app.request(`/api/workspaces/non-existent-id`);

    expect(res.status).toBe(http.NOT_FOUND);
    expect(await res.json()).toEqual({ error: "Not found" });
  });

  it("should return 500 Internal Server Error if the database query fails", async () => {
    const dbError = new Error("Database connection lost");
    db.innerJoin.mockRejectedValue(dbError);

    const res = await app.request(
      `/api/workspaces/${MOCK_GET_WORKSPACE_RESPONSE.id}`,
    );

    expect(res.status).toBe(http.INTERNAL_SERVER_ERROR);
    expect(await res.json()).toEqual({ error: "Internal Server Error" });
  });
});

import {
  createRouter,
  type CreateTestAppReturnT,
} from "@/server/lib/create-app";
import { getWorkspaceMembersHandler } from "./get-workspace-members.handler";
import { getWorkspaceMembersRoute } from "./get-workspace-members.route";
import * as http from "@/server/lib/http-status-codes";

const MOCK = vi.hoisted(() => ({
  user: {
    id: crypto.randomUUID(),
    name: "Test user",
  },
  workspace: {
    workspaceId: crypto.randomUUID(),
    name: "Mocked Workspace",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  members: Array.from({ length: 3 }).map((_, i) => ({
    id: crypto.randomUUID(),
    name: `Test User ${i}`,
    role: "user",
    createdAt: new Date(),
  })),
}));

const db = vi.hoisted(() => ({
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  innerJoin: vi.fn().mockReturnThis(),
}));

vi.mock("@/server/db", () => ({ db }));

vi.mock("@/server/middlewares/session", async () => {
  const { sessionMiddlewareMockFactory } = await import(
    "@/server/middlewares/session/session.mock"
  );
  return sessionMiddlewareMockFactory(MOCK.user);
});

vi.mock("@/server/middlewares/is-member", async () => {
  const { isMemberMiddlewareMockFactory } = await import(
    "@/server/middlewares/is-member/is-member.mock"
  );
  const { WorkspaceRoles } = await import("@/server/db/schemas");
  const role = WorkspaceRoles.owner;
  return isMemberMiddlewareMockFactory({
    ...MOCK.workspace,
    userId: MOCK.user.id,
    role,
  });
});

const API_ENDPOINT = `/api/workspaces/${MOCK.workspace.workspaceId}/members`;

describe("GET /api/workspaces/{id}/members", () => {
  let app: CreateTestAppReturnT;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createRouter();
    app.openapi(getWorkspaceMembersRoute, getWorkspaceMembersHandler);
  });

  it("should return 200 OK and return a list of workspace members", async () => {
    db.innerJoin.mockReturnValue(MOCK.members);
    const res = await app.request(API_ENDPOINT);

    const body = (await res.json()) as unknown;

    expect(res.status).toBe(http.OK);
    expect(body).toHaveProperty("members");
    // @ts-expect-error members type not defined
    expect(body?.members).toHaveLength(MOCK.members.length);
  });

  it("should return 422 Unprocessable Entity for invalid path param", async () => {
    const notAnUUID = "test-123";
    const res = await app.request(`/api/workspaces/${notAnUUID}/members`);

    expect(res.status).toBe(http.UNPROCESSABLE_ENTITY);
  });

  it("should return 500 Internal Server Error if the database returning fails", async () => {
    const dbError = new Error("db failed");
    db.select.mockRejectedValue(dbError);

    const res = await app.request(API_ENDPOINT);

    expect(res.status).toBe(http.INTERNAL_SERVER_ERROR);
  });
});

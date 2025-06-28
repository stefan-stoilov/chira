import {
  createRouter,
  type CreateTestAppReturnT,
} from "@/server/lib/create-app";
import { getWorkspaceInvitesHandler } from "./get-workspace-invites.handler";
import { getWorkspaceInvitesRoute } from "./get-workspace-invites.route";
import * as http from "@/server/lib/http-status-codes";

const MOCK_WORKSPACE = vi.hoisted(() => ({
  id: crypto.randomUUID(),
  name: "Mocked Workspace",
  inviteCode: "TEST12",
  allowMemberInviteManagement: true,
}));
const MOCK_USER = vi.hoisted(() => ({
  id: crypto.randomUUID(),
  name: "Test User",
}));

const MOCK_INVITES = Array.from({ length: 25 }, (_, i) => ({
  id: crypto.randomUUID(),
  name: `Invited User ${i + 1}`,
  createdAt: new Date(),
  deletedAt: null,
  acceptedAt: null,
  githubId: 12345 + i,
  email: `user${i + 1}@example.com`,
}));

const BASE_API_ENDPOINT = `/api/workspaces/${MOCK_WORKSPACE.id}/invites`;

const db = vi.hoisted(() => ({
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn(),
  innerJoin: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  offset: vi.fn().mockReturnThis(),
  limit: vi.fn(),
}));

type ResponseBody = {
  invites: unknown[];
  totalPages: number;
  currentPage: number;
};

vi.mock("@/server/db", () => ({ db }));

vi.mock("@/server/middlewares/session", async () => {
  const { sessionMiddlewareMockFactory } = await import(
    "@/server/middlewares/session/session.mock"
  );
  return sessionMiddlewareMockFactory(MOCK_USER);
});

describe("GET /api/workspaces/{id}/invites", () => {
  let app: CreateTestAppReturnT;
  const RESULTS_PER_PAGE = 20;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createRouter();
    app.openapi(getWorkspaceInvitesRoute, getWorkspaceInvitesHandler);
  });

  it("should return a paginated list of workspace invites", async () => {
    const totalInvites = MOCK_INVITES.length; // 25
    const totalPages = Math.ceil(totalInvites / RESULTS_PER_PAGE); // 2
    const page = 1;

    db.where
      .mockResolvedValueOnce([MOCK_WORKSPACE]) // Workspace exists
      .mockResolvedValueOnce([{ id: MOCK_USER.id }]) // User is member
      .mockResolvedValueOnce([{ count: totalInvites }]) // Total invites count
      .mockReturnThis();

    db.limit.mockResolvedValue(MOCK_INVITES.slice(0, RESULTS_PER_PAGE));

    const res = await app.request(`${BASE_API_ENDPOINT}?page=${page}`);

    expect(res.status).toBe(http.OK);
    const body = (await res.json()) as ResponseBody;
    expect(body.invites.length).toBe(RESULTS_PER_PAGE);
    expect(body.totalPages).toBe(totalPages);
    expect(body.currentPage).toBe(page);
    expect(db.offset).toHaveBeenCalledWith(0);
    expect(db.limit).toHaveBeenCalledWith(RESULTS_PER_PAGE);
  });

  it("should return the last page if requested page is out of bounds", async () => {
    const totalInvites = MOCK_INVITES.length; // 25
    const totalPages = Math.ceil(totalInvites / RESULTS_PER_PAGE); // 2

    db.where
      .mockResolvedValueOnce([MOCK_WORKSPACE])
      .mockResolvedValueOnce([{ id: MOCK_USER.id }])
      .mockResolvedValueOnce([{ count: totalInvites }])
      .mockReturnThis();

    db.limit.mockResolvedValue(MOCK_INVITES.slice(RESULTS_PER_PAGE));

    const res = await app.request(
      `${BASE_API_ENDPOINT}?page=3`, // page 3 > totalPages 2
    );

    expect(res.status).toBe(http.OK);
    const body = (await res.json()) as ResponseBody;
    expect(body.totalPages).toBe(totalPages);
    expect(body.currentPage).toBe(totalPages); // Should be 2
    expect(db.offset).toHaveBeenCalledWith(RESULTS_PER_PAGE); // (2-1)*20
  });

  it("should return an empty list if there are no invites", async () => {
    db.where
      .mockResolvedValueOnce([MOCK_WORKSPACE])
      .mockResolvedValueOnce([{ id: MOCK_USER.id }])
      .mockResolvedValueOnce([{ count: 0 }]);

    const res = await app.request(`${BASE_API_ENDPOINT}?page=1`);

    expect(res.status).toBe(http.OK);
    expect(await res.json()).toEqual({
      invites: [],
      totalPages: 0,
      currentPage: 0,
    });
    expect(db.limit).not.toHaveBeenCalled();
  });

  it("should return 404 Not Found if workspace does not exist", async () => {
    db.where.mockResolvedValue([]); // No workspace found

    const res = await app.request(`${BASE_API_ENDPOINT}?page=1`);

    expect(res.status).toBe(http.NOT_FOUND);
    expect(await res.json()).toEqual({ error: "Not found" });
  });

  it("should return 401 Unauthorized if user is not a member of the workspace", async () => {
    db.where.mockResolvedValueOnce([MOCK_WORKSPACE]).mockResolvedValueOnce([]);

    const res = await app.request(`${BASE_API_ENDPOINT}?page=1`);

    expect(res.status).toBe(http.UNAUTHORIZED);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("should return 422 Unprocessable Entity if page query param is missing", async () => {
    const res = await app.request(BASE_API_ENDPOINT);

    expect(res.status).toBe(http.UNPROCESSABLE_ENTITY);
  });

  it("should return 500 Internal Server Error if the database query fails", async () => {
    const dbError = new Error("Database connection lost");
    db.where.mockRejectedValue(dbError);

    const res = await app.request(`${BASE_API_ENDPOINT}?page=1`);

    expect(res.status).toBe(http.INTERNAL_SERVER_ERROR);
    expect(await res.json()).toEqual({ error: "Internal Server Error" });
  });
});

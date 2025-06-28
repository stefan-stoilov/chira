import {
  createRouter,
  type CreateTestAppReturnT,
} from "@/server/lib/create-app";
import { acceptWorkspaceInvitesHandler } from "./accept-workspace-invites.handler";
import { acceptWorkspaceInvitesRoute } from "./accept-workspace-invites.route";
import { WorkspaceRoles } from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

const MOCK_WORKSPACE = {
  id: crypto.randomUUID(),
  name: "Mocked Workspace",
  role: WorkspaceRoles.owner,
  allowMemberInviteManagement: true,
};

const MOCK_WORKSPACE_MEMBERSHIP = {
  role: WorkspaceRoles.owner,
  allowMemberInviteManagement: true,
};

const MOCK_USERS = [
  {
    id: "48ff24e7-6be5-407f-8c5f-51cd7774155a",
    name: "Test User",
    email: "test@one.com",
    deletedAt: null,
    acceptedAt: null,
    githubId: null,
  },
  {
    id: "48ff24e7-6be5-407f-8c5f-51cd7774155b",
    name: "Test User",
    email: "test@two.com",
    deletedAt: null,
    acceptedAt: null,
    githubId: null,
  },
  {
    id: "48ff24e7-6be5-407f-8c5f-51cd7774155c",
    name: "Test User",
    email: "test@three.com",
    deletedAt: null,
    acceptedAt: null,
    githubId: null,
  },
];

const API_ENDPOINT = `/api/workspaces/${MOCK_WORKSPACE.id}/invites`;

const options = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
};

const db = vi.hoisted(() => ({
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  innerJoin: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  onConflictDoNothing: vi.fn().mockReturnThis(),
  where: vi.fn(),
}));

vi.mock("@/server/db", () => ({ db }));

vi.mock("@/server/middlewares/session", async () => {
  const { sessionMiddlewareMockFactory } = await import(
    "@/server/middlewares/session/session.mock"
  );
  return sessionMiddlewareMockFactory();
});

describe("POST /api/workspaces/{id}/invites", () => {
  let app: CreateTestAppReturnT;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createRouter();
    app.openapi(acceptWorkspaceInvitesRoute, acceptWorkspaceInvitesHandler);
  });

  it("should return 200 OK successfully accepted all invites and created new members", async () => {
    const requestBody = {
      userIds: MOCK_USERS.map(({ id }) => id),
    };

    db.where
      .mockResolvedValueOnce([MOCK_WORKSPACE_MEMBERSHIP])
      .mockResolvedValueOnce(MOCK_USERS)
      .mockResolvedValueOnce(MOCK_USERS.map(({ id }) => ({ userId: id })))
      .mockResolvedValueOnce(MOCK_USERS.map(({ id, name }) => ({ id, name })));

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.OK);
    expect(await res.json()).toStrictEqual({
      members: MOCK_USERS.map(({ id, name }) => ({ id, name })),
    });
  });

  it("should return 200 OK successfully accepted all invites and created new members, except for one member", async () => {
    const requestBody = {
      userIds: MOCK_USERS.map(({ id }) => id),
    };

    db.where
      .mockResolvedValueOnce([MOCK_WORKSPACE_MEMBERSHIP])
      .mockResolvedValueOnce(MOCK_USERS)
      .mockResolvedValueOnce(
        MOCK_USERS.slice(1, 3).map(({ id }) => ({
          userId: id,
        })),
      )
      .mockResolvedValueOnce(
        MOCK_USERS.slice(1, 3).map(({ id, name }) => ({ id, name })),
      );

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.OK);
    expect(await res.json()).toStrictEqual({
      members: MOCK_USERS.map(({ id, name }, i) =>
        i === 0
          ? {
              id,
              error:
                "Specified user in the request not found in pending workspace requests",
            }
          : {
              id,
              name,
            },
      ),
    });
  });

  it("Should return 401 Unauthorized if allowMemberInviteManagement is false for workspace and the user requesting the deletion has no admin or owner rights", async () => {
    const requestBody = {
      userIds: MOCK_USERS.map(({ id }) => id),
    };

    db.where.mockResolvedValueOnce([
      {
        ...MOCK_WORKSPACE_MEMBERSHIP,
        role: WorkspaceRoles.user,
        allowMemberInviteManagement: false,
      },
    ]);

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.UNAUTHORIZED);
  });

  it("should return 404 Not Found if no existing users have been found", async () => {
    const requestBody = { userIds: [crypto.randomUUID()] };

    db.where
      .mockResolvedValueOnce([MOCK_WORKSPACE_MEMBERSHIP])
      .mockResolvedValueOnce([]);

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.NOT_FOUND);
    expect(await res.json()).toStrictEqual({
      error: "No users with specified IDs have been found",
    });
  });

  it("should return 404 Not Found if workspace is not found", async () => {
    const requestBody = { userIds: [crypto.randomUUID()] };
    db.where.mockResolvedValue([]);

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.NOT_FOUND);
  });

  it("should return 404 Not Found if no pending invites been found", async () => {
    const requestBody = { userIds: [crypto.randomUUID()] };

    db.where
      .mockResolvedValueOnce([MOCK_WORKSPACE_MEMBERSHIP])
      .mockResolvedValueOnce(MOCK_USERS)
      .mockResolvedValueOnce([]);

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.NOT_FOUND);
    expect(await res.json()).toStrictEqual({
      error: "No pending invites for users with specified IDs have been found",
    });
  });

  it("should return 422 Unprocessable Entity for invalid input", async () => {
    const requestBody = { userIds: 1738 };

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.UNPROCESSABLE_ENTITY);
  });

  it("should return 500 Internal Server Error if the database returning fails", async () => {
    const requestBody = { userIds: [crypto.randomUUID()] };
    const dbError = new Error("db failed");
    db.select.mockRejectedValue(dbError);

    const res = await app.request(API_ENDPOINT, {
      ...options,
      body: JSON.stringify(requestBody),
    });

    expect(res.status).toBe(http.INTERNAL_SERVER_ERROR);
  });
});

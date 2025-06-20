import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import {
  createErrorMessageSchema,
  createValidationErrorSchema,
  jsonContent,
  jsonContentRequired,
} from "@/server/lib/utils";
import { WorkspaceRoles } from "@/server/db/schemas";
import { workspaceParamsSchema } from "@/server/schemas";
import * as http from "@/server/lib/http-status-codes";

const tags = ["Workspaces"];

export const getWorkspacesRoute = createRoute({
  method: "get",
  path: "/api/workspaces",
  tags,
  middleware: [sessionMiddleware] as const,
  responses: {
    [http.OK]: jsonContent(
      z.object({
        workspaces: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            role: z.nativeEnum(WorkspaceRoles),
          }),
        ),
      }),
      "Workspaces",
    ),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Internal Server Error",
    ),
  },
});
export type GetWorkspacesRoute = typeof getWorkspacesRoute;

export const getWorkspaceRoute = createRoute({
  method: "get",
  path: "/api/workspaces/{id}",
  tags,
  middleware: [sessionMiddleware] as const,
  request: {
    params: workspaceParamsSchema,
  },
  responses: {
    [http.OK]: jsonContent(
      z.object({
        id: z.string(),
        name: z.string(),
        role: z.nativeEnum(WorkspaceRoles),
        inviteCode: z.string().length(6).optional(),
        allowMemberInviteManagement: z.boolean(),
      }),
      "Workspaces",
    ),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.NOT_FOUND]: jsonContent(createErrorMessageSchema(), "Not found"),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Internal Server Error",
    ),
  },
});
export type GetWorkspaceRoute = typeof getWorkspaceRoute;

// TODO: extract after migrating from AppWrite
const createWorkspaceSchema = z.object({
  name: z.string({ message: "Workspace name is required." }).trim().min(1),
});

export const createWorkspaceRoute = createRoute({
  method: "post",
  path: "/api/workspaces",
  tags,
  middleware: [sessionMiddleware] as const,
  request: {
    body: jsonContentRequired(createWorkspaceSchema, "Create workspace schema"),
  },
  responses: {
    [http.CREATED]: jsonContent(
      z.object({
        id: z.string(),
        name: z.string(),
        role: z.nativeEnum(WorkspaceRoles),
        allowMemberInviteManagement: z.boolean(),
      }),
      "Create Workspace",
    ),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.UNPROCESSABLE_ENTITY]: jsonContent(
      createValidationErrorSchema(createWorkspaceSchema),
      "The validation error(s)",
    ),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Internal Server Error",
    ),
  },
});
export type CreateWorkspaceRoute = typeof createWorkspaceRoute;

// TODO: extract after migrating from AppWrite
const updateWorkspaceSchema = z.object({
  name: z.string({ message: "Workspace name is required." }).trim().min(1),
  allowMemberInviteManagement: z.boolean().optional(),
});

export const updateWorkspaceRoute = createRoute({
  method: "patch",
  path: "/api/workspaces/{id}",
  tags,
  middleware: [sessionMiddleware] as const,
  request: {
    params: workspaceParamsSchema,
    body: jsonContentRequired(updateWorkspaceSchema, "Create workspace schema"),
  },
  responses: {
    [http.OK]: jsonContent(
      z.object({
        id: z.string(),
        name: z.string(),
        allowMemberInviteManagement: z.boolean(),
      }),
      "Update Workspace",
    ),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.NOT_FOUND]: jsonContent(createErrorMessageSchema(), "Not found"),
    [http.UNPROCESSABLE_ENTITY]: jsonContent(
      createValidationErrorSchema(updateWorkspaceSchema),
      "The validation error(s)",
    ),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Internal Server Error",
    ),
  },
});
export type UpdateWorkspaceRoute = typeof updateWorkspaceRoute;

export const deleteWorkspaceRoute = createRoute({
  method: "delete",
  path: "/api/workspaces/{id}",
  tags,
  middleware: [sessionMiddleware] as const,
  request: {
    params: workspaceParamsSchema,
  },
  responses: {
    [http.OK]: jsonContent(z.object({ id: z.string() }), "Delete Workspace"),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.NOT_FOUND]: jsonContent(createErrorMessageSchema(), "Not found"),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Internal Server Error",
    ),
  },
});
export type DeleteWorkspaceRoute = typeof deleteWorkspaceRoute;

export const joinWorkspaceRoute = createRoute({
  method: "post",
  path: "/api/workspaces/{id}/join",
  tags,
  middleware: [sessionMiddleware] as const,
  request: {
    params: workspaceParamsSchema,
    body: jsonContentRequired(
      z.object({ inviteCode: z.string().length(6) }),
      "Join workspace schema",
    ),
  },
  responses: {
    [http.OK]: jsonContent(
      z.object({ name: z.string() }),
      "Request to join workspace",
    ),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.NOT_FOUND]: jsonContent(createErrorMessageSchema(), "Not found"),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Internal Server Error",
    ),
  },
});
export type JoinWorkspaceRoute = typeof joinWorkspaceRoute;

export const updateInviteCodeRoute = createRoute({
  method: "patch",
  path: "/api/workspaces/{id}/invite-code",
  tags,
  middleware: [sessionMiddleware] as const,
  request: {
    params: workspaceParamsSchema,
    body: jsonContentRequired(
      z.object({
        remove: z.boolean().optional(),
      }),
      "Update invite code schema",
    ),
  },
  responses: {
    [http.OK]: jsonContent(
      z.object({ id: z.string(), inviteCode: z.string().optional() }),
      "Update Workspace",
    ),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.NOT_FOUND]: jsonContent(createErrorMessageSchema(), "Not found"),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Internal Server Error",
    ),
  },
});
export type UpdateInviteCodeRoute = typeof updateInviteCodeRoute;

export const getWorkspaceInvitesRoute = createRoute({
  method: "get",
  path: "/api/workspaces/{id}/invites",
  tags,
  middleware: [sessionMiddleware] as const,
  request: {
    params: workspaceParamsSchema,
    query: z.object({
      page: z.number({ coerce: true }).min(1),
    }),
  },
  responses: {
    [http.OK]: jsonContent(
      z.object({
        invites: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            createdAt: z.date(),
            deletedAt: z.union([z.date(), z.null()]),
            acceptedAt: z.union([z.date(), z.null()]),
            githubId: z.union([z.number(), z.null()]),
            email: z.union([z.string(), z.null()]),
          }),
        ),
        totalPages: z.number(),
        currentPage: z.number(),
      }),
      "Workspace Invites",
    ),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.NOT_FOUND]: jsonContent(createErrorMessageSchema(), "Not found"),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Internal Server Error",
    ),
  },
});
export type GetWorkspaceInvitesRoute = typeof getWorkspaceInvitesRoute;

export const acceptWorkspaceInvitesRoute = createRoute({
  method: "post",
  path: "/api/workspaces/{id}/invites",
  tags,
  middleware: [sessionMiddleware] as const,
  request: {
    params: workspaceParamsSchema,
    body: jsonContentRequired(
      z.object({
        userIds: z.array(z.string().uuid()),
      }),
      "Accept workspace invites schema",
    ),
  },
  responses: {
    [http.OK]: jsonContent(
      z.object({
        members: z.array(
          z.union([
            z.object({
              id: z.string(),
              error: z.string(),
            }),
            z.object({
              id: z.string(),
              name: z.string(),
            }),
          ]),
        ),
      }),
      "New Workspace Members",
    ),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.NOT_FOUND]: jsonContent(createErrorMessageSchema(), "Not found"),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Internal Server Error",
    ),
  },
});
export type AcceptWorkspaceInvitesRoute = typeof acceptWorkspaceInvitesRoute;

export const softDeleteWorkspaceInvitesRoute = createRoute({
  method: "patch",
  path: "/api/workspaces/{id}/invites",
  tags,
  middleware: [sessionMiddleware] as const,
  request: {
    params: workspaceParamsSchema,
    body: jsonContentRequired(
      z.object({
        userIds: z.array(z.string().uuid()),
      }),
      "Accept workspace invites schema",
    ),
  },
  responses: {
    [http.OK]: jsonContent(
      z.object({
        deletedInvites: z.array(
          z.object({
            id: z.string(),
            error: z.string().optional(),
          }),
        ),
      }),
      "Deleted Invites",
    ),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.NOT_FOUND]: jsonContent(createErrorMessageSchema(), "Not found"),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Internal Server Error",
    ),
  },
});
export type SoftDeleteWorkspaceInvitesRoute =
  typeof softDeleteWorkspaceInvitesRoute;

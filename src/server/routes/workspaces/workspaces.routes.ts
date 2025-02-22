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
      // TODO: extract after migrating from AppWrite
      z.object({
        id: z.string(),
        name: z.string(),
        role: z.nativeEnum(WorkspaceRoles),
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
      z.object({ id: z.string(), name: z.string() }),
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

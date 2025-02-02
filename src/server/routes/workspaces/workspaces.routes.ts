import { createRoute } from "@hono/zod-openapi";

import { sessionMiddleware } from "@/server/middlewares";
import {
  createErrorMessageSchema,
  createValidationErrorSchema,
  jsonContent,
  formContent,
  createSuccessSchema,
} from "@/server/lib/utils";
import {
  workspacesSchema,
  workspaceIdSchema,
  workspaceParamsSchema,
  workspaceSchema,
} from "@/server/schemas";
import {
  createWorkspaceServerSchema,
  updateWorkspaceServerSchema,
} from "@/features/workspaces/schemas";

const tags = ["Workspaces"];

export const workspaces = createRoute({
  method: "get",
  path: "/api/workspaces",
  tags,
  middleware: [sessionMiddleware] as const,
  responses: {
    200: jsonContent(workspacesSchema, "Workspaces"),
    401: jsonContent(createErrorMessageSchema(), "Unauthorized"),
    500: jsonContent(createErrorMessageSchema(), "Server error"),
  },
});
export type WorkspacesRoute = typeof workspaces;

export const getWorkspace = createRoute({
  method: "get",
  path: "/api/workspaces/{id}",
  request: {
    params: workspaceParamsSchema,
  },
  tags,
  middleware: [sessionMiddleware] as const,
  responses: {
    200: jsonContent(workspaceSchema, "Workspace"),
    401: jsonContent(createErrorMessageSchema(), "Unauthorized"),
    404: jsonContent(createErrorMessageSchema(), "Not found"),
    500: jsonContent(createErrorMessageSchema(), "Server error"),
  },
});
export type GetWorkspaceRoute = typeof getWorkspace;

export const createWorkspace = createRoute({
  method: "post",
  path: "/api/workspaces",
  request: {
    body: formContent(createWorkspaceServerSchema, "Create workspace schema"),
  },
  tags,
  middleware: [sessionMiddleware] as const,
  responses: {
    200: jsonContent(workspaceIdSchema, "Create Workspace"),
    401: jsonContent(createErrorMessageSchema(), "Unauthorized"),
    422: jsonContent(
      createValidationErrorSchema(createWorkspaceServerSchema),
      "The validation error(s)",
    ),
    500: jsonContent(createErrorMessageSchema(), "Server error"),
  },
});
export type CreateWorkspaceRoute = typeof createWorkspace;

export const updateWorkspace = createRoute({
  method: "patch",
  path: "/api/workspaces/{id}",
  request: {
    params: workspaceParamsSchema,
    body: formContent(updateWorkspaceServerSchema, "Update workspace schema"),
  },
  tags,
  middleware: [sessionMiddleware] as const,
  responses: {
    200: jsonContent(workspaceIdSchema, "Workspace successfully updated."),
    401: jsonContent(createErrorMessageSchema(), "Unauthorized"),
    404: jsonContent(createErrorMessageSchema(), "Not found"),
    422: jsonContent(
      createValidationErrorSchema(createWorkspaceServerSchema),
      "The validation error(s)",
    ),
    500: jsonContent(createErrorMessageSchema(), "Server error"),
  },
});
export type UpdateWorkspaceRoute = typeof updateWorkspace;

import { createRoute } from "@hono/zod-openapi";

import { sessionMiddleware } from "@/server/middlewares";
import {
  createSuccessSchema,
  createErrorMessageSchema,
  createValidationErrorSchema,
  jsonContent,
  formContent,
} from "@/server/lib/utils";
import { workspaceSchema } from "@/server/schemas";
import { createWorkspaceServerSchema } from "@/features/workspaces/schemas";

const tags = ["Workspaces"];

export const workspaces = createRoute({
  method: "get",
  path: "/api/workspaces",
  tags,
  middleware: [sessionMiddleware] as const,
  responses: {
    200: jsonContent(workspaceSchema, "Workspaces"),
    401: jsonContent(createErrorMessageSchema(), "Unauthorized"),
    500: jsonContent(createErrorMessageSchema(), "Server error"),
  },
});

export type WorkspacesRoute = typeof workspaces;

export const createWorkspace = createRoute({
  method: "post",
  path: "/api/workspaces",
  request: {
    body: formContent(createWorkspaceServerSchema, "Create workspace schema"),
  },
  tags,
  middleware: [sessionMiddleware] as const,
  responses: {
    200: jsonContent(createSuccessSchema(), "Create Workspace"),
    401: jsonContent(createErrorMessageSchema(), "Unauthorized"),
    422: jsonContent(
      createValidationErrorSchema(createWorkspaceServerSchema),
      "The validation error(s)",
    ),
    500: jsonContent(createErrorMessageSchema(), "Server error"),
  },
});

export type CreateWorkspaceRoute = typeof createWorkspace;

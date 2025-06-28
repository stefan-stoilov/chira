import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import {
  createErrorMessageSchema,
  createValidationErrorSchema,
  jsonContent,
  jsonContentRequired,
} from "@/server/lib/utils";
import { WorkspaceRoles } from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

const tags = ["Workspaces"];

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

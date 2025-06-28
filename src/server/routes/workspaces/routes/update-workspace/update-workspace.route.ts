import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import {
  createErrorMessageSchema,
  createValidationErrorSchema,
  jsonContent,
  jsonContentRequired,
} from "@/server/lib/utils";
import { workspaceParamsSchema } from "@/server/schemas";
import * as http from "@/server/lib/http-status-codes";
import { WORKSPACES_TAGS } from "@/server/routes/constants";

const tags = WORKSPACES_TAGS;

export const updateWorkspaceSchema = z.object({
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

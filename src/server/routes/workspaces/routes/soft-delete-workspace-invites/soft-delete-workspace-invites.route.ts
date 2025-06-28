import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import {
  createErrorMessageSchema,
  // createValidationErrorSchema,
  jsonContent,
  jsonContentRequired,
} from "@/server/lib/utils";
// import { WorkspaceRoles } from "@/server/db/schemas";
import { workspaceParamsSchema } from "@/server/schemas";
import * as http from "@/server/lib/http-status-codes";
import { WORKSPACES_TAGS } from "@/server/routes/constants";

const tags = WORKSPACES_TAGS;

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

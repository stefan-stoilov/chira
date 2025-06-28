import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import {
  createErrorMessageSchema,
  jsonContent,
  jsonContentRequired,
} from "@/server/lib/utils";
import { workspaceParamsSchema } from "@/server/schemas";
import * as http from "@/server/lib/http-status-codes";

const tags = ["Workspaces"];

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

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

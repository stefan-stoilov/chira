import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import { createErrorMessageSchema, jsonContent } from "@/server/lib/utils";
import { WorkspaceRoles } from "@/server/db/schemas";
import { workspaceParamsSchema } from "@/server/schemas";
import * as http from "@/server/lib/http-status-codes";
import { WORKSPACES_TAGS } from "@/server/routes/constants";

const tags = WORKSPACES_TAGS;

export const getWorkspaceRoute = createRoute({
  method: "get",
  path: "/api/workspaces/{id}",
  tags,
  middleware: [sessionMiddleware] as const,
  request: { params: workspaceParamsSchema },
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

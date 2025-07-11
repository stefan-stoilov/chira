import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import { createErrorMessageSchema, jsonContent } from "@/server/lib/utils";
import { WorkspaceRoles } from "@/server/db/schemas";
import { workspaceParamsSchema } from "@/server/schemas";
import * as http from "@/server/lib/http-status-codes";
import { isMemberMiddleware } from "@/server/middlewares/is-member";

const tags = ["Members"];

export const getWorkspaceMembersRoute = createRoute({
  method: "get",
  path: "/api/workspaces/{id}/members",
  tags,
  middleware: [sessionMiddleware, isMemberMiddleware] as const,
  request: { params: workspaceParamsSchema },
  responses: {
    [http.OK]: jsonContent(
      z.object({
        members: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            role: z.nativeEnum(WorkspaceRoles),
            createdAt: z.date(),
          }),
        ),
      }),
      "Workspace Members",
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
export type GetWorkspaceMembersRoute = typeof getWorkspaceMembersRoute;

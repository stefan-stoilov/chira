import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import { createErrorMessageSchema, jsonContent } from "@/server/lib/utils";
import { WorkspaceRoles } from "@/server/db/schemas";
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

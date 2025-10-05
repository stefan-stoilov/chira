import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import { isMemberMiddleware } from "@/server/middlewares/is-member";
import { createErrorMessageSchema, jsonContent } from "@/server/lib/utils";
import { workspaceParamsSchema } from "@/server/schemas";
import * as http from "@/server/lib/http-status-codes";

const tags = ["Projects"];

export const getProjectsRoute = createRoute({
  method: "get",
  path: "/api/workspaces/{id}/projects",
  tags,
  middleware: [sessionMiddleware, isMemberMiddleware] as const,
  request: { params: workspaceParamsSchema },
  responses: {
    [http.OK]: jsonContent(
      z.object({
        projects: z.array(
          z.object({
            id: z.string(),
            workspaceId: z.string(),
            name: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
          }),
        ),
      }),
      "Workspace Projects",
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
export type GetProjectsRoute = typeof getProjectsRoute;

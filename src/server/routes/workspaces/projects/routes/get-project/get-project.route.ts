import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import { isMemberMiddleware } from "@/server/middlewares/is-member";
import { createErrorMessageSchema, jsonContent } from "@/server/lib/utils";
import { workspaceProjectParamsSchema } from "@/server/schemas";
import * as http from "@/server/lib/http-status-codes";

const tags = ["Projects"];

export const getProjectRoute = createRoute({
  method: "get",
  path: "/api/workspaces/{id}/projects/{project-id}",
  tags,
  middleware: [sessionMiddleware, isMemberMiddleware] as const,
  request: {
    params: workspaceProjectParamsSchema,
  },
  responses: {
    [http.OK]: jsonContent(
      z.object({
        id: z.string(),
        name: z.string(),
        workspaceId: z.string(),
      }),
      "Get Project",
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
export type GetProjectRoute = typeof getProjectRoute;

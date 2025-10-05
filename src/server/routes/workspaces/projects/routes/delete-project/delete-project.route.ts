import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import { isMemberMiddleware } from "@/server/middlewares/is-member";
import { createErrorMessageSchema, jsonContent } from "@/server/lib/utils";
import { workspaceProjectParamsSchema } from "@/server/schemas";
import * as http from "@/server/lib/http-status-codes";

const tags = ["Projects"];

export const deleteProjectRoute = createRoute({
  method: "delete",
  path: "/api/workspaces/{id}/projects/{project-id}",
  tags,
  middleware: [sessionMiddleware, isMemberMiddleware] as const,
  request: {
    params: workspaceProjectParamsSchema,
  },
  responses: {
    [http.OK]: jsonContent(z.object({ id: z.string() }), "Delete Project"),
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
export type DeleteProjectRoute = typeof deleteProjectRoute;

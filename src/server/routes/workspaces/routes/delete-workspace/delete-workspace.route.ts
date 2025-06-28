import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import { createErrorMessageSchema, jsonContent } from "@/server/lib/utils";
import { workspaceParamsSchema } from "@/server/schemas";
import * as http from "@/server/lib/http-status-codes";
import { WORKSPACES_TAGS } from "@/server/routes/constants";

const tags = WORKSPACES_TAGS;

export const deleteWorkspaceRoute = createRoute({
  method: "delete",
  path: "/api/workspaces/{id}",
  tags,
  middleware: [sessionMiddleware] as const,
  request: {
    params: workspaceParamsSchema,
  },
  responses: {
    [http.OK]: jsonContent(z.object({ id: z.string() }), "Delete Workspace"),
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
export type DeleteWorkspaceRoute = typeof deleteWorkspaceRoute;

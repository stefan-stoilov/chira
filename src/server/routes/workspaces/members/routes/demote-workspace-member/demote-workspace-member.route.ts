import { createRoute } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import {
  createErrorMessageSchema,
  createSuccessSchema,
  jsonContent,
} from "@/server/lib/utils";
import { workspaceMemberParamsSchema } from "@/server/schemas";
import * as http from "@/server/lib/http-status-codes";
import { isMemberMiddleware } from "@/server/middlewares/is-member";

const tags = ["Members"];

export const demoteWorkspaceMemberRoute = createRoute({
  method: "patch",
  path: "/api/workspaces/{id}/members/{user-id}/demote",
  tags,
  middleware: [sessionMiddleware, isMemberMiddleware] as const,
  request: { params: workspaceMemberParamsSchema },
  responses: {
    [http.OK]: jsonContent(createSuccessSchema(), "Demote Member"),
    [http.BAD_REQUEST]: jsonContent(createErrorMessageSchema(), "Bad request"),
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
export type DemoteWorkspaceMemberRoute = typeof demoteWorkspaceMemberRoute;

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

export const deleteWorkspaceMemberRoute = createRoute({
  method: "delete",
  path: "/api/workspaces/{id}/members/{user-id}",
  tags,
  middleware: [sessionMiddleware, isMemberMiddleware] as const,
  request: { params: workspaceMemberParamsSchema },
  responses: {
    [http.OK]: jsonContent(createSuccessSchema(), "Delete Member"),
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
export type DeleteWorkspaceMemberRoute = typeof deleteWorkspaceMemberRoute;

import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import {
  createErrorMessageSchema,
  createValidationErrorSchema,
  jsonContent,
  jsonContentRequired,
} from "@/server/lib/utils";
import { workspaceParamsSchema } from "@/server/schemas";
import * as http from "@/server/lib/http-status-codes";

const tags = ["Workspaces"];

export const joinWorkspaceRoute = createRoute({
  method: "post",
  path: "/api/workspaces/{id}/join",
  tags,
  middleware: [sessionMiddleware] as const,
  request: {
    params: workspaceParamsSchema,
    body: jsonContentRequired(
      z.object({ inviteCode: z.string().length(6) }),
      "Join workspace schema",
    ),
  },
  responses: {
    [http.OK]: jsonContent(
      z.object({ name: z.string() }),
      "Request to join workspace",
    ),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.NOT_FOUND]: jsonContent(createErrorMessageSchema(), "Not found"),
    [http.UNPROCESSABLE_ENTITY]: jsonContent(
      createValidationErrorSchema(
        z.object({ inviteCode: z.string().length(6) }),
      ),
      "The validation error(s)",
    ),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Internal Server Error",
    ),
  },
});
export type JoinWorkspaceRoute = typeof joinWorkspaceRoute;

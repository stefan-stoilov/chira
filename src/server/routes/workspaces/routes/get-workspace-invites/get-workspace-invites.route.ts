import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import { createErrorMessageSchema, jsonContent } from "@/server/lib/utils";
import { workspaceParamsSchema } from "@/server/schemas";
import * as http from "@/server/lib/http-status-codes";
import { WORKSPACES_TAGS } from "@/server/routes/constants";

const tags = WORKSPACES_TAGS;

export const getWorkspaceInvitesRoute = createRoute({
  method: "get",
  path: "/api/workspaces/{id}/invites",
  tags,
  middleware: [sessionMiddleware] as const,
  request: {
    params: workspaceParamsSchema,
    query: z.object({
      page: z.number({ coerce: true }).min(1),
    }),
  },
  responses: {
    [http.OK]: jsonContent(
      z.object({
        invites: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            createdAt: z.date(),
            deletedAt: z.union([z.date(), z.null()]),
            acceptedAt: z.union([z.date(), z.null()]),
            githubId: z.union([z.number(), z.null()]),
            email: z.union([z.string(), z.null()]),
          }),
        ),
        totalPages: z.number(),
        currentPage: z.number(),
      }),
      "Workspace Invites",
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
export type GetWorkspaceInvitesRoute = typeof getWorkspaceInvitesRoute;

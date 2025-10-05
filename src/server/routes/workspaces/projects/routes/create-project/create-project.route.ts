import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import { isMemberMiddleware } from "@/server/middlewares/is-member";
import {
  createErrorMessageSchema,
  createValidationErrorSchema,
  jsonContent,
  jsonContentRequired,
} from "@/server/lib/utils";
import * as http from "@/server/lib/http-status-codes";
import { workspaceParamsSchema } from "@/server/schemas";

const tags = ["Projects"];

const createProjectSchema = z.object({
  name: z
    .string({ message: "Project name is required." })
    .trim()
    .min(1)
    .max(255),
});

export const createProjectRoute = createRoute({
  method: "post",
  path: "/api/workspaces/{id}/projects",
  tags,
  middleware: [sessionMiddleware, isMemberMiddleware] as const,
  request: {
    params: workspaceParamsSchema,
    body: jsonContentRequired(createProjectSchema, "Create project schema"),
  },
  responses: {
    [http.CREATED]: jsonContent(
      z.object({
        id: z.string(),
        name: z.string(),
        workspaceId: z.string(),
      }),
      "Create Project",
    ),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.UNPROCESSABLE_ENTITY]: jsonContent(
      createValidationErrorSchema(createProjectSchema),
      "The validation error(s)",
    ),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Internal Server Error",
    ),
  },
});
export type CreateProjectRoute = typeof createProjectRoute;

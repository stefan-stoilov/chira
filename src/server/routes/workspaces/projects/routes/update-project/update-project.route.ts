import { createRoute, z } from "@hono/zod-openapi";
import { sessionMiddleware } from "@/server/middlewares/session";
import { isMemberMiddleware } from "@/server/middlewares/is-member";
import {
  createErrorMessageSchema,
  createValidationErrorSchema,
  jsonContent,
  jsonContentRequired,
} from "@/server/lib/utils";
import { workspaceProjectParamsSchema } from "@/server/schemas";
import * as http from "@/server/lib/http-status-codes";

const tags = ["Projects"];

export const updateProjectSchema = z.object({
  name: z.string({ message: "Project name is required." }).trim().min(1),
});

export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;

export const updateProjectRoute = createRoute({
  method: "patch",
  path: "/api/workspaces/{id}/projects/{project-id}",
  tags,
  middleware: [sessionMiddleware, isMemberMiddleware] as const,
  request: {
    params: workspaceProjectParamsSchema,
    body: jsonContentRequired(updateProjectSchema, "Update project schema"),
  },
  responses: {
    [http.OK]: jsonContent(
      z.object({
        id: z.string(),
        name: z.string(),
        workspaceId: z.string(),
      }),
      "Update Project",
    ),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.NOT_FOUND]: jsonContent(createErrorMessageSchema(), "Not found"),
    [http.UNPROCESSABLE_ENTITY]: jsonContent(
      createValidationErrorSchema(updateProjectSchema),
      "The validation error(s)",
    ),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Internal Server Error",
    ),
  },
});
export type UpdateProjectRoute = typeof updateProjectRoute;

import { z } from "zod";

export const workspaceParamsSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
    }),
});

export const userIdParamsSchema = z.object({
  ["user-id"]: z
    .string()
    .uuid()
    .openapi({
      param: {
        name: "user-id",
        in: "path",
      },
    }),
});

export const workspaceMemberParamsSchema =
  workspaceParamsSchema.merge(userIdParamsSchema);

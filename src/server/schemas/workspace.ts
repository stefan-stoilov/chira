import { z } from "zod";

export const workspaceSchema = z.object({
  $id: z.string(),
  $collectionId: z.string(),
  $databaseId: z.string(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  $permissions: z.array(z.string()),

  name: z.string(),
  userId: z.string(),
  imageUrl: z.string().optional(),
});

export const workspacesSchema = z.object({
  total: z.number(),
  documents: z.array(workspaceSchema),
});

export const workspaceIdSchema = z.object({
  $id: z.string(),
});

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

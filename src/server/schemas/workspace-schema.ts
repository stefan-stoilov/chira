import { z } from "zod";

export const workspaceSchema = z.object({
  total: z.number(),
  documents: z.array(
    z.object({
      $id: z.string(),
      $collectionId: z.string(),
      $databaseId: z.string(),
      $createdAt: z.string(),
      $updatedAt: z.string(),
      $permissions: z.array(z.string()),

      name: z.string(),
      userId: z.string(),
      imageUrl: z.string().optional(),
    }),
  ),
});

export const workspaceIdSchema = z.object({
  $id: z.string(),
});

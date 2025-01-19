import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { AppwriteException, ID } from "node-appwrite";

import { env } from "@/env";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createWorkspaceSchema } from "../schemas";

const app = new Hono().post(
  "/",
  zValidator("json", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { name } = c.req.valid("json");

    try {
      const workspace = await databases.createDocument(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
        },
      );

      return c.json({ workspace }, 200);
    } catch (error) {
      if (error instanceof AppwriteException) {
        return c.json(
          { error: error.message },
          error.code as ContentfulStatusCode,
        );
      } else {
        return c.json({ error: "Unexpected error." }, 500);
      }
    }
  },
);

export default app;

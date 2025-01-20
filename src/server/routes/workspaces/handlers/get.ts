import { AppwriteException, type Models } from "node-appwrite";

import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { SessionMiddlewareVariables } from "@/server/middlewares";
import type { WorkspacesRoute } from "../workspaces.routes";
import type { Workspace } from "../types";

import { env } from "@/env";

export const get: AppRouteHandler<
  WorkspacesRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const databases = c.get("databases");

  try {
    const workspaces: Models.DocumentList<Workspace> =
      await databases.listDocuments(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
      );

    return c.json(workspaces, 200);
  } catch (error) {
    if (error instanceof AppwriteException) {
      return c.json({ error: error.message }, 401);
    } else {
      return c.json({ error: "Unexpected error." }, 500);
    }
  }
};

import { AppwriteException, Query, type Models } from "node-appwrite";

import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { SessionMiddlewareVariables } from "@/server/middlewares";
import type { WorkspacesRoute, GetWorkspaceRoute } from "../workspaces.routes";
import type { Workspace } from "@/features/workspaces/types";
import type { Member } from "@/features/members/types";

import { env } from "@/env";
import { getWorkspace as getWorkspaceById } from "@/server/lib/get-workspace";

export const get: AppRouteHandler<
  WorkspacesRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const user = c.get("user");
  const databases = c.get("databases");
  const storage = c.get("storage");

  try {
    const members: Models.DocumentList<Member> = await databases.listDocuments(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID,
      [Query.equal("userId", user.$id)],
    );

    if (members.total === 0) {
      return c.json({ documents: [], total: 0 }, 200);
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces: Models.DocumentList<Workspace> =
      await databases.listDocuments(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
        [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)],
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

export const getWorkspaceHandler: AppRouteHandler<
  GetWorkspaceRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const databases = c.get("databases");
  const { id: workspaceId } = c.req.valid("param");

  let workspace: Workspace;

  try {
    workspace = await getWorkspaceById({
      databases,
      workspaceId,
    });
  } catch (error) {
    if (error instanceof AppwriteException) {
      if (error.code === 404) {
        return c.json({ error: `${error.message}` }, 404);
      }
    }
    return c.json({ error: "Unexpected error." }, 500);
  }

  const {
    $id,
    $collectionId,
    $databaseId,
    $createdAt,
    $updatedAt,
    $permissions,
    name,
    userId,
    imageUrl,
  } = workspace;

  return c.json(
    {
      $id,
      $collectionId,
      $databaseId,
      $createdAt,
      $updatedAt,
      $permissions,
      name,
      userId,
      imageUrl,
    },
    200,
  );
};

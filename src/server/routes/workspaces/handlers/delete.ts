import { AppwriteException } from "node-appwrite";
import { revalidatePath } from "next/cache";

import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { SessionMiddlewareVariables } from "@/server/middlewares";
import type { DeleteWorkspaceRoute } from "../workspaces.routes";
import type { Workspace } from "@/features/workspaces/types";
import { MemberRole, type Member } from "@/features/members/types";

import { env } from "@/env";
import { getWorkspaceMember } from "@/server/lib/get-workspace-member";
import { getWorkspace } from "@/server/lib/get-workspace";

export const deleteWorkspaceHandler: AppRouteHandler<
  DeleteWorkspaceRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const { id: workspaceId } = c.req.valid("param");

  const databases = c.get("databases");
  const user = c.get("user");

  let workspace: Workspace;
  let member: Member | undefined;

  try {
    workspace = await getWorkspace({
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

  try {
    member = await getWorkspaceMember({
      databases,
      workspaceId: workspace.$id,
      userId: user.$id,
    });
  } catch (error) {
    return c.json({ error: "Unexpected error." }, 500);
  }

  if (!member || member.role !== MemberRole.ADMIN) {
    return c.json({ error: "Unauthorized." }, 401);
  }

  try {
    await databases.deleteDocument(
      env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID,
      workspace.$id,
    );
  } catch (error) {
    return c.json({ error: "Unexpected error." }, 500);
  }

  revalidatePath("/dashboard", "page");
  return c.json({ $id: workspaceId }, 200);
};

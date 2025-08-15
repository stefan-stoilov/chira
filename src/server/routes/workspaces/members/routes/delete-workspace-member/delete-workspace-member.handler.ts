import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { workspacesMembers, WorkspaceRoles } from "@/server/db/schemas";
import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { DeleteWorkspaceMemberRoute } from "./delete-workspace-member.route";
import type { IsMemberMiddlewareVariables } from "@/server/middlewares/is-member";
import * as http from "@/server/lib/http-status-codes";

export const deleteWorkspaceMemberHandler: AppRouteHandler<
  DeleteWorkspaceMemberRoute,
  AppMiddlewareVariables<IsMemberMiddlewareVariables>
> = async (c) => {
  const member = c.get("member");

  if (
    member.role !== WorkspaceRoles.admin &&
    member.role !== WorkspaceRoles.owner
  )
    return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

  const userToDelete = {
    id: c.req.valid("param")["user-id"],
  };

  try {
    const [existingUser] = await db
      .select({ role: workspacesMembers.role })
      .from(workspacesMembers)
      .where(
        and(
          eq(workspacesMembers.userId, userToDelete.id),
          eq(workspacesMembers.workspaceId, member.workspaceId),
        ),
      );

    if (!existingUser)
      return c.json({ error: "Member of workspace not found" }, http.NOT_FOUND);

    if (existingUser.role === WorkspaceRoles.owner)
      return c.json(
        {
          error:
            "Member of workspace cannot be deleted because they are the owner of the workspace",
        },
        http.UNAUTHORIZED,
      );

    if (
      existingUser.role === WorkspaceRoles.admin &&
      member.role === WorkspaceRoles.admin
    )
      return c.json(
        {
          error: "Unauthorized",
        },
        http.UNAUTHORIZED,
      );

    await db
      .delete(workspacesMembers)
      .where(
        and(
          eq(workspacesMembers.userId, userToDelete.id),
          eq(workspacesMembers.workspaceId, member.workspaceId),
        ),
      );

    return c.json({ success: true }, http.OK);
  } catch (error) {
    console.error(error);

    return c.json(
      { error: "Internal server error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

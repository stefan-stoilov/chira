import { eq, and, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { workspacesMembers, WorkspaceRoles } from "@/server/db/schemas";
import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { PromoteWorkspaceMemberRoute } from "./promote-workspace-member.route";
import type { IsMemberMiddlewareVariables } from "@/server/middlewares/is-member";
import * as http from "@/server/lib/http-status-codes";

export const promoteWorkspaceMemberHandler: AppRouteHandler<
  PromoteWorkspaceMemberRoute,
  AppMiddlewareVariables<IsMemberMiddlewareVariables>
> = async (c) => {
  const member = c.get("member");

  if (
    member.role !== WorkspaceRoles.admin &&
    member.role !== WorkspaceRoles.owner
  )
    return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

  const userToPromote = {
    id: c.req.valid("param")["user-id"],
  };

  try {
    const [existingUser] = await db
      .select({ role: workspacesMembers.role })
      .from(workspacesMembers)
      .where(
        and(
          eq(workspacesMembers.userId, userToPromote.id),
          eq(workspacesMembers.workspaceId, member.workspaceId),
        ),
      );

    if (!existingUser)
      return c.json({ error: "Member of workspace not found" }, http.NOT_FOUND);

    if (existingUser.role !== WorkspaceRoles.user)
      return c.json(
        {
          error: `Member of workspace cannot be promoted because they already have role ${existingUser.role}`,
        },
        http.BAD_REQUEST,
      );

    await db
      .update(workspacesMembers)
      .set({ updatedAt: sql`NOW()`, role: WorkspaceRoles.admin })
      .where(
        and(
          eq(workspacesMembers.userId, userToPromote.id),
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

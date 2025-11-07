import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { workspaces, workspacesMembers } from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { SessionMiddlewareVariables } from "@/server/middlewares/session";
import type { GetWorkspaceRoute } from "./get-workspace.route";

export const getWorkspaceHandler: AppRouteHandler<
  GetWorkspaceRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const user = c.get("user");
  const { id: workspaceId } = c.req.valid("param");

  try {
    const [workspace] = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        role: workspacesMembers.role,
        inviteCode: workspaces.inviteCode,
        allowMemberInviteManagement: workspaces.allowMemberInviteManagement,
      })
      .from(workspacesMembers)
      .where(
        and(
          eq(workspacesMembers.userId, user.id),
          eq(workspacesMembers.workspaceId, workspaceId),
        ),
      )
      .innerJoin(workspaces, eq(workspaces.id, workspaceId));

    if (!workspace) return c.json({ error: "Not found" }, http.NOT_FOUND);

    if (!workspace.inviteCode) {
      const { id, name, role, allowMemberInviteManagement } = workspace;
      return c.json({ id, name, role, allowMemberInviteManagement }, http.OK);
    }

    return c.json(workspace, http.OK);
  } catch (error) {
    c.var?.logger?.error(error, "Get workspace handler failed");

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

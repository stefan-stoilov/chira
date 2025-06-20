import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  workspaces,
  workspacesMembers,
  WorkspaceRoles,
} from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { SessionMiddlewareVariables } from "@/server/middlewares/session";
import type { UpdateWorkspaceRoute } from "../workspaces.routes";

export const updateWorkspaceHandler: AppRouteHandler<
  UpdateWorkspaceRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const user = c.get("user");
  const { id: workspaceId } = c.req.valid("param");
  const { name, allowMemberInviteManagement } = c.req.valid("json");

  try {
    const [workspace] = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        role: workspacesMembers.role,
        allowMemberInviteManagement: workspaces.allowMemberInviteManagement,
      })
      .from(workspacesMembers)
      .innerJoin(workspaces, eq(workspaces.id, workspaceId))
      .where(eq(workspacesMembers.userId, user.id));

    if (!workspace) return c.json({ error: "Not found" }, http.NOT_FOUND);

    if (workspace.role !== WorkspaceRoles.owner)
      return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

    await db
      .update(workspaces)
      .set({
        name,
        allowMemberInviteManagement:
          allowMemberInviteManagement ?? workspace.allowMemberInviteManagement,
      })
      .where(eq(workspaces.id, workspace.id));

    return c.json(
      {
        id: workspaceId,
        name,
        allowMemberInviteManagement:
          allowMemberInviteManagement ?? workspace.allowMemberInviteManagement,
      },
      http.OK,
    );
  } catch (error) {
    console.log(error);

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

import { eq, and } from "drizzle-orm";
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
import type { DeleteWorkspaceRoute } from "./delete-workspace.route";

export const deleteWorkspaceHandler: AppRouteHandler<
  DeleteWorkspaceRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const user = c.get("user");
  const { id: workspaceId } = c.req.valid("param");

  try {
    const [workspace] = await db
      .select({
        id: workspacesMembers.workspaceId,
        role: workspacesMembers.role,
      })
      .from(workspacesMembers)
      .where(
        and(
          eq(workspacesMembers.userId, user.id),
          eq(workspacesMembers.workspaceId, workspaceId),
        ),
      );

    if (!workspace) return c.json({ error: "Not found" }, http.NOT_FOUND);

    if (workspace.role !== WorkspaceRoles.owner)
      return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

    await db.delete(workspaces).where(eq(workspaces.id, workspace.id));

    return c.json({ id: workspaceId }, http.OK);
  } catch (error) {
    console.log(error);

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

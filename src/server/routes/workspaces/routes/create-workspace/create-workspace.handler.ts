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
import type { CreateWorkspaceRoute } from "./create-workspace.route";

export const createWorkspaceHandler: AppRouteHandler<
  CreateWorkspaceRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const { id: userId } = c.get("user");
  const { name } = c.req.valid("json");

  try {
    const [newWorkspace] = await db
      .insert(workspaces)
      .values({ name })
      .returning({ workspaceId: workspaces.id });

    if (!newWorkspace) throw Error("Workspace was not successfully created");
    const { workspaceId } = newWorkspace;

    const role = WorkspaceRoles.owner;

    await db.insert(workspacesMembers).values({
      userId,
      workspaceId,
      role,
    });

    return c.json(
      { id: workspaceId, name, role, allowMemberInviteManagement: true },
      http.CREATED,
    );
  } catch (error) {
    console.log(error);

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

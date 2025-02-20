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
import type { NewSessionMiddlewareVariables } from "@/server/middlewares/new-session";
import type { CreateWorkspaceRoute } from "../workspaces.routes";

export const createWorkspaceHandler: AppRouteHandler<
  CreateWorkspaceRoute,
  AppMiddlewareVariables<NewSessionMiddlewareVariables>
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

    await db.insert(workspacesMembers).values({
      userId,
      workspaceId,
      role: WorkspaceRoles.owner,
    });

    return c.json({ id: workspaceId }, http.CREATED);
  } catch (error) {
    console.log(error);

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { workspaces, workspacesMembers } from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { SessionMiddlewareVariables } from "@/server/middlewares/session";
import type { GetWorkspacesRoute } from "./get-workspaces.route";

export const getWorkspacesHandler: AppRouteHandler<
  GetWorkspacesRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const user = c.get("user");

  try {
    const userWorkspaces = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        role: workspacesMembers.role,
      })
      .from(workspacesMembers)
      .innerJoin(workspaces, eq(workspaces.id, workspacesMembers.workspaceId))
      .where(eq(workspacesMembers.userId, user.id));

    return c.json({ workspaces: userWorkspaces }, http.OK);
  } catch (error) {
    console.log(error);

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { workspaces, workspacesMembers } from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { NewSessionMiddlewareVariables } from "@/server/middlewares/new-session";
import type { GetWorkspaceRoute } from "../workspaces.routes";

export const getWorkspaceHandler: AppRouteHandler<
  GetWorkspaceRoute,
  AppMiddlewareVariables<NewSessionMiddlewareVariables>
> = async (c) => {
  const user = c.get("user");
  const { id: workspaceId } = c.req.valid("param");

  try {
    const [workspace] = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        role: workspacesMembers.role,
      })
      .from(workspacesMembers)
      .innerJoin(workspaces, eq(workspaces.id, workspaceId))
      .where(eq(workspacesMembers.userId, user.id));

    if (!workspace) return c.json({ error: "Not found" }, http.NOT_FOUND);

    return c.json({ workspace }, http.OK);
  } catch (error) {
    console.log(error);

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

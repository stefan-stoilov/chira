import { createMiddleware } from "hono/factory";
import { eq, and } from "drizzle-orm";

import { db } from "@/server/db";
import {
  workspaces,
  workspacesMembers,
  type WorkspaceRoles,
} from "@/server/db/schemas";
import { getUserCtx, type SessionMiddlewareVariables } from "../session";
import * as http from "@/server/lib/http-status-codes";

export type IsMemberMiddlewareVariables = {
  member: {
    userId: string;
    workspaceId: string;
    role: WorkspaceRoles;
    createdAt: Date;
    updatedAt: Date;
  };
} & SessionMiddlewareVariables;

export const isMemberMiddleware = createMiddleware<{
  Variables: IsMemberMiddlewareVariables;
}>(async (c, next) => {
  const workspaceId = c.req.param("id");

  if (!workspaceId) {
    console.error(
      `Workspace params schema not applied to route with path ${c.req.path}`,
    );
    return c.json(
      { error: "Internal server error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }

  const user = getUserCtx();
  if (!user) return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

  try {
    const [existingWorkspace] = await db
      .select({ id: workspaces.id })
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId));

    if (!existingWorkspace)
      return c.json({ error: "Workspace not found" }, http.NOT_FOUND);

    const [member] = await db
      .select()
      .from(workspacesMembers)
      .where(
        and(
          eq(workspacesMembers.userId, user.id),
          eq(workspacesMembers.workspaceId, existingWorkspace.id),
        ),
      );

    if (!member) return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

    c.set("member", member);
  } catch (error) {
    console.error(error);

    return c.json(
      { error: "Internal server error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }

  await next();
});

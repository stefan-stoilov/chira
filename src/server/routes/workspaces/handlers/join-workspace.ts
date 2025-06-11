import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  workspaces,
  workspacesMembers,
  workspacesRequests,
} from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { SessionMiddlewareVariables } from "@/server/middlewares/session";
import type { JoinWorkspaceRoute } from "../workspaces.routes";

export const joinWorkspaceHandler: AppRouteHandler<
  JoinWorkspaceRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const user = c.get("user");
  const { id: workspaceId } = c.req.valid("param");
  const { inviteCode } = c.req.valid("json");

  try {
    const [existingWorkspace] = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        inviteCode: workspaces.inviteCode,
        userId: workspacesMembers.userId,
      })
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .innerJoin(workspacesMembers, eq(workspacesMembers.userId, user.id));

    if (!existingWorkspace)
      return c.json({ error: "Not found" }, http.NOT_FOUND);

    if (inviteCode !== existingWorkspace.inviteCode)
      return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

    const [existingMember] = await db
      .select({ id: workspacesMembers.userId })
      .from(workspacesMembers)
      .where(
        and(
          eq(workspacesMembers.userId, user.id),
          eq(workspacesMembers.workspaceId, existingWorkspace.id),
        ),
      );

    if (typeof existingMember !== "undefined") {
      return c.json(
        {
          error: `You are already a member of workspace - ${existingWorkspace.name}.`,
        },
        http.UNAUTHORIZED,
      );
    }

    await db
      .delete(workspacesRequests)
      .where(eq(workspacesRequests.userId, user.id));

    await db
      .insert(workspacesRequests)
      .values({ userId: user.id, workspaceId });

    return c.json({ name: existingWorkspace.name }, http.OK);
  } catch (e) {
    console.log(e);

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

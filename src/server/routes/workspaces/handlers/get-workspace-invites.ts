import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  users,
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
import type { GetWorkspaceInvitesRoute } from "../workspaces.routes";

const RESULTS_PER_PAGE = 20;

export const getWorkspaceInvitesHandler: AppRouteHandler<
  GetWorkspaceInvitesRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const user = c.get("user");
  const { id: workspaceId } = c.req.valid("param");
  const { page } = c.req.valid("query");

  try {
    const [existingWorkspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId));

    if (!existingWorkspace)
      return c.json({ error: "Not found" }, http.NOT_FOUND);

    const [existingMember] = await db
      .select({ id: workspacesMembers.userId })
      .from(workspacesMembers)
      .where(
        and(
          eq(workspacesMembers.userId, user.id),
          eq(workspacesMembers.workspaceId, existingWorkspace.id),
        ),
      );

    if (!existingMember)
      return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

    const invites = await db
      .select({
        id: workspacesRequests.userId,
        name: users.name,
        createdAt: workspacesRequests.createdAt,
        githubId: users.githubId,
        email: users.email,
      })
      .from(workspacesRequests)
      .orderBy(workspacesRequests.createdAt)
      .limit(RESULTS_PER_PAGE)
      .offset(page >= 1 ? page - 1 : 0)
      .innerJoin(users, eq(users.id, workspacesRequests.userId));

    return c.json({ invites }, http.OK);
  } catch (e) {
    console.log(e);

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

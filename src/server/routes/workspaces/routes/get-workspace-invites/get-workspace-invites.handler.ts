import { and, eq, count } from "drizzle-orm";
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
import type { GetWorkspaceInvitesRoute } from "./get-workspace-invites.route";

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

    const [totalInvites] = await db
      .select({
        count: count(workspacesRequests.userId),
      })
      .from(workspacesRequests)
      .where(eq(workspacesRequests.workspaceId, existingWorkspace.id));
    const totalPages = Math.ceil((totalInvites?.count ?? 0) / RESULTS_PER_PAGE);

    const currentPage = totalPages < page ? totalPages : page;

    if (totalPages === 0)
      return c.json({ invites: [], totalPages, currentPage }, http.OK);

    const offset =
      (totalPages < page ? totalPages - 1 : page - 1) * RESULTS_PER_PAGE;

    const invites = await db
      .select({
        id: workspacesRequests.userId,
        name: users.name,
        createdAt: workspacesRequests.createdAt,
        deletedAt: workspacesRequests.deletedAt,
        acceptedAt: workspacesRequests.acceptedAt,
        githubId: users.githubId,
        email: users.email,
      })
      .from(workspacesRequests)
      .where(eq(workspacesRequests.workspaceId, existingWorkspace.id))
      .innerJoin(users, eq(users.id, workspacesRequests.userId))
      .orderBy(workspacesRequests.createdAt)
      .offset(offset)
      .limit(RESULTS_PER_PAGE);

    return c.json({ invites, totalPages, currentPage }, http.OK);
  } catch (e) {
    console.log(e);

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

import { eq, and, inArray, isNull } from "drizzle-orm";
import { db } from "@/server/db";
import {
  workspaces,
  workspacesMembers,
  workspacesRequests,
  users,
  WorkspaceRoles,
} from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { SessionMiddlewareVariables } from "@/server/middlewares/session";
import type { SoftDeleteWorkspaceInvitesRoute } from "../workspaces.routes";

export const softDeleteWorkspaceInvitesHandler: AppRouteHandler<
  SoftDeleteWorkspaceInvitesRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const user = c.get("user");
  const { id: workspaceId } = c.req.valid("param");
  const { userIds } = c.req.valid("json");

  try {
    const [workspaceMembership] = await db
      .select({
        role: workspacesMembers.role,
        allowMemberInviteManagement: workspaces.allowMemberInviteManagement,
      })
      .from(workspacesMembers)
      .innerJoin(workspaces, eq(workspaces.id, workspaceId))
      .where(eq(workspacesMembers.userId, user.id));

    if (!workspaceMembership)
      return c.json({ error: "Not found" }, http.NOT_FOUND);

    if (
      !workspaceMembership.allowMemberInviteManagement &&
      workspaceMembership.role === WorkspaceRoles.user
    ) {
      return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);
    }

    const existingUserRecords = await db
      .select()
      .from(users)
      .where(inArray(users.id, userIds));

    const validUserIdsFromPayload = existingUserRecords.map((u) => u.id);

    if (validUserIdsFromPayload.length === 0) {
      return c.json(
        {
          error:
            "No user requests with specified IDs have been found for workspace.",
        },
        http.NOT_FOUND,
      );
    }

    const pendingInvites = await db
      .select({ userId: workspacesRequests.userId })
      .from(workspacesRequests)
      .where(
        and(
          eq(workspacesRequests.workspaceId, workspaceId),
          isNull(workspacesRequests.acceptedAt),
          isNull(workspacesRequests.deletedAt),
          inArray(workspacesRequests.userId, validUserIdsFromPayload),
        ),
      );

    if (pendingInvites.length === 0) {
      return c.json(
        {
          error:
            "No pending invites for users with specified IDs have been found.",
        },
        http.NOT_FOUND,
      );
    }

    const userIdInvitesToSoftDelete = pendingInvites.map(
      (invite) => invite.userId,
    );

    await db
      .update(workspacesRequests)
      .set({
        deletedAt: new Date(),
      })
      .where(
        and(
          eq(workspacesRequests.workspaceId, workspaceId),
          inArray(workspacesRequests.userId, userIdInvitesToSoftDelete),
        ),
      );

    return c.json(
      {
        deletedInvites: userIds.map((id) => {
          const invite = userIdInvitesToSoftDelete.find((inv) => inv === id);

          return invite
            ? {
                id: invite,
              }
            : {
                id,
                error:
                  "Specified user in the request not found in pending workspace requests",
              };
        }),
      },
      http.OK,
    );
  } catch (error) {
    console.error("Error deleting workspace invites:", error);
    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

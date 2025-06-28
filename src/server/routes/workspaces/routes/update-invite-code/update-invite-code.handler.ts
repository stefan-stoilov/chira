import { eq } from "drizzle-orm";
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
import type { UpdateInviteCodeRoute } from "./update-invite-code.route";
import { generateInviteCode } from "@/server/lib/utils";

export const updateInviteCodeHandler: AppRouteHandler<
  UpdateInviteCodeRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const user = c.get("user");
  const { id: workspaceId } = c.req.valid("param");
  const { remove } = c.req.valid("json");

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

    if (workspace.role === WorkspaceRoles.user)
      return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

    if (remove) {
      await db
        .update(workspaces)
        .set({ inviteCode: null })
        .where(eq(workspaces.id, workspace.id));

      return c.json({ id: workspaceId, inviteCode: undefined }, http.OK);
    } else {
      const inviteCode = generateInviteCode();

      await db
        .update(workspaces)
        .set({ inviteCode })
        .where(eq(workspaces.id, workspace.id));

      return c.json({ id: workspaceId, inviteCode }, http.OK);
    }
  } catch (error) {
    console.log(error);

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

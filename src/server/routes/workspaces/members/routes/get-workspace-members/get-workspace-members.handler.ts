import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { workspacesMembers, users } from "@/server/db/schemas";
import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { GetWorkspaceMembersRoute } from "./get-workspace-members.route";
import type { IsMemberMiddlewareVariables } from "@/server/middlewares/is-member";
import * as http from "@/server/lib/http-status-codes";

export const getWorkspaceMembersHandler: AppRouteHandler<
  GetWorkspaceMembersRoute,
  AppMiddlewareVariables<IsMemberMiddlewareVariables>
> = async (c) => {
  const member = c.get("member");

  try {
    const members = await db
      .select({
        id: users.id,
        name: users.name,
        role: workspacesMembers.role,
        createdAt: workspacesMembers.createdAt,
      })
      .from(workspacesMembers)
      .where(eq(workspacesMembers.workspaceId, member.workspaceId))
      .innerJoin(users, eq(workspacesMembers.userId, users.id));

    return c.json({ members }, http.OK);
  } catch (error) {
    console.error(error);

    return c.json(
      { error: "Internal server error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

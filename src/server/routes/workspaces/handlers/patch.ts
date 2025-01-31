import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { SessionMiddlewareVariables } from "@/server/middlewares";
import type { UpdateWorkspaceRoute } from "../workspaces.routes";
import { MemberRole, type Member } from "@/features/members/types";
import { getWorkspaceMember } from "@/server/lib/get-workspace-member";
import { env } from "@/env";
import { getWorkspace } from "@/server/lib/get-workspace";

export const update: AppRouteHandler<
  UpdateWorkspaceRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const { name, image, fileName } = c.req.valid("form");
  const { id: workspaceId } = c.req.valid("param");

  const databases = c.get("databases");
  const storage = c.get("storage");
  const user = c.get("user");

  let member: Member | undefined;

  try {
    // member = await getWorkspaceMember({
    //   databases,
    //   workspaceId,
    //   userId: user.$id,
    // });

    await getWorkspace({ databases, workspaceId });
  } catch (error) {
    return c.json({ error: "Unexpected error." }, 500);
  }

  // if (!member || member.role !== MemberRole.ADMIN) {
  //   return c.json({ error: "Unauthorized." }, 401);
  // }

  return c.json({ error: "Unexpected error." }, 500);
};

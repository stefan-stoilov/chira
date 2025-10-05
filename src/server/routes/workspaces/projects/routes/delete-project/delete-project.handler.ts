import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { projects, WorkspaceRoles } from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { IsMemberMiddlewareVariables } from "@/server/middlewares/is-member";
import type { DeleteProjectRoute } from "./delete-project.route";

export const deleteProjectHandler: AppRouteHandler<
  DeleteProjectRoute,
  AppMiddlewareVariables<IsMemberMiddlewareVariables>
> = async (c) => {
  const member = c.get("member");
  const params = c.req.valid("param");
  const projectId = params["project-id"];

  if (member.role !== WorkspaceRoles.owner)
    return c.json({ error: "Unauthorized" }, http.UNAUTHORIZED);

  try {
    const [project] = await db
      .select({
        id: projects.id,
      })
      .from(projects)
      .where(eq(projects.id, projectId));

    if (!project) return c.json({ error: "Not found" }, http.NOT_FOUND);

    await db.delete(projects).where(eq(projects.id, project.id));

    return c.json({ id: project.id }, http.OK);
  } catch (error) {
    console.log(error);

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

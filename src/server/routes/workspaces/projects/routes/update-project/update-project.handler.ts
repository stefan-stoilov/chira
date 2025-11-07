import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { projects } from "@/server/db/schemas";
import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { UpdateProjectRoute } from "./update-project.route";
import type { IsMemberMiddlewareVariables } from "@/server/middlewares/is-member";
import * as http from "@/server/lib/http-status-codes";

export const updateProjectHandler: AppRouteHandler<
  UpdateProjectRoute,
  AppMiddlewareVariables<IsMemberMiddlewareVariables>
> = async (c) => {
  const body = c.req.valid("json");
  const params = c.req.valid("param");
  const projectId = params["project-id"];

  try {
    const [project] = await db
      .select({
        id: projects.id,
        name: projects.name,
        workspaceId: projects.workspaceId,
      })
      .from(projects)
      .where(eq(projects.id, projectId));

    if (!project) return c.json({ error: "Not found" }, http.NOT_FOUND);

    await db.update(projects).set(body).where(eq(projects.id, project.id));

    return c.json(
      {
        id: project.id,
        workspaceId: project.workspaceId,
        ...body,
      },
      http.OK,
    );
  } catch (error) {
    c.var.logger.error(error, "Update project handler failed");

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { projects } from "@/server/db/schemas";
import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { GetProjectRoute } from "./get-project.route";
import type { IsMemberMiddlewareVariables } from "@/server/middlewares/is-member";
import * as http from "@/server/lib/http-status-codes";

export const getProjectHandler: AppRouteHandler<
  GetProjectRoute,
  AppMiddlewareVariables<IsMemberMiddlewareVariables>
> = async (c) => {
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

    return c.json(project, http.OK);
  } catch (error) {
    console.log(error);

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

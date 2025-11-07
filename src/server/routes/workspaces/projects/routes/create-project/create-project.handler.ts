import { db } from "@/server/db";
import { projects } from "@/server/db/schemas";
import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { CreateProjectRoute } from "./create-project.route";
import type { IsMemberMiddlewareVariables } from "@/server/middlewares/is-member";
import * as http from "@/server/lib/http-status-codes";

export const createProjectHandler: AppRouteHandler<
  CreateProjectRoute,
  AppMiddlewareVariables<IsMemberMiddlewareVariables>
> = async (c) => {
  const { name } = c.req.valid("json");
  const { workspaceId } = c.get("member");

  try {
    const [newProject] = await db
      .insert(projects)
      .values({ name, workspaceId })
      .returning({ id: projects.id });

    if (!newProject) throw Error("Workspace was not successfully created");
    const { id } = newProject;

    return c.json({ id, name, workspaceId }, http.CREATED);
  } catch (error) {
    c.var.logger.error(error, "Workspace could not be created");

    return c.json(
      { error: "Internal Server Error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

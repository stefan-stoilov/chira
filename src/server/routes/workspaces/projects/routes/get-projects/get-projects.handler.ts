import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { projects } from "@/server/db/schemas";
import type {
  AppMiddlewareVariables,
  AppRouteHandler,
} from "@/server/lib/types";
import type { GetProjectsRoute } from "./get-projects.route";
import type { IsMemberMiddlewareVariables } from "@/server/middlewares/is-member";
import * as http from "@/server/lib/http-status-codes";

export const getProjectsHandler: AppRouteHandler<
  GetProjectsRoute,
  AppMiddlewareVariables<IsMemberMiddlewareVariables>
> = async (c) => {
  const member = c.get("member");

  try {
    const projectsList = await db
      .select({
        id: projects.id,
        workspaceId: projects.workspaceId,
        name: projects.name,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .where(eq(projects.workspaceId, member.workspaceId));

    return c.json({ projects: projectsList }, http.OK);
  } catch (error) {
    c.var.logger.error(error, "Get projects handler failed");

    return c.json(
      { error: "Internal server error" },
      http.INTERNAL_SERVER_ERROR,
    );
  }
};

import { createRouter } from "@/server/lib/create-app";
import { createProjectHandler, createProjectRoute } from "./create-project";
import { getProjectsHandler, getProjectsRoute } from "./get-projects";
import { updateProjectHandler, updateProjectRoute } from "./update-project";
import { deleteProjectHandler, deleteProjectRoute } from "./delete-project";
import { getProjectHandler, getProjectRoute } from "./get-project";

export const projectsRouter = createRouter()
  .openapi(createProjectRoute, createProjectHandler)
  .openapi(getProjectsRoute, getProjectsHandler)
  .openapi(updateProjectRoute, updateProjectHandler)
  .openapi(deleteProjectRoute, deleteProjectHandler)
  .openapi(getProjectRoute, getProjectHandler);

export type ProjectsRouter = typeof projectsRouter;

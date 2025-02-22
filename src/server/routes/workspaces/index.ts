import { createRouter } from "@/server/lib/create-app";

import {
  getWorkspaceHandler,
  getWorkspacesHandler,
  createWorkspaceHandler,
  updateWorkspaceHandler,
  deleteWorkspaceHandler,
} from "./handlers";
import {
  getWorkspaceRoute,
  getWorkspacesRoute,
  createWorkspaceRoute,
  updateWorkspaceRoute,
  deleteWorkspaceRoute,
} from "./workspaces.routes";

export const workspacesRouter = createRouter()
  .openapi(getWorkspaceRoute, getWorkspaceHandler)
  .openapi(getWorkspacesRoute, getWorkspacesHandler)
  .openapi(createWorkspaceRoute, createWorkspaceHandler)
  .openapi(updateWorkspaceRoute, updateWorkspaceHandler)
  .openapi(deleteWorkspaceRoute, deleteWorkspaceHandler);

export type WorkspacesRouter = typeof workspacesRouter;

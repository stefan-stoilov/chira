import { createRouter } from "@/server/lib/create-app";

import {
  getWorkspaceHandler,
  getWorkspacesHandler,
  createWorkspaceHandler,
  updateWorkspaceHandler,
  deleteWorkspaceHandler,
  joinWorkspaceHandler,
  updateInviteCodeHandler,
  getWorkspaceInvitesHandler,
} from "./handlers";
import {
  getWorkspaceRoute,
  getWorkspacesRoute,
  createWorkspaceRoute,
  updateWorkspaceRoute,
  deleteWorkspaceRoute,
  joinWorkspaceRoute,
  updateInviteCodeRoute,
  getWorkspaceInvitesRoute,
} from "./workspaces.routes";

export const workspacesRouter = createRouter()
  .openapi(getWorkspaceRoute, getWorkspaceHandler)
  .openapi(getWorkspacesRoute, getWorkspacesHandler)
  .openapi(createWorkspaceRoute, createWorkspaceHandler)
  .openapi(updateWorkspaceRoute, updateWorkspaceHandler)
  .openapi(deleteWorkspaceRoute, deleteWorkspaceHandler)
  .openapi(joinWorkspaceRoute, joinWorkspaceHandler)
  .openapi(updateInviteCodeRoute, updateInviteCodeHandler)
  .openapi(getWorkspaceInvitesRoute, getWorkspaceInvitesHandler);

export type WorkspacesRouter = typeof workspacesRouter;

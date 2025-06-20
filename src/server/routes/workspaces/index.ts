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
  acceptWorkspaceInvitesHandler,
  softDeleteWorkspaceInvitesHandler,
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
  acceptWorkspaceInvitesRoute,
  softDeleteWorkspaceInvitesRoute,
} from "./workspaces.routes";

export const workspacesRouter = createRouter()
  .openapi(getWorkspaceRoute, getWorkspaceHandler)
  .openapi(getWorkspacesRoute, getWorkspacesHandler)
  .openapi(createWorkspaceRoute, createWorkspaceHandler)
  .openapi(updateWorkspaceRoute, updateWorkspaceHandler)
  .openapi(deleteWorkspaceRoute, deleteWorkspaceHandler)
  .openapi(joinWorkspaceRoute, joinWorkspaceHandler)
  .openapi(updateInviteCodeRoute, updateInviteCodeHandler)
  .openapi(getWorkspaceInvitesRoute, getWorkspaceInvitesHandler)
  .openapi(acceptWorkspaceInvitesRoute, acceptWorkspaceInvitesHandler)
  .openapi(softDeleteWorkspaceInvitesRoute, softDeleteWorkspaceInvitesHandler);

export type WorkspacesRouter = typeof workspacesRouter;

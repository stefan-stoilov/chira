import { createRouter } from "@/server/lib/create-app";

import { getWorkspaceHandler, getWorkspaceRoute } from "./get-workspace";
import { getWorkspacesHandler, getWorkspacesRoute } from "./get-workspaces";
import {
  createWorkspaceHandler,
  createWorkspaceRoute,
} from "./create-workspace";
import {
  updateWorkspaceHandler,
  updateWorkspaceRoute,
} from "./update-workspace";
import {
  deleteWorkspaceHandler,
  deleteWorkspaceRoute,
} from "./delete-workspace";
import { joinWorkspaceHandler, joinWorkspaceRoute } from "./join-workspace";
import {
  updateInviteCodeHandler,
  updateInviteCodeRoute,
} from "./update-invite-code";
import {
  getWorkspaceInvitesHandler,
  getWorkspaceInvitesRoute,
} from "./get-workspace-invites";
import {
  acceptWorkspaceInvitesHandler,
  acceptWorkspaceInvitesRoute,
} from "./accept-workspace-invites";
import {
  softDeleteWorkspaceInvitesHandler,
  softDeleteWorkspaceInvitesRoute,
} from "./soft-delete-workspace-invites";

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

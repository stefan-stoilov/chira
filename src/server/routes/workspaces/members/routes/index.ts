import { createRouter } from "@/server/lib/create-app";
import {
  getWorkspaceMembersHandler,
  getWorkspaceMembersRoute,
} from "./get-workspace-members";
import {
  promoteWorkspaceMemberHandler,
  promoteWorkspaceMemberRoute,
} from "./promote-workspace-member";
import {
  demoteWorkspaceMemberHandler,
  demoteWorkspaceMemberRoute,
} from "./demote-workspace-member";
import {
  deleteWorkspaceMemberHandler,
  deleteWorkspaceMemberRoute,
} from "./delete-workspace-member";

export const membersRouter = createRouter()
  .openapi(getWorkspaceMembersRoute, getWorkspaceMembersHandler)
  .openapi(promoteWorkspaceMemberRoute, promoteWorkspaceMemberHandler)
  .openapi(demoteWorkspaceMemberRoute, demoteWorkspaceMemberHandler)
  .openapi(deleteWorkspaceMemberRoute, deleteWorkspaceMemberHandler);

export type MembersRouter = typeof membersRouter;

import { createRouter } from "@/server/lib/create-app";
import {
  getWorkspaceMembersHandler,
  getWorkspaceMembersRoute,
} from "./get-workspace-members";

export const membersRouter = createRouter().openapi(
  getWorkspaceMembersRoute,
  getWorkspaceMembersHandler,
);

export type MembersRouter = typeof membersRouter;

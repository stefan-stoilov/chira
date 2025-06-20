import type { InferResponseType } from "hono";
import type { CreateWorkspaceRpc } from "../../use-create-workspace";
import * as http from "@/server/lib/http-status-codes";
import { WorkspaceRoles } from "@/server/db/schemas";

export const MOCK_WORKSPACE = {
  id: "c792c258-879a-425b-9399-87fcc0f14b65",
  name: "Test Workspace",
  role: WorkspaceRoles.owner,
  allowMemberInviteManagement: true,
};

export const success: InferResponseType<
  CreateWorkspaceRpc,
  typeof http.CREATED
> = MOCK_WORKSPACE;
export const successStatus = { status: http.CREATED };

export const error: InferResponseType<
  CreateWorkspaceRpc,
  typeof http.UNAUTHORIZED
> = {
  error: "Unauthorized",
};
export const errorStatus = { status: http.UNAUTHORIZED };

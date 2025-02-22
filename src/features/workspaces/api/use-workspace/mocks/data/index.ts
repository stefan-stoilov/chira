import type { InferResponseType } from "hono";
import type { WorkspaceRpc } from "../../use-workspace";
import { WorkspaceRoles } from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

export const MOCK_WORKSPACE_ID = "48ff24e7-6be5-407f-8c5f-51cd7774155a";

export const successOwner: InferResponseType<WorkspaceRpc, typeof http.OK> = {
  id: MOCK_WORKSPACE_ID,
  name: "Test Workspace",
  role: WorkspaceRoles.owner,
};

export const successAdmin: InferResponseType<WorkspaceRpc, typeof http.OK> = {
  id: MOCK_WORKSPACE_ID,
  name: "Test Workspace",
  role: WorkspaceRoles.admin,
};

export const successUser: InferResponseType<WorkspaceRpc, typeof http.OK> = {
  id: MOCK_WORKSPACE_ID,
  name: "Test Workspace",
  role: WorkspaceRoles.user,
};

export const successStatus = { status: http.OK };

export const error: InferResponseType<WorkspaceRpc, typeof http.UNAUTHORIZED> =
  {
    error: "Unauthorized",
  };
export const errorStatus = { status: http.UNAUTHORIZED };

export const errorNotFound: InferResponseType<
  WorkspaceRpc,
  typeof http.NOT_FOUND
> = {
  error: "Not found",
};
export const errorNotFoundStatus = { status: http.NOT_FOUND };

import type { InferResponseType } from "hono";
import type { WorkspaceRpc } from "../../use-workspace";
import { WorkspaceRoles } from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";
import { env } from "@/env";

export const MOCK_WORKSPACE_ID = "48ff24e7-6be5-407f-8c5f-51cd7774155a";
export const MOCK_WORKSPACE_NAME = "Mock Workspace";
export const MOCK_WORKSPACE_INVITE_CODE = "TEST12";
export const MOCK_WORKSPACE_INVITE_LINK = `${env.NEXT_PUBLIC_APP_URL}/dashboard/workspaces/join?code=${MOCK_WORKSPACE_INVITE_CODE}&id=${MOCK_WORKSPACE_ID}`;

type WorkspaceResponseOk = InferResponseType<WorkspaceRpc, typeof http.OK>;

export const successOwner: WorkspaceResponseOk = {
  id: MOCK_WORKSPACE_ID,
  name: MOCK_WORKSPACE_NAME,
  role: WorkspaceRoles.owner,
  inviteCode: MOCK_WORKSPACE_INVITE_CODE,
};

export const successAdmin: WorkspaceResponseOk = {
  id: MOCK_WORKSPACE_ID,
  name: MOCK_WORKSPACE_NAME,
  role: WorkspaceRoles.admin,
  inviteCode: MOCK_WORKSPACE_INVITE_CODE,
};

export const successUser: WorkspaceResponseOk = {
  id: MOCK_WORKSPACE_ID,
  name: MOCK_WORKSPACE_NAME,
  role: WorkspaceRoles.user,
  inviteCode: MOCK_WORKSPACE_INVITE_CODE,
};

export const successOwnerNoInvite: WorkspaceResponseOk = {
  id: MOCK_WORKSPACE_ID,
  name: MOCK_WORKSPACE_NAME,
  role: WorkspaceRoles.admin,
};

export const successAdminNoInvite: WorkspaceResponseOk = {
  id: MOCK_WORKSPACE_ID,
  name: MOCK_WORKSPACE_NAME,
  role: WorkspaceRoles.admin,
};

export const successUserNoInvite: WorkspaceResponseOk = {
  id: MOCK_WORKSPACE_ID,
  name: MOCK_WORKSPACE_NAME,
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

type CreateMockWorkspaceDataProps =
  | {
      id?: string;
      name?: string;
      role?: WorkspaceRoles;
    }
  | undefined;

export function createMockWorkspaceData(
  props: CreateMockWorkspaceDataProps,
): WorkspaceResponseOk {
  return {
    id: props?.id || MOCK_WORKSPACE_ID,
    name: props?.name || "Example Workspace",
    role: props?.role || WorkspaceRoles.owner,
  };
}

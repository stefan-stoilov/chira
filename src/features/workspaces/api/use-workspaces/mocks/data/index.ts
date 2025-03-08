import type { InferResponseType } from "hono";
import type { WorkspacesRpc } from "../../use-workspaces";
import { WorkspaceRoles } from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

export const MOCK_WORKSPACES = [
  {
    id: "9979c96c-9a78-4f4a-8edc-f9734fc0fa49",
    name: "Test One",
    role: WorkspaceRoles.user,
  },
  {
    id: "5d891b7e-1211-4a9b-b27d-95d9d4c4e3af",
    name: "Test Two",
    role: WorkspaceRoles.user,
  },
  {
    id: "6a62635b-d069-4cbd-8adf-221e68ca76ca",
    name: "Test Three",
    role: WorkspaceRoles.user,
  },
];

export const MOCK_WORKSPACES_WITH_DIFFERENT_ROLES = [
  {
    id: "9979c96c-9a78-4f4a-8edc-f9734fc0fa49",
    name: "Test with Owner Rights",
    role: WorkspaceRoles.owner,
  },
  {
    id: "5d891b7e-1211-4a9b-b27d-95d9d4c4e3af",
    name: "Test with Admin Rights",
    role: WorkspaceRoles.admin,
  },
  {
    id: "6a62635b-d069-4cbd-8adf-221e68ca76ca",
    name: "Test with User rights",
    role: WorkspaceRoles.user,
  },
];

export const MOCK_WORKSPACES_EXTENDED = [
  ...MOCK_WORKSPACES,
  {
    id: "8171c0b2-80c9-4d9f-a9bc-f821e465ff79",
    name: "Test Four",
    role: WorkspaceRoles.user,
  },
  {
    id: "09194c5b-f11f-42db-8292-d9d4f22daeed",
    name: "Test Five",
    role: WorkspaceRoles.user,
  },
  {
    id: "5406ff29-d89f-431b-8ab6-028bd8a49531",
    name: "Test Six",
    role: WorkspaceRoles.user,
  },
  {
    id: "64c3f1eb-b6c6-4f36-8604-2c915aa98c1c",
    name: "Test Seven",
    role: WorkspaceRoles.user,
  },
  {
    id: "652aed82-d17c-47c9-a03e-305006d4725e",
    name: "Test Eight",
    role: WorkspaceRoles.user,
  },
  {
    id: "a4ec871e-d52b-4c67-83e1-7563c247e8e7",
    name: "Test Nine",
    role: WorkspaceRoles.user,
  },
];

export const success: InferResponseType<WorkspacesRpc, typeof http.OK> = {
  workspaces: MOCK_WORKSPACES,
};
export const successStatus = { status: http.OK };

export const successWithDifferentRoles: InferResponseType<
  WorkspacesRpc,
  typeof http.OK
> = {
  workspaces: MOCK_WORKSPACES_WITH_DIFFERENT_ROLES,
};

export const successExtended: InferResponseType<WorkspacesRpc, typeof http.OK> =
  {
    workspaces: MOCK_WORKSPACES_EXTENDED,
  };

export const successZeroWorkspaces: InferResponseType<
  WorkspacesRpc,
  typeof http.OK
> = {
  workspaces: [],
};

export const error: InferResponseType<
  WorkspacesRpc,
  typeof http.INTERNAL_SERVER_ERROR
> = {
  error: "Internal Server Error",
};
export const errorStatus = { status: http.INTERNAL_SERVER_ERROR };

export function getWorkspaceWithOwnerRights() {
  const workspace = MOCK_WORKSPACES_WITH_DIFFERENT_ROLES.find(
    ({ role }) => role === WorkspaceRoles.owner,
  );

  if (!workspace)
    throw new Error(
      "MOCK_WORKSPACES_WITH_DIFFERENT_ROLES does not have a workspace with owner role.",
    );

  return workspace;
}

export function getWorkspaceWithUserRights() {
  const workspace = MOCK_WORKSPACES_WITH_DIFFERENT_ROLES.find(
    ({ role }) => role === WorkspaceRoles.user,
  );

  if (!workspace)
    throw new Error(
      "MOCK_WORKSPACES_WITH_DIFFERENT_ROLES does not have a workspace with user role.",
    );

  return workspace;
}

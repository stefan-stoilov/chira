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

export const success: InferResponseType<WorkspacesRpc, typeof http.OK> = {
  workspaces: MOCK_WORKSPACES,
};
export const successStatus = { status: http.OK };

export const error: InferResponseType<
  WorkspacesRpc,
  typeof http.INTERNAL_SERVER_ERROR
> = {
  error: "Internal Server Error",
};
export const errorStatus = { status: http.INTERNAL_SERVER_ERROR };

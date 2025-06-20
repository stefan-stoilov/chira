import {
  queryOptions,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { workspacesKeys } from "../query-key-factory";

import type { InferResponseType } from "hono";
import { hcInit } from "@/lib/hc";
import type { WorkspacesRouter } from "@/server/routes/workspaces";

const { rpc } = hcInit<WorkspacesRouter>();

export type WorkspaceRpc = (typeof rpc.api.workspaces)[":id"]["$get"];
export type UseWorkspaceData = InferResponseType<WorkspaceRpc, 200>;

type UseWorkspaceQueryOptions = UseQueryOptions<
  UseWorkspaceData,
  Error & { cause: Errors }
>;

enum Errors {
  NOT_FOUND = "Not found",
  UNAUTHORIZED = "Unauthorized",
  INTERNAL_SERVER_ERROR = "Internal Server Error",
}

type UseWorkspaceResult = UseQueryResult<
  UseWorkspaceData,
  Error & { cause: Errors }
>;

export const workspaceQuery = (workspaceId: string) =>
  queryOptions<UseWorkspaceData, Error & { cause: Errors }>({
    queryKey: workspacesKeys.detail(workspaceId),
    queryFn: async () => {
      const res = await rpc.api.workspaces[":id"].$get({
        param: { id: workspaceId },
      });

      if (!res.ok) {
        const { status } = res;

        if (status === 404)
          throw new Error("Oops, seems this workspace could not be found!", {
            cause: Errors.NOT_FOUND,
          });

        if (status === 401)
          throw new Error(Errors.UNAUTHORIZED, {
            cause: Errors.UNAUTHORIZED,
          });

        if (status === 500)
          throw new Error(Errors.INTERNAL_SERVER_ERROR, {
            cause: Errors.INTERNAL_SERVER_ERROR,
          });
      }

      return await res.json();
    },
  });

export function useWorkspace(
  workspaceId: string,
  options?: UseWorkspaceQueryOptions,
): UseWorkspaceResult {
  return useQuery(
    options
      ? { ...options, ...workspaceQuery(workspaceId) }
      : workspaceQuery(workspaceId),
  );
}

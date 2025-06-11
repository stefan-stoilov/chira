import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { workspacesKeys } from "../query-key-factory";

import type { InferResponseType } from "hono";
import { hcInit } from "@/lib/hc";
import type { WorkspacesRouter } from "@/server/routes/workspaces";

const { rpc } = hcInit<WorkspacesRouter>();

export type WorkspaceInvitesRpc =
  (typeof rpc.api.workspaces)[":id"]["invites"]["$get"];
export type UseWorkspaceInvitesData = InferResponseType<
  WorkspaceInvitesRpc,
  200
>;

enum Errors {
  NOT_FOUND = "Not found",
  UNAUTHORIZED = "Unauthorized",
  INTERNAL_SERVER_ERROR = "Internal Server Error",
}

const fetchInvites = async ({
  pageParam,
  workspaceId,
}: {
  pageParam: number;
  workspaceId: string;
}) => {
  const res = await rpc.api.workspaces[":id"].invites.$get({
    param: { id: workspaceId },
    query: { page: pageParam },
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
};

export function useWorkspaceInvites(
  workspaceId: string,
): UseInfiniteQueryResult<
  InfiniteData<UseWorkspaceInvitesData, unknown>,
  Error
> {
  return useInfiniteQuery({
    queryKey: workspacesKeys.invites(workspaceId),
    initialPageParam: 1,
    queryFn: ({ pageParam = 0 }) => fetchInvites({ pageParam, workspaceId }),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.invites.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
}

import type { InferResponseType } from "hono";
import {
  useQuery,
  queryOptions,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { workspacesKeys } from "@/features/workspaces/api/query-key-factory";
import { hcInit } from "@/lib/hc";
import type { MembersRouter } from "@/server/routes/workspaces/members";

const { rpc } = hcInit<MembersRouter>();

export type MembersRpc = (typeof rpc.api.workspaces)[":id"]["members"]["$get"];
export type UseMembersData = InferResponseType<MembersRpc, 200>;

type UseMembersQueryOptions = Omit<
  UseQueryOptions<UseMembersData, Error>,
  "queryFn" | "queryKey"
>;

type UseMembersQueryResult = UseQueryResult<UseMembersData, Error>;

export const membersQuery = (workspaceId: string) =>
  queryOptions<UseMembersData, Error>({
    queryKey: workspacesKeys.members(workspaceId),
    queryFn: async () => {
      const res = await rpc.api.workspaces[":id"].members.$get({
        param: { id: workspaceId },
      });

      if (!res.ok) {
        const { status } = res;

        if (status === 404)
          throw new Error("Oops, seems this workspace could not be found!");

        if (status === 401) throw new Error("Unauthorized");

        if (status === 500) throw new Error("Internal sever error");

        throw new Error("Error occurred");
      }

      return await res.json();
    },
  });

export function useMembers(
  workspaceId: string,
  options?: UseMembersQueryOptions,
): UseMembersQueryResult {
  return useQuery(
    options
      ? { ...options, ...membersQuery(workspaceId) }
      : membersQuery(workspaceId),
  );
}

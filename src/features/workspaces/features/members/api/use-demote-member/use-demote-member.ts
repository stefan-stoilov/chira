import type { InferRequestType, InferResponseType } from "hono";
import {
  useQueryClient,
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { hcInit } from "@/lib/hc";
import type { MembersRouter } from "@/server/routes/workspaces/members";
import { membersQuery } from "../use-members";
import { WorkspaceRoles } from "@/server/db/schemas";

const { rpc } = hcInit<MembersRouter>();

export type DemoteMemberRpc =
  (typeof rpc.api.workspaces)[":id"]["members"][":user-id"]["demote"]["$patch"];

type RequestType = InferRequestType<DemoteMemberRpc>;
type ResponseType = InferResponseType<DemoteMemberRpc, 200>;

type UseDemoteMemberOptions = Omit<
  UseMutationOptions<ResponseType, Error, RequestType>,
  "mutationFn"
>;

type UseDemoteMemberResult = UseMutationResult<
  ResponseType,
  Error,
  RequestType
>;

export function useDemoteMember(
  options: UseDemoteMemberOptions = {},
): UseDemoteMemberResult {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    ...options,
    mutationFn: async ({ param }) => {
      const res = await rpc.api.workspaces[":id"].members[
        ":user-id"
      ].demote.$patch({ param });

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      return data;
    },
    onMutate: (vars, ...props) => {
      const { param } = vars;
      const queryKey = membersQuery(param.id).queryKey;
      const cache = queryClient.getQueryData(queryKey);

      const newCache =
        typeof cache !== "undefined"
          ? {
              members: cache.members.map((mem) =>
                mem.id !== param["user-id"]
                  ? mem
                  : { ...mem, role: WorkspaceRoles.user },
              ),
            }
          : undefined;

      queryClient.setQueryData(queryKey, newCache);

      options?.onMutate?.(vars, ...props);
    },
    onError: (data, vars, ...props) => {
      const { param } = vars;
      const queryKey = membersQuery(param.id).queryKey;
      queryClient.invalidateQueries({ queryKey });
      toast.error(
        "An error occurred trying to demote member. Please try again later.",
      );

      options?.onError?.(data, vars, ...props);
    },
  });
}

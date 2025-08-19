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

const { rpc } = hcInit<MembersRouter>();

export type DeleteMemberRpc =
  (typeof rpc.api.workspaces)[":id"]["members"][":user-id"]["$delete"];

type RequestType = InferRequestType<DeleteMemberRpc>;
type ResponseType = InferResponseType<DeleteMemberRpc, 200>;

type UseDeleteMemberOptions = Omit<
  UseMutationOptions<ResponseType, Error, RequestType>,
  "mutationFn"
>;

type UseDeleteMemberResult = UseMutationResult<
  ResponseType,
  Error,
  RequestType
>;

export function useDeleteMember(
  options: UseDeleteMemberOptions = {},
): UseDeleteMemberResult {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    ...options,
    mutationFn: async ({ param }) => {
      const res = await rpc.api.workspaces[":id"].members[":user-id"].$delete({
        param,
      });

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

      queryClient.setQueryData(
        queryKey,
        cache
          ? {
              members: cache?.members?.filter(
                (mem) => mem.id !== param["user-id"],
              ),
            }
          : undefined,
      );

      options?.onMutate?.(vars, ...props);
    },
    onError: (data, vars, ...props) => {
      const { param } = vars;
      const queryKey = membersQuery(param.id).queryKey;
      queryClient.invalidateQueries({ queryKey });
      toast.error(
        "An error occurred trying to delete member. Please try again later.",
      );

      options?.onError?.(data, vars, ...props);
    },
  });
}

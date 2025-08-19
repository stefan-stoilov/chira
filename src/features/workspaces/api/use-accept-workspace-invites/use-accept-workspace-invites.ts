import type { InferRequestType, InferResponseType } from "hono";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { workspaceInvitesQuery } from "../use-workspace-invites";
import { hcInit } from "@/lib/hc";
import type { WorkspacesRouter } from "@/server/routes/workspaces";

const { rpc } = hcInit<WorkspacesRouter>();

export type UseAcceptWorkspaceInvitesRpc =
  (typeof rpc.api.workspaces)[":id"]["invites"]["$post"];

type RequestType = InferRequestType<UseAcceptWorkspaceInvitesRpc> & {
  page: number;
};
type ResponseType = InferResponseType<UseAcceptWorkspaceInvitesRpc, 200>;

type UseAcceptWorkspaceInvitesOptions = Omit<
  UseMutationOptions<ResponseType, Error, RequestType>,
  "mutationFn"
>;

type UseAcceptWorkspaceInvitesResult = UseMutationResult<
  ResponseType,
  Error,
  RequestType
>;

export function useAcceptWorkspaceInvites(
  options: UseAcceptWorkspaceInvitesOptions = {},
): UseAcceptWorkspaceInvitesResult {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    ...options,
    mutationFn: async ({ param, json }) => {
      const res = await rpc.api.workspaces[":id"].invites.$post({
        json,
        param,
      });

      if (!res.ok) {
        const status = res.status;

        if (status === 401) throw new Error("Unauthorized");

        if (status === 404) throw new Error("Not found");

        if (status === 500)
          throw new Error(
            "Something went wrong! We could not add new workspace members successfully, please try again later",
          );
      }

      return await res.json();
    },
    onMutate: ({ param: { id }, page, json }) => {
      const userIds = new Set(json.userIds);
      const cache = queryClient.getQueryData(
        workspaceInvitesQuery({ page, id }).queryKey,
      );
      const updatedInvites = cache?.invites.map((inv) =>
        !userIds.has(inv.id)
          ? inv
          : { ...inv, acceptedAt: new Date(inv.createdAt).toDateString() },
      );

      const newCache =
        typeof cache !== "undefined" && typeof updatedInvites !== "undefined"
          ? {
              totalPages: cache.totalPages,
              currentPage: cache.currentPage,
              invites: updatedInvites,
            }
          : undefined;

      queryClient.setQueryData(
        workspaceInvitesQuery({ page, id }).queryKey,
        newCache,
      );

      options?.onMutate?.({ param: { id }, page, json });
    },
    onError: (error, variables, context) => {
      const {
        param: { id },
        page,
      } = variables;

      queryClient.invalidateQueries({
        queryKey: workspaceInvitesQuery({ page, id }).queryKey,
      });

      toast.error(
        "Something went wrong when trying to accept user request to join workspace",
      );

      options?.onError?.(error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      const {
        param: { id },
        page,
      } = variables;
      const { members } = data;
      const errors = members?.filter((member) => "error" in member);

      if (errors.length > 0) {
        queryClient.invalidateQueries({
          queryKey: workspaceInvitesQuery({ page, id }).queryKey,
        });
        toast.error(
          "Something went wrong when trying to accept some of the user requests to join workspace",
        );
      }

      options?.onSuccess?.(data, variables, context);
    },
  });
}

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

export type UseSoftDeleteWorkspaceInvitesRpc =
  (typeof rpc.api.workspaces)[":id"]["invites"]["$patch"];

type RequestType = InferRequestType<UseSoftDeleteWorkspaceInvitesRpc> & {
  page: number;
};
type ResponseType = InferResponseType<UseSoftDeleteWorkspaceInvitesRpc, 200>;

type UseSoftDeleteWorkspaceInvitesOptions = UseMutationOptions<
  ResponseType,
  Error,
  RequestType
>;

type UseSoftDeleteWorkspaceInvitesResult = UseMutationResult<
  ResponseType,
  Error,
  RequestType
>;

export function useSoftDeleteWorkspaceInvites(
  options: UseSoftDeleteWorkspaceInvitesOptions = {},
): UseSoftDeleteWorkspaceInvitesResult {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    ...options,
    mutationFn: async ({ param, json }) => {
      const res = await rpc.api.workspaces[":id"].invites.$patch({
        json,
        param,
      });

      if (!res.ok) {
        const status = res.status;

        if (status === 401) throw new Error("Unauthorized");

        if (status === 404) throw new Error("Not found");

        if (status === 500)
          throw new Error(
            "Something went wrong! We could not delete workspace invites successfully, please try again later",
          );
      }

      return await res.json();
    },
    onMutate: ({ param: { id }, page, json }) => {
      const userIds = new Set(json.userIds);
      const cache = queryClient.getQueryData(
        workspaceInvitesQuery({ page, id }).queryKey,
      );
      const deletedInvites = cache?.invites.map((inv) =>
        !userIds.has(inv.id)
          ? inv
          : { ...inv, deletedAt: new Date(inv.createdAt).toDateString() },
      );

      const newCache =
        typeof cache !== "undefined" && typeof deletedInvites !== "undefined"
          ? {
              totalPages: cache.totalPages,
              currentPage: cache.currentPage,
              invites: deletedInvites,
            }
          : undefined;

      queryClient.setQueryData(
        workspaceInvitesQuery({ page, id }).queryKey,
        newCache,
      );
    },
    onError: (error, { param: { id }, page }) => {
      queryClient.invalidateQueries({
        queryKey: workspaceInvitesQuery({ page, id }).queryKey,
      });

      toast.error("Something went wrong deleting workspace invites.");
    },
    onSuccess: ({ deletedInvites }, { param: { id }, page }) => {
      const errors = deletedInvites?.filter((invite) => "error" in invite);

      if (errors.length > 0) {
        queryClient.invalidateQueries({
          queryKey: workspaceInvitesQuery({ page, id }).queryKey,
        });
        toast.error(
          "Something went wrong when trying to delete some of the workspace invites.",
        );
      }
    },
  });
}

import type { InferRequestType, InferResponseType } from "hono";
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { hcInit } from "@/lib/hc";
import type { WorkspacesRouter } from "@/server/routes/workspaces";

const { rpc } = hcInit<WorkspacesRouter>();

export type JoinWorkspaceRpc =
  (typeof rpc.api.workspaces)[":id"]["join"]["$post"];

type RequestType = InferRequestType<JoinWorkspaceRpc>;
type ResponseType = InferResponseType<JoinWorkspaceRpc, 200>;

type UseJoinWorkspaceOptions = UseMutationOptions<
  ResponseType,
  Error,
  RequestType
>;

type UseJoinWorkspaceResult = UseMutationResult<
  ResponseType,
  Error,
  RequestType
>;

export function useJoinWorkspace(
  options: UseJoinWorkspaceOptions = {},
): UseJoinWorkspaceResult {
  return useMutation<ResponseType, Error, RequestType>({
    ...options,
    mutationFn: async ({ param, json }) => {
      const res = await rpc.api.workspaces[":id"].join.$post({
        param,
        json,
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      }

      const { status } = res;

      if (status === 404)
        throw new Error(
          "No workspace found. You may be using an invite code for a workspace that has been deleted.",
        );

      if (status === 500) {
        throw new Error(
          "Internal server error occurred. Please try again later",
        );
      }

      const { error } = await res.json();
      throw new Error(error);
    },
    onSuccess: (data, ...props) => {
      toast.success(
        `Successfully sent a requested to join workspace - ${data.name}`,
      );

      if (typeof options?.onSuccess === "function")
        options.onSuccess(data, ...props);
    },
    onError: (...props) => {
      toast.error("Failed send a request to join workspace.");

      if (typeof options?.onError === "function") options.onError(...props);
    },
  });
}

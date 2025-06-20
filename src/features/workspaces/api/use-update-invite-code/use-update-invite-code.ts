import type { InferRequestType, InferResponseType } from "hono";
import {
  useQueryClient,
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { hcInit } from "@/lib/hc";
import type { WorkspacesRouter } from "@/server/routes/workspaces";
import { workspaceQuery } from "../use-workspace";

const { rpc } = hcInit<WorkspacesRouter>();

export type UpdateInviteCodeRpc =
  (typeof rpc.api.workspaces)[":id"]["invite-code"]["$patch"];

type RequestType = InferRequestType<UpdateInviteCodeRpc>;
type ResponseType = InferResponseType<UpdateInviteCodeRpc, 200>;

type UseUpdateInviteCodeWorkspaceOptions = UseMutationOptions<
  ResponseType,
  Error,
  RequestType
>;

type UseUpdateInviteCodeWorkspaceResult = UseMutationResult<
  ResponseType,
  Error,
  RequestType
>;

export function useUpdateInviteCode(
  options: UseUpdateInviteCodeWorkspaceOptions = {},
): UseUpdateInviteCodeWorkspaceResult {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    ...options,
    mutationFn: async ({ param, json }) => {
      const res = await rpc.api.workspaces[":id"]["invite-code"].$patch({
        param,
        json,
      });
      if (!res.ok) throw new Error();

      const data = await res.json();

      return data;
    },
    onSuccess: (data, ...props) => {
      const { id, inviteCode } = data;
      if (inviteCode) {
        toast.success("Invite code updated.");
      } else {
        toast.success("Invite code removed.");
      }

      queryClient.setQueryData(workspaceQuery(id).queryKey, (prev) => {
        if (prev) return { ...prev, inviteCode };
      });

      if (typeof options?.onSuccess === "function")
        options.onSuccess(data, ...props);
    },
    onError: (...props) => {
      toast.error("Failed to update invite code of workspace.");

      if (typeof options?.onError === "function") options.onError(...props);
    },
  });
}

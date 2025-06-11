import type { InferRequestType, InferResponseType } from "hono";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { workspacesKeys } from "../query-key-factory";
import { hcInit } from "@/lib/hc";
import type { WorkspacesRouter } from "@/server/routes/workspaces";
import type { UseWorkspaceData } from "../use-workspace";

const { rpc } = hcInit<WorkspacesRouter>();

export type UpdateInviteCodeRpc =
  (typeof rpc.api.workspaces)[":id"]["invite-code"]["$patch"];

type RequestType = InferRequestType<UpdateInviteCodeRpc>;
type ResponseType = InferResponseType<UpdateInviteCodeRpc, 200>;

export function useUpdateInviteCode() {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const res = await rpc.api.workspaces[":id"]["invite-code"].$patch({
        param,
        json,
      });
      if (!res.ok) throw new Error();

      const data = await res.json();

      return data;
    },
    onSuccess: ({ id, inviteCode }) => {
      if (inviteCode) {
        toast.success("Invite code updated.");
      } else {
        toast.success("Invite code removed.");
      }

      queryClient.setQueryData<UseWorkspaceData>(
        workspacesKeys.detail(id),
        (prev) => {
          if (prev) return { ...prev, inviteCode };
        },
      );
    },
    onError: () => {
      toast.error("Failed to update invite code of workspace.");
    },
  });
}

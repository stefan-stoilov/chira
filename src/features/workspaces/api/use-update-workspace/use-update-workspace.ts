import type { InferRequestType, InferResponseType } from "hono";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { workspacesKeys } from "../query-key-factory";
import { hcInit } from "@/lib/hc";
import type { WorkspacesRouter } from "@/server/routes/workspaces";
import type { UseWorkspacesData } from "../use-workspaces";
import type { UseWorkspaceData } from "../use-workspace";

const { rpc } = hcInit<WorkspacesRouter>();

export type UpdateWorkspaceRpc = (typeof rpc.api.workspaces)[":id"]["$patch"];

type RequestType = InferRequestType<UpdateWorkspaceRpc>;
type ResponseType = InferResponseType<UpdateWorkspaceRpc, 200>;

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const res = await rpc.api.workspaces[":id"].$patch({ json, param });
      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      return data;
    },
    onSuccess: ({ id, name }) => {
      toast.success(`Workspace ${name} updated.`);

      queryClient.setQueryData<UseWorkspacesData>(
        workspacesKeys.lists(),
        (prev) => {
          if (prev)
            return {
              workspaces: prev.workspaces.map((workspace) =>
                workspace.id !== id ? workspace : { ...workspace, name },
              ),
            };
        },
      );

      queryClient.setQueryData<UseWorkspaceData>(
        workspacesKeys.detail(id),
        (prev) => {
          if (prev) return { ...prev, name };
        },
      );
    },
    onError: () => {
      toast.error("Failed to update workspace.");
    },
  });
}

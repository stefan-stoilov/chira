import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { workspacesKeys } from "../query-key-factory";
import { hcInit } from "@/lib/hc";
import type { WorkspacesRouter } from "@/server/routes/workspaces";
import type { UseWorkspacesData } from "../use-workspaces";

const { rpc } = hcInit<WorkspacesRouter>();

export type DeleteWorkspaceRpc = (typeof rpc.api.workspaces)[":id"]["$delete"];

type RequestType = InferRequestType<DeleteWorkspaceRpc>;
type ResponseType = InferResponseType<DeleteWorkspaceRpc, 200>;

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await rpc.api.workspaces[":id"].$delete({ param });

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      return data;
    },
    onSuccess: ({ id }) => {
      toast.success("Workspace deleted.");

      queryClient.setQueryData<UseWorkspacesData>(
        workspacesKeys.lists(),
        (prev) => {
          if (typeof prev !== "undefined")
            return {
              workspaces: prev.workspaces.filter(
                (workspace) => workspace.id !== id,
              ),
            };
        },
      );

      queryClient.removeQueries({ queryKey: workspacesKeys.detail(id) });

      router.push("/dashboard");
    },
    onError: () => {
      toast.error("Failed to delete workspace.");
    },
  });
}

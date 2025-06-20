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
import { workspacesQuery } from "../use-workspaces";
import { workspaceQuery } from "../use-workspace";

const { rpc } = hcInit<WorkspacesRouter>();

export type UpdateWorkspaceRpc = (typeof rpc.api.workspaces)[":id"]["$patch"];

type RequestType = InferRequestType<UpdateWorkspaceRpc>;
type ResponseType = InferResponseType<UpdateWorkspaceRpc, 200>;

type UseUpdateWorkspaceOptions = UseMutationOptions<
  ResponseType,
  Error,
  RequestType
>;

type UseUpdateWorkspaceResult = UseMutationResult<
  ResponseType,
  Error,
  RequestType
>;

export function useUpdateWorkspace(
  options: UseUpdateWorkspaceOptions = {},
): UseUpdateWorkspaceResult {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    ...options,
    mutationFn: async ({ json, param }) => {
      const res = await rpc.api.workspaces[":id"].$patch({ json, param });
      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      return data;
    },
    onSuccess: (data, ...props) => {
      const { id, name } = data;
      toast.success(`Workspace ${name} updated.`);

      queryClient.setQueryData(workspacesQuery.queryKey, (prev) => {
        if (prev)
          return {
            workspaces: prev.workspaces.map((workspace) =>
              workspace.id !== id ? workspace : { ...workspace, name },
            ),
          };
      });

      queryClient.setQueryData(workspaceQuery(id).queryKey, (prev) => {
        if (prev) return { ...prev, name };
      });

      if (typeof options?.onSuccess === "function")
        options.onSuccess(data, ...props);
    },
    onError: (...props) => {
      toast.error("Failed to update workspace.");

      if (typeof options?.onError === "function") options.onError(...props);
    },
  });
}

import type { InferRequestType, InferResponseType } from "hono";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { hcInit } from "@/lib/hc";
import type { WorkspacesRouter } from "@/server/routes/workspaces";
import { workspacesQuery } from "../use-workspaces";
import { workspaceQuery } from "../use-workspace";

const { rpc } = hcInit<WorkspacesRouter>();

export type DeleteWorkspaceRpc = (typeof rpc.api.workspaces)[":id"]["$delete"];

type RequestType = InferRequestType<DeleteWorkspaceRpc>;
type ResponseType = InferResponseType<DeleteWorkspaceRpc, 200>;

type UseDeleteWorkspaceOptions = UseMutationOptions<
  ResponseType,
  Error,
  RequestType
>;

type UseDeleteWorkspaceResult = UseMutationResult<
  ResponseType,
  Error,
  RequestType
>;

export function useDeleteWorkspace(
  options: UseDeleteWorkspaceOptions = {},
): UseDeleteWorkspaceResult {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ResponseType, Error, RequestType>({
    ...options,
    mutationFn: async ({ param }) => {
      const res = await rpc.api.workspaces[":id"].$delete({ param });

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      return data;
    },
    onSuccess: (data, ...props) => {
      const { id } = data;

      toast.success("Workspace deleted.");

      queryClient.setQueryData(workspacesQuery.queryKey, (prev) => {
        if (typeof prev !== "undefined")
          return {
            workspaces: prev.workspaces.filter(
              (workspace) => workspace.id !== id,
            ),
          };
      });

      queryClient.removeQueries({ queryKey: workspaceQuery(id).queryKey });

      router.push("/dashboard");

      if (typeof options?.onSuccess === "function")
        options.onSuccess(data, ...props);
    },
    onError: (...props) => {
      toast.error("Failed to delete workspace.");

      if (typeof options?.onError === "function") options.onError(...props);
    },
  });
}

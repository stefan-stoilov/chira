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

export type CreateWorkspaceRpc = (typeof rpc.api.workspaces)["$post"];

type RequestType = InferRequestType<CreateWorkspaceRpc>;
type ResponseType = InferResponseType<CreateWorkspaceRpc, 201>;

type UseCreateWorkspaceOptions = UseMutationOptions<
  ResponseType,
  Error,
  RequestType
>;

type UseCreateWorkspaceResult = UseMutationResult<
  ResponseType,
  Error,
  RequestType
>;

export function useCreateWorkspace(
  options: UseCreateWorkspaceOptions = {},
): UseCreateWorkspaceResult {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    ...options,
    mutationFn: async ({ json }) => {
      const res = await rpc.api.workspaces.$post({ json });

      if (!res.ok) {
        if (res.status === 422) {
          throw new Error("Validation error(s).");
        }

        const message = (await res.json()).error;
        throw new Error(message);
      }

      const data = await res.json();

      return data;
    },
    onSuccess: (data, ...props) => {
      toast.success("Workspace created.");
      const { id, name, role, allowMemberInviteManagement } = data;
      queryClient.setQueryData(workspacesQuery.queryKey, (prev) => {
        if (prev) {
          return { workspaces: [...prev.workspaces, { id, name, role }] };
        } else {
          return { workspaces: [{ id, name, role }] };
        }
      });
      queryClient.setQueryData(workspaceQuery(id).queryKey, () => ({
        id,
        name,
        role,
        allowMemberInviteManagement,
      }));

      router.push(`/dashboard/workspaces/${id}`);

      if (typeof options?.onSuccess === "function")
        options.onSuccess(data, ...props);
    },
    onError: (error, ...props) => {
      toast.error(error.message);

      if (typeof options?.onError === "function")
        options.onError(error, ...props);
    },
  });

  return mutation;
}

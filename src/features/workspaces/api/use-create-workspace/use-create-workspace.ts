import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
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
    onSuccess: ({ id, name, role }) => {
      toast.success("Workspace created.");
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
      }));

      router.push(`/dashboard/workspaces/${id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}

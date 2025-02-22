import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { workspacesKeys } from "../query-key-factory";
import { hcInit } from "@/lib/hc";
import type { WorkspacesRouter } from "@/server/routes/workspaces";
import type { UseWorkspacesData } from "../use-workspaces";
import type { UseWorkspaceData } from "../use-workspace";

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
      queryClient.setQueryData<UseWorkspacesData>(
        workspacesKeys.lists(),
        (prev) => {
          if (prev) {
            return { workspaces: [...prev.workspaces, { id, name, role }] };
          } else {
            return { workspaces: [{ id, name, role }] };
          }
        },
      );
      queryClient.setQueryData<UseWorkspaceData>(
        workspacesKeys.detail(id),
        () => ({ id, name, role }),
      );

      router.push(`/dashboard/workspaces/${id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}

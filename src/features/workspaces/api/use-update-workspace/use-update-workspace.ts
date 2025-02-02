import type { InferRequestType, InferResponseType } from "hono";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { rpc } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof rpc.api.workspaces)[":id"]["$patch"]
>;
type ResponseType = InferResponseType<
  (typeof rpc.api.workspaces)[":id"]["$patch"],
  200
>;

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const res = await rpc.api.workspaces[":id"].$patch({ form, param });
      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      return data;
    },
    onSuccess: ({ $id }) => {
      toast.success("Workspace updated.");

      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", $id],
        exact: true,
      });
    },
    onError: () => {
      toast.error("Failed to update workspace.");
    },
  });
}

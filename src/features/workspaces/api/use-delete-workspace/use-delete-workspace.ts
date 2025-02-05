import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { rpc } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof rpc.api.workspaces)[":id"]["$delete"]
>;
type ResponseType = InferResponseType<
  (typeof rpc.api.workspaces)[":id"]["$delete"],
  200
>;

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
    onSuccess: ({ $id }) => {
      toast.success("Workspace deleted.");

      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", $id],
        exact: true,
      });

      router.push("/dashboard");
    },
    onError: () => {
      toast.error("Failed to delete workspace.");
    },
  });
}

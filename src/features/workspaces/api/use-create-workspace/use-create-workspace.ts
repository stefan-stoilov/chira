import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { rpc } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof rpc.api.workspaces.$post>;
type RequestType = InferRequestType<typeof rpc.api.workspaces.$post>;

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await rpc.api.workspaces.$post({ json });

      if (!res.ok) {
        const message = (await res.json()).error || res.statusText;
        throw new Error(message);
      }

      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      toast.success("Workspace created.");
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}

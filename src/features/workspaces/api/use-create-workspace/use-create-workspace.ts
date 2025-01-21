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
    mutationFn: async ({ form }) => {
      const res = await rpc.api.workspaces.$post({ form });

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
    onSuccess: () => {
      toast.success("Workspace created.");
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}

import type { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { rpc } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof rpc.api.auth)["sign-out"]["$post"]
>;

export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const res = await rpc.api.auth["sign-out"].$post();

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
      router.refresh();
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  return mutation;
}

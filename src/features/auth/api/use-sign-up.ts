import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { rpc } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof rpc.api.auth)["sign-up"]["$post"]
>;
type RequestType = InferRequestType<(typeof rpc.api.auth)["sign-up"]["$post"]>;

export function useSignUp() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await rpc.api.auth["sign-up"].$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to register!");
    },
  });

  return mutation;
}

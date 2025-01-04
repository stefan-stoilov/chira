import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;

export function useSignUp() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await client.api.auth["sign-up"].$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to register!");
    },
  });

  return mutation;
}

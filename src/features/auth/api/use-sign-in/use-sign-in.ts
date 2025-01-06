import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { rpc } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof rpc.api.auth)["sign-in"]["$post"]
>;
type RequestType = InferRequestType<(typeof rpc.api.auth)["sign-in"]["$post"]>;

export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await rpc.api.auth["sign-in"].$post({ json });

      if (!res.ok) {
        const message = (await res.json()).error || res.statusText;
        throw new Error(message);
      }

      const data = await res.json();
      return data;
    },
    onSuccess: () => {
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

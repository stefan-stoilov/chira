import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { userKeys } from "../query-keys";
import { hcInit } from "@/lib/hc";
import type { AuthRouter } from "@/server/routes/auth";

const { rpc } = hcInit<AuthRouter>();

export type SignUpRpc = (typeof rpc.api.auth)["sign-up"]["$post"];

type ResponseType = InferResponseType<SignUpRpc>;
type RequestType = InferRequestType<SignUpRpc>;

export function useSignUp() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await rpc.api.auth["sign-up"].$post({ json });

      if (!res.ok) {
        throw new Error("Failed to sign in!");
      }

      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });
      router.push("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return mutation;
}

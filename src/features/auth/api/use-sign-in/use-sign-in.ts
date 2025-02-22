import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { userKeys } from "../query-keys";
import { hcInit } from "@/lib/hc";
import type { AuthRouter } from "@/server/routes/auth";

const { rpc } = hcInit<AuthRouter>();

export type SignInRpc = (typeof rpc.api.auth)["sign-in"]["$post"];

type ResponseType = InferResponseType<SignInRpc>;
type RequestType = InferRequestType<SignInRpc>;

export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const res = await rpc.api.auth["sign-in"].$post({ json });

      if (!res.ok) {
        if (res.status === 422) {
          const message = (await res.json()).error;
          throw new Error(
            message.issues[0]?.message || "Invalid data provided.",
          );
        } else {
          const message = (await res.json()).error;
          throw new Error(message);
        }
      }

      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}

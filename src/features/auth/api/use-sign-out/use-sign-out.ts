import type { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { hcInit } from "@/lib/hc";
import type { AuthRouter } from "@/server/routes/auth";

const { rpc } = hcInit<AuthRouter>();

export type SignOutRpc = (typeof rpc.api.auth)["sign-out"]["$post"];

type ResponseType = InferResponseType<SignOutRpc>;

export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const res = await rpc.api.auth["sign-out"].$post();

      if (!res.ok) {
        throw Error("Unexpected error occurred, could not sign out.");
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      router.push("/sign-in");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return mutation;
}

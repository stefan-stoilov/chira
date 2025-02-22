import { useQuery } from "@tanstack/react-query";
import { userKeys } from "../query-keys";
import { hcInit } from "@/lib/hc";
import type { AuthRouter } from "@/server/routes/auth";

const { rpc } = hcInit<AuthRouter>();

export type CurrentUserRpc = typeof rpc.api.auth.user.$get;

export function useCurrentUser() {
  const query = useQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const res = await rpc.api.auth.user.$get();

      if (!res.ok) {
        return null;
      }

      const data = await res.json();
      return data;
    },
  });

  return query;
}

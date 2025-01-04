import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export function useCurrentUser() {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await client.api.auth.current.$get();

      if (!res.ok) {
        return null;
      }

      const data = await res.json();
      return data;
    },
  });

  return query;
}

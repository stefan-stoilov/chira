import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { rpc } from "@/lib/rpc";

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const res = await rpc.api.workspaces.$get();

      if (!res.ok) {
        const data = await res.json();

        let errMessage: string;

        if (typeof data?.error === "string") {
          errMessage = data.error;
        } else {
          errMessage = "Something went wrong. Could not load workspaces.";
        }

        toast.error(errMessage);

        throw new Error(errMessage);
      }

      return await res.json();
    },
  });
}

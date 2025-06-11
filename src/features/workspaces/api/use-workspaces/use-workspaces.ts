import type { InferResponseType } from "hono";
import {
  useQuery,
  queryOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { workspacesKeys } from "../query-key-factory";
import { hcInit } from "@/lib/hc";
import type { WorkspacesRouter } from "@/server/routes/workspaces";

const { rpc } = hcInit<WorkspacesRouter>();

export type WorkspacesRpc = (typeof rpc.api.workspaces)["$get"];
export type UseWorkspacesData = InferResponseType<WorkspacesRpc, 200>;

type UseWorkspacesQueryOptions = UseQueryOptions<UseWorkspacesData, Error>;

export const workspacesQuery = queryOptions<UseWorkspacesData, Error>({
  queryKey: workspacesKeys.lists(),
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

export function useWorkspaces(options?: UseWorkspacesQueryOptions) {
  return useQuery(
    options ? { ...options, ...workspacesQuery } : workspacesQuery,
  );
}

import type { InferResponseType } from "hono";
import {
  useQuery,
  queryOptions,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { workspacesKeys } from "@/features/workspaces/api/query-key-factory";
import { hcInit } from "@/lib/hc";
import type { ProjectsRouter } from "@/server/routes/workspaces/projects";

const { rpc } = hcInit<ProjectsRouter>();

export type ProjectsRpc =
  (typeof rpc.api.workspaces)[":id"]["projects"]["$get"];
export type UseProjectsData = InferResponseType<ProjectsRpc, 200>;

type UseProjectsQueryOptions = Omit<
  UseQueryOptions<UseProjectsData, Error>,
  "queryFn" | "queryKey"
>;

type UseProjectsQueryResult = UseQueryResult<UseProjectsData, Error>;

export const projectsQuery = (workspaceId: string) =>
  queryOptions<UseProjectsData, Error>({
    queryKey: workspacesKeys.projects(workspaceId),
    queryFn: async () => {
      const res = await rpc.api.workspaces[":id"].projects.$get({
        param: { id: workspaceId },
      });

      if (!res.ok) {
        const { status } = res;

        if (status === 404)
          throw new Error("Oops, seems this workspace could not be found!");

        if (status === 401) throw new Error("Unauthorized");

        if (status === 500) throw new Error("Internal sever error");

        throw new Error("Error occurred");
      }

      return await res.json();
    },
  });

export function useProjects(
  workspaceId: string,
  options?: UseProjectsQueryOptions,
): UseProjectsQueryResult {
  return useQuery(
    options
      ? { ...options, ...projectsQuery(workspaceId) }
      : projectsQuery(workspaceId),
  );
}

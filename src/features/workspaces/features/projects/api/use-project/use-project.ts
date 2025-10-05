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

export type ProjectRpc =
  (typeof rpc.api.workspaces)[":id"]["projects"][":project-id"]["$get"];
export type UseProjectData = InferResponseType<ProjectRpc, 200>;

type ProjectQueryProps = {
  workspaceId: string;
  projectId: string;
};

type UseProjectQueryOptions = Omit<
  UseQueryOptions<UseProjectData, Error>,
  "queryFn" | "queryKey"
> &
  ProjectQueryProps;

type UseProjectQueryResult = UseQueryResult<UseProjectData, Error>;

export const projectQuery = ({ workspaceId, projectId }: ProjectQueryProps) =>
  queryOptions<UseProjectData, Error>({
    queryKey: workspacesKeys.projectDetail(workspaceId, projectId),
    queryFn: async () => {
      const res = await rpc.api.workspaces[":id"].projects[":project-id"].$get({
        param: { id: workspaceId, ["project-id"]: projectId },
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

export function useProject({
  workspaceId,
  projectId,
  ...options
}: UseProjectQueryOptions): UseProjectQueryResult {
  return useQuery(
    options
      ? { ...options, ...projectQuery({ workspaceId, projectId }) }
      : projectQuery({ workspaceId, projectId }),
  );
}

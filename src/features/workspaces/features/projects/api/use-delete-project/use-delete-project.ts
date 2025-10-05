import type { InferRequestType, InferResponseType } from "hono";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { hcInit } from "@/lib/hc";
import type { ProjectsRouter } from "@/server/routes/workspaces/projects";
import { projectsQuery } from "../use-projects";
import { projectQuery } from "../use-project";

const { rpc } = hcInit<ProjectsRouter>();

export type DeleteProjectRpc =
  (typeof rpc.api.workspaces)[":id"]["projects"][":project-id"]["$delete"];

type RequestType = InferRequestType<DeleteProjectRpc>;
type ResponseType = InferResponseType<DeleteProjectRpc, 200>;

type UseDeleteProjectOptions = UseMutationOptions<
  ResponseType,
  Error,
  RequestType
>;

type UseDeleteProjectResult = UseMutationResult<
  ResponseType,
  Error,
  RequestType
>;

export function useDeleteProject(
  options: UseDeleteProjectOptions = {},
): UseDeleteProjectResult {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ResponseType, Error, RequestType>({
    ...options,
    mutationFn: async ({ param }) => {
      const res = await rpc.api.workspaces[":id"].projects[
        ":project-id"
      ].$delete({ param });

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      return data;
    },
    onSuccess: (data, variables, ...props) => {
      toast.success("Project deleted.");

      queryClient.setQueryData(
        projectsQuery(variables.param.id).queryKey,
        (prev) => {
          if (prev)
            return {
              projects: prev.projects.filter(
                (project) => project.id !== variables.param["project-id"],
              ),
            };
        },
      );

      queryClient.removeQueries({
        queryKey: projectQuery({
          workspaceId: variables.param.id,
          projectId: variables.param["project-id"],
        }).queryKey,
      });

      router.replace("/dashboard");

      options?.onSuccess?.(data, variables, ...props);
    },
    onError: (...props) => {
      toast.error("Failed to delete project.");
      options?.onError?.(...props);
    },
  });
}

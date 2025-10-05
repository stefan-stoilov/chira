import type { InferRequestType, InferResponseType } from "hono";
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { hcInit } from "@/lib/hc";
import type { ProjectsRouter } from "@/server/routes/workspaces/projects";
import { projectsQuery } from "../use-projects";
import { projectQuery } from "../use-project";

const { rpc } = hcInit<ProjectsRouter>();

export type UpdateProjectRpc =
  (typeof rpc.api.workspaces)[":id"]["projects"][":project-id"]["$patch"];

type RequestType = InferRequestType<UpdateProjectRpc>;
type ResponseType = InferResponseType<UpdateProjectRpc, 200>;

type UseUpdateProjectOptions = Omit<
  UseMutationOptions<ResponseType, Error, RequestType>,
  "mutationFn"
>;

type UseUpdateProjectResult = UseMutationResult<
  ResponseType,
  Error,
  RequestType
>;

export function useUpdateProject(
  options: UseUpdateProjectOptions = {},
): UseUpdateProjectResult {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    ...options,
    mutationFn: async ({ param, json }) => {
      const res = await rpc.api.workspaces[":id"].projects[
        ":project-id"
      ].$patch({
        json,
        param,
      });

      if (!res.ok) {
        const { status } = res;
        if (status === 422) {
          throw new Error("Validation error(s).");
        }

        const message = (await res.json()).error;
        throw new Error(message);
      }

      return await res.json();
    },
    onSuccess: (data, ...props) => {
      const { id, name, workspaceId } = data;
      toast.success(`Project ${name} updated.`);

      queryClient.setQueryData(projectsQuery(workspaceId).queryKey, (prev) => {
        if (prev)
          return {
            projects: prev.projects.map((project) =>
              project.id !== id ? project : { ...project, name },
            ),
          };
      });

      queryClient.setQueryData(
        projectQuery({ workspaceId, projectId: id }).queryKey,
        (prev) => {
          if (prev) return { ...prev, name };
        },
      );

      options?.onSuccess?.(data, ...props);
    },
    onError: (error, ...props) => {
      toast.error(error.message);

      options?.onError?.(error, ...props);
    },
  });

  return mutation;
}

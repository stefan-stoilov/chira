import type { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
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

const { rpc } = hcInit<ProjectsRouter>();

export type CreateProjectRpc =
  (typeof rpc.api.workspaces)[":id"]["projects"]["$post"];

type RequestType = InferRequestType<CreateProjectRpc>;
type ResponseType = InferResponseType<CreateProjectRpc, 201>;

type UseCreateProjectOptions = Omit<
  UseMutationOptions<ResponseType, Error, RequestType>,
  "mutationFn"
>;

type UseCreateProjectResult = UseMutationResult<
  ResponseType,
  Error,
  RequestType
>;

export function useCreateProject(
  options: UseCreateProjectOptions = {},
): UseCreateProjectResult {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    ...options,
    mutationFn: async ({ param, json }) => {
      const res = await rpc.api.workspaces[":id"].projects.$post({
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
      toast.success("Project created.");

      const { workspaceId, id } = data;
      queryClient.invalidateQueries({
        queryKey: projectsQuery(workspaceId).queryKey,
      });

      router.push(`/dashboard/workspaces/${workspaceId}/projects/${id}`);

      options?.onSuccess?.(data, ...props);
    },
    onError: (error, ...props) => {
      toast.error(error.message);

      options?.onError?.(error, ...props);
    },
  });

  return mutation;
}

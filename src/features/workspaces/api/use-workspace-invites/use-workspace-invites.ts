import {
  useQuery,
  queryOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { workspacesKeys } from "../query-key-factory";

import type { InferResponseType } from "hono";
import { hcInit } from "@/lib/hc";
import type { WorkspacesRouter } from "@/server/routes/workspaces";

const { rpc } = hcInit<WorkspacesRouter>();

export type WorkspaceInvitesRpc =
  (typeof rpc.api.workspaces)[":id"]["invites"]["$get"];
export type UseWorkspaceInvitesData = InferResponseType<
  WorkspaceInvitesRpc,
  200
>;

type UseWorkspaceInvitesQueryOptions = Omit<
  UseQueryOptions<UseWorkspaceInvitesData, Error>,
  "queryKey" | "queryFn"
>;

enum Errors {
  NOT_FOUND = "Not found",
  UNAUTHORIZED = "Unauthorized",
  INTERNAL_SERVER_ERROR = "Internal Server Error",
}

export type WorkspaceInvitesQueryProps = {
  id: string;
  page: number;
};

export const workspaceInvitesQuery = ({
  id,
  page,
}: WorkspaceInvitesQueryProps) =>
  queryOptions<UseWorkspaceInvitesData, Error>({
    queryKey: workspacesKeys.invites({ id, page }),
    queryFn: async () => {
      const res = await rpc.api.workspaces[":id"].invites.$get({
        param: { id },
        query: { page },
      });

      if (!res.ok) {
        const { status } = res;

        if (status === 404)
          throw new Error("Oops, seems this workspace could not be found!", {
            cause: Errors.NOT_FOUND,
          });

        if (status === 401)
          throw new Error(Errors.UNAUTHORIZED, {
            cause: Errors.UNAUTHORIZED,
          });

        if (status === 500)
          throw new Error(Errors.INTERNAL_SERVER_ERROR, {
            cause: Errors.INTERNAL_SERVER_ERROR,
          });
      }

      return await res.json();
    },
    placeholderData: (prev) => prev,
    select: ({ invites, totalPages, currentPage }) => ({
      totalPages,
      currentPage,
      invites: invites.map((inv) => ({
        ...inv,
        createdAt: new Date(inv.createdAt).toDateString(),
        deletedAt: inv.deletedAt
          ? new Date(inv.deletedAt).toDateString()
          : null,
        acceptedAt: inv.acceptedAt
          ? new Date(inv.acceptedAt).toDateString()
          : null,
      })),
    }),
  });

export function useWorkspaceInvites({
  id,
  page,
  options,
}: WorkspaceInvitesQueryProps & {
  options?: UseWorkspaceInvitesQueryOptions;
}) {
  return useQuery(
    options
      ? { ...options, ...workspaceInvitesQuery({ id, page }) }
      : workspaceInvitesQuery({ id, page }),
  );
}

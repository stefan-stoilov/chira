import type { InferResponseType } from "hono";
import type { MembersRpc, UseMembersData } from "../../use-members";
import { WorkspaceRoles } from "@/server/db/schemas";
import * as http from "@/server/lib/http-status-codes";

export type SuccessDataProps = {
  firstMember?: Partial<UseMembersData["members"][0]>;
};

export const success = ({
  firstMember,
}: SuccessDataProps = {}): UseMembersData => ({
  members: [
    {
      id: firstMember?.id ?? "7c92cd64-15ad-4773-8b41-1391ef5e0418",
      name: firstMember?.name ?? "User One",
      role: firstMember?.role ?? WorkspaceRoles.owner,
      createdAt: firstMember?.createdAt ?? "2025-03-02T11:17:41.497Z",
    },
    {
      id: "af96ade5-9490-4dc7-8ff8-84f44086e008",
      name: "User Two",
      role:
        firstMember?.role && firstMember?.role !== WorkspaceRoles.owner
          ? WorkspaceRoles.owner
          : WorkspaceRoles.user,
      createdAt: "2025-06-20T18:05:10.641Z",
    },
    {
      id: "0dc2bb77-9ae9-46e6-8f7e-686c8825eaf4",
      name: "User Three",
      role: WorkspaceRoles.user,
      createdAt: "2025-06-28T11:55:58.560Z",
    },
    {
      id: "0dc2bb77-9ae9-46e6-8f7e-686c8825eaf5",
      name: "User Four",
      role: WorkspaceRoles.admin,
      createdAt: "2025-03-28T11:55:58.560Z",
    },
  ],
});

export const successStatus = { status: http.OK };

export const error = (
  message?: string,
): InferResponseType<MembersRpc, 401 | 404 | 422 | 500> => ({
  error: message ?? "Error",
});

export const errorStatus = (status?: 401 | 404 | 422 | 500) => ({
  status: status ?? http.INTERNAL_SERVER_ERROR,
});

import type { InferResponseType } from "hono";
import type { JoinWorkspaceRpc } from "../../use-join-workspace";
import * as http from "@/server/lib/http-status-codes";

type ResponseOk = InferResponseType<JoinWorkspaceRpc, typeof http.OK>;

export function success(name: string): ResponseOk {
  return { name };
}
export const successStatus = { status: http.OK };

export const errorNotFound: InferResponseType<
  JoinWorkspaceRpc,
  typeof http.NOT_FOUND
> = {
  error: "Not found",
};
export const errorNotFoundStatus = { status: http.NOT_FOUND };

export function errorAlreadyMember(
  name: string,
): InferResponseType<JoinWorkspaceRpc, typeof http.UNAUTHORIZED> {
  return { error: `You are already a member of workspace - ${name}.` };
}
export const errorAlreadyMemberStatus = { status: http.UNAUTHORIZED };

export const errorInternalServerError: InferResponseType<
  JoinWorkspaceRpc,
  typeof http.INTERNAL_SERVER_ERROR
> = {
  error: "Internal Server Error",
};
export const errorInternalSeverErrorStatus = {
  status: http.INTERNAL_SERVER_ERROR,
};

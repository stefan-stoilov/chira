import type { InferResponseType } from "hono";
import type { DeleteWorkspaceRpc } from "../../use-delete-workspace";
import * as http from "@/server/lib/http-status-codes";

export function success(
  id: string,
): InferResponseType<DeleteWorkspaceRpc, typeof http.OK> {
  return { id };
}
export const successStatus = { status: http.OK };

export const errorUnauthorized: InferResponseType<
  DeleteWorkspaceRpc,
  typeof http.UNAUTHORIZED
> = {
  error: "Unauthorized",
};
export const errorUnauthorizedStatus = { status: http.UNAUTHORIZED };

export const errorInternalServerError: InferResponseType<
  DeleteWorkspaceRpc,
  typeof http.INTERNAL_SERVER_ERROR
> = {
  error: "Internal Server Error",
};
export const errorInternalSeverErrorStatus = {
  status: http.INTERNAL_SERVER_ERROR,
};

export const errorNotFound: InferResponseType<
  DeleteWorkspaceRpc,
  typeof http.NOT_FOUND
> = {
  error: "Not found",
};
export const errorNotFoundStatus = { status: http.NOT_FOUND };

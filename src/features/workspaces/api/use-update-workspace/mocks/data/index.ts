import type { InferResponseType } from "hono";
import type { UpdateWorkspaceRpc } from "../../use-update-workspace";
import * as http from "@/server/lib/http-status-codes";

type SuccessProps = {
  id: string;
  name: string;
};

export function success(
  args: SuccessProps,
): InferResponseType<UpdateWorkspaceRpc, typeof http.OK> {
  return args;
}
export const successStatus = { status: http.OK };

export const errorUnauthorized: InferResponseType<
  UpdateWorkspaceRpc,
  typeof http.UNAUTHORIZED
> = {
  error: "Unauthorized",
};
export const errorUnauthorizedStatus = { status: http.UNAUTHORIZED };

export const errorNotFound: InferResponseType<
  UpdateWorkspaceRpc,
  typeof http.NOT_FOUND
> = {
  error: "Not Found",
};
export const errorNotFoundStatus = { status: http.UNAUTHORIZED };

export const errorInternalServerError: InferResponseType<
  UpdateWorkspaceRpc,
  typeof http.INTERNAL_SERVER_ERROR
> = {
  error: "Internal Server Error",
};
export const errorInternalSeverErrorStatus = {
  status: http.INTERNAL_SERVER_ERROR,
};

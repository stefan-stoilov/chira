import type { InferResponseType } from "hono";
import type { CurrentUserRpc } from "../../use-current-user";
import * as http from "@/server/lib/http-status-codes";

export const success: InferResponseType<CurrentUserRpc, typeof http.OK> = {
  id: "test",
  createdAt: "test",
  updatedAt: "test",
  name: "Test",
  email: "test@test.com",
  githubId: null,
};
export const successStatus = { status: http.OK };

export const error: InferResponseType<
  CurrentUserRpc,
  typeof http.UNAUTHORIZED
> = {
  error: "Error",
};
export const errorStatus = { status: http.UNAUTHORIZED };

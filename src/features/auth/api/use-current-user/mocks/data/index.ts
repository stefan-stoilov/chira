import type { InferResponseType } from "hono";
import type { CurrentUserRpc } from "../../use-current-user";
import * as http from "@/server/lib/http-status-codes";

export const MOCKED_USER = {
  id: "03345bad-a985-4bc5-8dba-3f75a0ed118e",
  createdAt: "2025-02-28 15:53:54.893131",
  updatedAt: "2025-02-28 15:53:54.893131",
  name: "Test",
  email: "test@test.com",
  githubId: null,
};

export const success: InferResponseType<CurrentUserRpc, typeof http.OK> =
  MOCKED_USER;
export const successStatus = { status: http.OK };

export const error: InferResponseType<
  CurrentUserRpc,
  typeof http.INTERNAL_SERVER_ERROR
> = {
  error: "Error",
};
export const errorStatus = { status: http.INTERNAL_SERVER_ERROR };

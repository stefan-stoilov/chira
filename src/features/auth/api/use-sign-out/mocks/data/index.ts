import type { InferResponseType } from "hono";
import type { SignOutRpc } from "../../use-sign-out";
import * as http from "@/server/lib/http-status-codes";

export const success: InferResponseType<SignOutRpc, typeof http.OK> = {
  success: true,
};
export const successStatus = { status: http.OK };

export const error: InferResponseType<SignOutRpc, typeof http.UNAUTHORIZED> = {
  error: "Unauthorized",
};
export const errorStatus = { status: http.UNAUTHORIZED };

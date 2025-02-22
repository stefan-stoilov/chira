import type { InferResponseType } from "hono";
import type { SignInRpc } from "../../use-sign-in";
import * as http from "@/server/lib/http-status-codes";

export const success: InferResponseType<SignInRpc, typeof http.OK> = {
  success: true,
};
export const successStatus = { status: http.OK };

export const error: InferResponseType<SignInRpc, typeof http.UNAUTHORIZED> = {
  error: "Unauthorized",
};
export const errorStatus = { status: http.UNAUTHORIZED };

import type { InferResponseType } from "hono";
import type { SignUpRpc } from "../../use-sign-up";
import * as http from "@/server/lib/http-status-codes";

export const success: InferResponseType<SignUpRpc, typeof http.CREATED> = {
  success: true,
};
export const successStatus = { status: http.CREATED };

export const error: InferResponseType<SignUpRpc, typeof http.UNAUTHORIZED> = {
  error: "Unauthorized",
};
export const errorStatus = { status: http.UNAUTHORIZED };

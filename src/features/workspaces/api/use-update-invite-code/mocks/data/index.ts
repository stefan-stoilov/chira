import type { InferResponseType } from "hono";
import type { UpdateInviteCodeRpc } from "../../use-update-invite-code";
import * as http from "@/server/lib/http-status-codes";
import { generateInviteCode } from "@/server/lib/utils";

export type ResponseOk = InferResponseType<UpdateInviteCodeRpc, typeof http.OK>;

export function successUpdate(id: string): ResponseOk {
  return { id, inviteCode: generateInviteCode() };
}

export function successRemove(id: string): ResponseOk {
  return { id };
}

export const successStatus = { status: http.OK };

export const errorInternalServerError: InferResponseType<
  UpdateInviteCodeRpc,
  typeof http.INTERNAL_SERVER_ERROR
> = {
  error: "Internal Server Error",
};
export const errorInternalSeverErrorStatus = {
  status: http.INTERNAL_SERVER_ERROR,
};

import { env } from "@/env";
import { hc } from "hono/client";
import type { AppType } from "@/server/app";

export const rpc = hc<AppType>(env.NEXT_PUBLIC_APP_URL);

export type RpcType = typeof rpc.api;

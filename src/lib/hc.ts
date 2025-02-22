import { hc } from "hono/client";
import type { OpenAPIHono } from "@hono/zod-openapi";
import type { AppBindings } from "@/server/lib/types";

export function hcInit<T extends OpenAPIHono<AppBindings, {}, "/">>() {
  const rpc = hc<T>(process.env.NEXT_PUBLIC_APP_URL!);

  return { rpc };
}

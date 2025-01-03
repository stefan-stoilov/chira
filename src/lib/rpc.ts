import { env } from "@/env";
import type { AppType } from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";

export const client = hc<AppType>(env.NEXT_PUBLIC_APP_URL);

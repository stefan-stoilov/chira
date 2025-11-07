import { pinoLogger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";

import { env } from "@/env";

export function logger() {
  return pinoLogger({
    pino: pino(env.NODE_ENV === "production" ? undefined : pretty()),
  });
}

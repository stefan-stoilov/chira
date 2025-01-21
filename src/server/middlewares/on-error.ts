import type { ErrorHandler } from "hono";
import type {
  ServerErrorStatusCode,
  ClientErrorStatusCode,
} from "hono/utils/http-status";

import { env } from "@/env";

export const onError: ErrorHandler = (err, c) => {
  const currentStatus =
    "status" in err ? err.status : c.newResponse(null).status;
  const statusCode =
    currentStatus !== 200
      ? (currentStatus as ServerErrorStatusCode | ClientErrorStatusCode)
      : 500;

  return c.json(
    {
      message: err.message,

      stack: env.NODE_ENV === "production" ? undefined : err.stack,
    },
    statusCode,
  );
};

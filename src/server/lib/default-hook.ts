import type { Hook } from "@hono/zod-openapi";
import type { AppBindings } from "./types";

export const defaultHook: Hook<unknown, AppBindings, string, unknown> = (
  result,
  c,
) => {
  if (!result.success) {
    return c.json(
      {
        success: result.success,
        error: result.error,
      },
      422,
    );
  }
};

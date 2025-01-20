import { z } from "@hono/zod-openapi";

export function createMessageSchema(message = "") {
  return z
    .object({
      message: z.string(),
    })
    .openapi({
      example: {
        message,
      },
    });
}

import { createRoute } from "@hono/zod-openapi";

import { createRouter } from "../lib/create-app";
import { jsonContent } from "../lib/utils";
import { createMessageSchema } from "../schemas";
import { sessionMiddleware } from "../middlewares";

const router = createRouter().openapi(
  createRoute({
    method: "get",
    path: "api/doc/test",
    middleware: [sessionMiddleware],
    responses: {
      200: jsonContent(createMessageSchema(), "Chira API Index"),
    },
  }),
  (c) => {
    return c.json(
      {
        message: "Chira API Index",
      },
      200,
    );
  },
);

export default router;

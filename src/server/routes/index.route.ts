import { createRoute } from "@hono/zod-openapi";

import { createRouter } from "../lib/create-app";
import { jsonContent, createMessageSchema } from "../lib/utils";
import { sessionMiddleware } from "../middlewares";

const router = createRouter().openapi(
  createRoute({
    method: "get",
    path: "api/doc/test",
    middleware: [sessionMiddleware],
    responses: {
      200: jsonContent(createMessageSchema(), "Chira API Test"),
    },
  }),
  (c) => {
    return c.json(
      {
        message: "Chira API Test",
      },
      200,
    );
  },
);

export default router;

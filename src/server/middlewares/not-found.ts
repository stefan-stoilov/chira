import type { NotFoundHandler } from "hono";

export const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      message: `NOT FOUND - ${c.req.path}`,
    },
    404,
  );
};

import type { SessionMiddlewareVariables } from "@/server/middlewares/session";

export const mockUser = {
  id: "user-123",
  name: "Test User",
};

type SessionMiddlewareMockFactoryProps = typeof mockUser;

export const sessionMiddlewareMockFactory = async (
  user: SessionMiddlewareMockFactoryProps = mockUser,
) => {
  const { createMiddleware } = await import("hono/factory");
  return {
    sessionMiddleware: createMiddleware<{
      Variables: SessionMiddlewareVariables;
    }>(async (c, next) => {
      c.set("user", user);
      await next();
    }),
  };
};

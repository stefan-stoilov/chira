import type { WorkspaceRoles } from "@/server/db/schemas";
import type { IsMemberMiddlewareVariables } from "./is-member";

export type MockMember = {
  userId: string;
  workspaceId: string;
  role: WorkspaceRoles;
  createdAt: Date;
  updatedAt: Date;
};

export const isMemberMiddlewareMockFactory = async (member: MockMember) => {
  const { createMiddleware } = await import("hono/factory");

  return {
    isMemberMiddleware: createMiddleware<{
      Variables: IsMemberMiddlewareVariables;
    }>(async (c, next) => {
      c.set("member", member);

      await next();
    }),
  };
};

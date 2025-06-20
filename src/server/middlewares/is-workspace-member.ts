// import { createMiddleware } from "hono/factory";
// import type { SessionMiddlewareVariables } from "./session";
// import { getContext } from "hono/context-storage";

// export type IsWorkspaceMemberMiddlewareVariables =
//   SessionMiddlewareVariables & {
//     test: string;
//   };

// export const isWorkspaceMemberMiddleware = createMiddleware<{
//   Variables: IsWorkspaceMemberMiddlewareVariables;
// }>(async (c, next) => {
//   const user = getContext<{ Variables: SessionMiddlewareVariables }>().var.user;
//   const workspaceId = c.req.param("id");

//   if (typeof workspaceId !== "string") {
//     const errMessage =
//       "isWorkspaceMemberMiddleware is being used for a route that does not have workspace ID parameter.";
//     console.error(errMessage);
//     throw new Error(errMessage);
//   }

//   c.set("test", `${workspaceId}`);

//   await next();
// });

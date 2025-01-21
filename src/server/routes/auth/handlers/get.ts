import type {
  AppRouteHandler,
  AppMiddlewareVariables,
} from "@/server/lib/types";
import type { SessionMiddlewareVariables } from "@/server/middlewares";
import type { GetCurrentRoute } from "../auth.routes";

export const getUser: AppRouteHandler<
  GetCurrentRoute,
  AppMiddlewareVariables<SessionMiddlewareVariables>
> = async (c) => {
  const { $id, $createdAt, $updatedAt, name, email } = c.get("user");

  return c.json({ $id, $createdAt, $updatedAt, name, email }, 200);
};

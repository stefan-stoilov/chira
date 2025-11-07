import type {
  OpenAPIHono,
  RouteConfig,
  RouteHandler,
  z,
} from "@hono/zod-openapi";
import type { Env } from "hono";
import type { RequestIdVariables } from "hono/request-id";
import type { PinoLogger } from "hono-pino";

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppBindings = {
  Variables: {
    requestId: RequestIdVariables;
    logger: PinoLogger;
  };
};

export type AppRouteHandler<
  R extends RouteConfig,
  A extends Env = AppBindings,
> = RouteHandler<R, A>;

export type AppMiddlewareVariables<T extends object> = AppBindings & {
  Variables: T;
};
export type ZodSchema =
  | z.ZodUnion<[z.ZodTypeAny]>
  | z.AnyZodObject
  | z.ZodArray<z.AnyZodObject>;

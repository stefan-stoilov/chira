import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppBindings, AppOpenAPI } from "./types";
import { notFound, onError } from "../middlewares";
import { defaultHook } from "./default-hook";

export function createRouter() {
  const app = new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
  return app;
}

export function createApp() {
  const app = createRouter();

  app.notFound(notFound);
  app.onError(onError);

  // app.use(pinoLogger());

  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route("/", router);
}

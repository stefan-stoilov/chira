import { OpenAPIHono } from "@hono/zod-openapi";
import { contextStorage } from "hono/context-storage";

import type { AppBindings, AppOpenAPI } from "./types";
import { notFound, onError } from "../middlewares";
import { defaultHook } from "./default-hook";

export function createRouter() {
  const app = new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
  return app;
}

export function createApp() {
  const app = createRouter();

  app.use(contextStorage());
  app.notFound(notFound);
  app.onError(onError);

  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route("/", router);
}
export type CreateTestAppReturnT = ReturnType<typeof createTestApp>;

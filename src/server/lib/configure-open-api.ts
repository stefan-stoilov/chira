import { logger } from "hono/logger";
import { apiReference } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "./types";

import packageJSON from "../../../package.json" with { type: "json" };

export function configureOpenAPI(app: AppOpenAPI) {
  app.use(logger());

  app.doc("/api/test/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Chira API",
    },
  });

  app.get(
    "/api/test/reference",
    apiReference({
      theme: "kepler",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      spec: {
        url: "/api/test/doc",
      },
    }),
  );
}

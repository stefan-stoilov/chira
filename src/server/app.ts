import { createApp } from "@/server/lib/create-app";
import { configureOpenAPI } from "@/server/lib/configure-open-api";

import auth from "./routes/auth";
import workspaces from "./routes/workspaces";

const app = createApp();

configureOpenAPI(app);

const routes = [auth, workspaces] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = (typeof routes)[number];

export { app };

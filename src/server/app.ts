import { createApp } from "@/server/lib/create-app";
import { configureOpenAPI } from "@/server/lib/configure-open-api";

import { authRouter } from "@/server/routes/auth";
import { workspacesRouter } from "@/server/routes/workspaces";
import { membersRouter } from "@/server/routes/workspaces/members";
import { projectsRouter } from "@/server/routes/workspaces/projects";

const app = createApp();
configureOpenAPI(app);

const routes = [
  authRouter,
  workspacesRouter,
  membersRouter,
  projectsRouter,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export { app };

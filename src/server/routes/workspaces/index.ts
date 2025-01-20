import { createRouter } from "@/server/lib/create-app";

import * as handlers from "./handlers";
import * as routes from "./workspaces.routes";

const router = createRouter()
  .openapi(routes.workspaces, handlers.get)
  .openapi(routes.createWorkspace, handlers.create);

export default router;

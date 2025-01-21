import { createRouter } from "@/server/lib/create-app";

import * as handlers from "./handlers";
import * as routes from "./auth.routes";

const router = createRouter()
  .openapi(routes.getCurrent, handlers.getUser)
  .openapi(routes.signIn, handlers.signIn)
  .openapi(routes.signUp, handlers.signUp)
  .openapi(routes.signOut, handlers.signOut);

export default router;

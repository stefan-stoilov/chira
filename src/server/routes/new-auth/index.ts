import { createRouter } from "@/server/lib/create-app";

import {
  oauthHandler,
  oauthCallbackHandler,
  signUpHandler,
  signInHandler,
  signOutHandler,
  healthCheckHandler,
} from "./auth.handlers";
import {
  oauthRoute,
  oauthCallbackRoute,
  signUpRoute,
  signInRoute,
  signOutRoute,
  healthCheckRoute,
} from "./auth.routes";

export const authRouter = createRouter()
  .openapi(signUpRoute, signUpHandler)
  .openapi(signInRoute, signInHandler)
  .openapi(signOutRoute, signOutHandler)
  .openapi(oauthRoute, oauthHandler)
  .openapi(oauthCallbackRoute, oauthCallbackHandler)
  .openapi(healthCheckRoute, healthCheckHandler);

export type AuthRouter = typeof authRouter;

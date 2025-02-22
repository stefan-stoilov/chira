import { createRouter } from "@/server/lib/create-app";

import {
  oauthHandler,
  oauthCallbackHandler,
  signUpHandler,
  signInHandler,
  signOutHandler,
  getUserHandler,
} from "./auth.handlers";
import {
  oauthRoute,
  oauthCallbackRoute,
  signUpRoute,
  signInRoute,
  signOutRoute,
  getUserRoute,
} from "./auth.routes";

export const authRouter = createRouter()
  .openapi(signUpRoute, signUpHandler)
  .openapi(signInRoute, signInHandler)
  .openapi(signOutRoute, signOutHandler)
  .openapi(oauthRoute, oauthHandler)
  .openapi(oauthCallbackRoute, oauthCallbackHandler)
  .openapi(getUserRoute, getUserHandler);

export type AuthRouter = typeof authRouter;

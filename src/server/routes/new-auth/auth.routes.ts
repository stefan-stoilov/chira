import { createRoute } from "@hono/zod-openapi";

import { signInSchema, signUpSchema } from "@/features/auth/schemas";
import { sessionMiddleware } from "@/server/middlewares/new-session";
import {
  createErrorMessageSchema,
  createSuccessSchema,
  createValidationErrorSchema,
  jsonContent,
  jsonContentRequired,
} from "@/server/lib/utils";
import * as http from "@/server/lib/http-status-codes";

const tags = ["Auth"];

export const oauthRoute = createRoute({
  method: "get",
  path: "/api/test/oauth",
  tags,
  responses: {
    [http.MOVED_PERMANENTLY]: {
      description: "Redirect",
    },
  },
});
export type OAuthRoute = typeof oauthRoute;

export const oauthCallbackRoute = createRoute({
  method: "get",
  path: "/api/test/oauth/callback",
  tags,
  responses: {
    [http.MOVED_PERMANENTLY]: {
      description: "Redirect",
    },
  },
});
export type OAuthCallbackRoute = typeof oauthCallbackRoute;

export const signInRoute = createRoute({
  method: "post",
  path: "/api/test/auth/sign-in",
  tags,
  request: {
    body: jsonContentRequired(signInSchema, "Credentials"),
  },
  responses: {
    [http.OK]: jsonContent(createSuccessSchema(), "Sign in"),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.UNPROCESSABLE_ENTITY]: jsonContent(
      createValidationErrorSchema(signInSchema),
      "The validation error(s)",
    ),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Server error",
    ),
  },
});
export type SignInRoute = typeof signInRoute;

export const signUpRoute = createRoute({
  method: "post",
  path: "/api/test/auth/sign-up",
  tags,
  request: {
    body: jsonContentRequired(signUpSchema, "Credentials"),
  },
  responses: {
    [http.CREATED]: jsonContent(createSuccessSchema(), "Sign up"),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.UNPROCESSABLE_ENTITY]: jsonContent(
      createValidationErrorSchema(signUpSchema),
      "The validation error(s)",
    ),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Server error",
    ),
  },
});
export type SignUpRoute = typeof signUpRoute;

export const healthCheckRoute = createRoute({
  method: "get",
  path: "/api/test/auth/health-check",
  tags,
  middleware: [sessionMiddleware] as const,
  responses: {
    [http.OK]: jsonContent(createSuccessSchema(), "Signed in"),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
  },
});
export type HealthCheckRoute = typeof healthCheckRoute;

export const signOutRoute = createRoute({
  method: "post",
  path: "/api/test/auth/sign-out",
  tags,
  responses: {
    [http.OK]: jsonContent(createSuccessSchema(), "Sign Out"),
    [http.UNAUTHORIZED]: jsonContent(
      createErrorMessageSchema(),
      "Unauthorized",
    ),
    [http.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorMessageSchema(),
      "Server error",
    ),
  },
});
export type SignOutRoute = typeof signOutRoute;
